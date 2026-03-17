import { User, BlogPost } from "@/types";

// In-memory storage (replace with actual database in production)
const users: Map<string, User> = new Map();
const blogPosts: Map<string, BlogPost> = new Map();

export class Database {
  // User operations
  static async createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const user: User = {
      ...userData,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.set(id, user);
    return user;
  }

  static async getUser(id: string): Promise<User | null> {
    return users.get(id) || null;
  }

  static async getUserByUsername(username: string): Promise<User | null> {
    for (const user of users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return null;
  }

  static async getAllUsers(): Promise<User[]> {
    return Array.from(users.values());
  }

  static async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
    const user = users.get(id);
    if (!user) return null;

    const updatedUser = {
      ...user,
      ...userData,
      id,
      updatedAt: new Date(),
    };
    users.set(id, updatedUser);
    return updatedUser;
  }

  static async deleteUser(id: string): Promise<boolean> {
    return users.delete(id);
  }

  // Blog post operations
  static async createBlogPost(postData: Omit<BlogPost, "id" | "createdAt" | "updatedAt">): Promise<BlogPost> {
    const id = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const post: BlogPost = {
      ...postData,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    blogPosts.set(id, post);
    return post;
  }

  static async getBlogPost(id: string): Promise<BlogPost | null> {
    return blogPosts.get(id) || null;
  }

  static async getBlogPostsByUser(userId: string): Promise<BlogPost[]> {
    return Array.from(blogPosts.values()).filter(post => post.userId === userId);
  }

  static async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(blogPosts.values());
  }

  static async updateBlogPost(id: string, postData: Partial<BlogPost>): Promise<BlogPost | null> {
    const post = blogPosts.get(id);
    if (!post) return null;

    const updatedPost = {
      ...post,
      ...postData,
      id,
      updatedAt: new Date(),
    };
    blogPosts.set(id, updatedPost);
    return updatedPost;
  }

  static async deleteBlogPost(id: string): Promise<boolean> {
    return blogPosts.delete(id);
  }
}
