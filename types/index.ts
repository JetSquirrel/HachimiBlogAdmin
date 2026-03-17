export interface User {
  id: string;
  username: string;
  email: string;
  githubRepo?: string;
  cloudflarePageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPost {
  id: string;
  userId: string;
  title: string;
  content: string;
  slug: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TerraformConfig {
  githubToken: string;
  organizationName: string;
  repoPrefix: string;
}

export interface GitHubRepo {
  name: string;
  fullName: string;
  url: string;
  defaultBranch: string;
}
