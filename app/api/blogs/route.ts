import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/database";
import { GitHubService } from "@/lib/github";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    const posts = userId
      ? await Database.getBlogPostsByUser(userId)
      : await Database.getAllBlogPosts();

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, title, content, slug, published = false } = body;

    if (!userId || !title || !content || !slug) {
      return NextResponse.json(
        { error: "userId, title, content, and slug are required" },
        { status: 400 }
      );
    }

    // Get user to find their GitHub repo
    const user = await Database.getUser(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Create blog post in database
    const post = await Database.createBlogPost({
      userId,
      title,
      content,
      slug,
      published,
    });

    // If user has a GitHub repo, push the content
    if (user.githubRepo && process.env.GITHUB_TOKEN) {
      try {
        const githubService = new GitHubService(process.env.GITHUB_TOKEN);
        const [owner, repo] = user.githubRepo.split("/").slice(-2);

        // Create markdown file in the repository
        const markdown = `---
title: ${title}
slug: ${slug}
published: ${published}
date: ${new Date().toISOString()}
---

${content}
`;

        await githubService.createFile(
          owner,
          repo,
          `posts/${slug}.md`,
          markdown,
          `Add blog post: ${title}`
        );
      } catch (error) {
        console.error("Failed to push to GitHub:", error);
        // Continue even if GitHub push fails
      }
    }

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
