import { GitHubRepo } from "@/types";

export class GitHubService {
  private token: string;
  private baseUrl = "https://api.github.com";

  constructor(token?: string) {
    this.token = token || process.env.GITHUB_TOKEN || "";
  }

  private async fetch(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Authorization": `Bearer ${this.token}`,
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return response.json();
  }

  async createRepository(name: string, organization?: string): Promise<GitHubRepo> {
    const endpoint = organization
      ? `/orgs/${organization}/repos`
      : "/user/repos";

    const data = await this.fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({
        name,
        description: `Blog repository for ${name}`,
        auto_init: true,
        private: false,
      }),
    });

    return {
      name: data.name,
      fullName: data.full_name,
      url: data.html_url,
      defaultBranch: data.default_branch,
    };
  }

  async getRepository(owner: string, repo: string): Promise<GitHubRepo | null> {
    try {
      const data = await this.fetch(`/repos/${owner}/${repo}`);
      return {
        name: data.name,
        fullName: data.full_name,
        url: data.html_url,
        defaultBranch: data.default_branch,
      };
    } catch (error) {
      return null;
    }
  }

  async createFile(
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string
  ): Promise<void> {
    const encodedContent = Buffer.from(content).toString("base64");
    await this.fetch(`/repos/${owner}/${repo}/contents/${path}`, {
      method: "PUT",
      body: JSON.stringify({
        message,
        content: encodedContent,
      }),
    });
  }

  async updateFile(
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string,
    sha: string
  ): Promise<void> {
    const encodedContent = Buffer.from(content).toString("base64");
    await this.fetch(`/repos/${owner}/${repo}/contents/${path}`, {
      method: "PUT",
      body: JSON.stringify({
        message,
        content: encodedContent,
        sha,
      }),
    });
  }

  async getFile(owner: string, repo: string, path: string): Promise<{ content: string; sha: string } | null> {
    try {
      const data = await this.fetch(`/repos/${owner}/${repo}/contents/${path}`);
      const content = Buffer.from(data.content, "base64").toString("utf-8");
      return {
        content,
        sha: data.sha,
      };
    } catch (error) {
      return null;
    }
  }

  async listFiles(owner: string, repo: string, path: string = ""): Promise<Array<{ name: string; path: string; type: string }>> {
    try {
      const data = await this.fetch(`/repos/${owner}/${repo}/contents/${path}`);
      return Array.isArray(data) ? data.map(item => ({
        name: item.name,
        path: item.path,
        type: item.type,
      })) : [];
    } catch (error) {
      return [];
    }
  }

  async deleteRepository(owner: string, repo: string): Promise<void> {
    await this.fetch(`/repos/${owner}/${repo}`, {
      method: "DELETE",
    });
  }
}
