import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/database";
import { TerraformService } from "@/lib/terraform";

export async function GET() {
  try {
    const users = await Database.getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email } = body;

    if (!username || !email) {
      return NextResponse.json(
        { error: "Username and email are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await Database.getUserByUsername(username);
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Create Terraform service
    const terraformService = new TerraformService({
      githubToken: process.env.GITHUB_TOKEN || "",
      organizationName: process.env.GITHUB_ORG || "HachimiTech",
      repoPrefix: process.env.REPO_PREFIX || "hachimi",
    });

    // Provision infrastructure
    const infrastructure = await terraformService.provisionUserInfrastructure(username);

    if (infrastructure.error) {
      return NextResponse.json(
        { error: infrastructure.error },
        { status: 500 }
      );
    }

    // Create user in database
    const user = await Database.createUser({
      username,
      email,
      githubRepo: infrastructure.repoUrl,
      cloudflarePageUrl: infrastructure.pagesUrl,
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
