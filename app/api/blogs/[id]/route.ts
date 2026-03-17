import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/database";
import { GitHubService } from "@/lib/github";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await Database.getBlogPost(id);

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existingPost = await Database.getBlogPost(id);
    if (!existingPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    const post = await Database.updateBlogPost(id, body);

    // Update in GitHub if needed
    if (post && (body.content || body.title)) {
      const user = await Database.getUser(post.userId);
      if (user?.githubRepo && process.env.GITHUB_TOKEN) {
        try {
          const githubService = new GitHubService(process.env.GITHUB_TOKEN);
          const [owner, repo] = user.githubRepo.split("/").slice(-2);

          const markdown = `---
title: ${post.title}
slug: ${post.slug}
published: ${post.published}
date: ${post.updatedAt.toISOString()}
---

${post.content}
`;

          const file = await githubService.getFile(owner, repo, `posts/${post.slug}.md`);
          if (file) {
            await githubService.updateFile(
              owner,
              repo,
              `posts/${post.slug}.md`,
              markdown,
              `Update blog post: ${post.title}`,
              file.sha
            );
          }
        } catch (error) {
          console.error("Failed to update in GitHub:", error);
        }
      }
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await Database.deleteBlogPost(id);

    if (!success) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
