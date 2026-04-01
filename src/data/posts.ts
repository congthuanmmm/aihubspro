import postsData from "./posts.json";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  authorAvatar: string;
  coverImage: string;
  featured: boolean;
  content: string;
  status?: "Draft" | "Published";
}

export const posts: BlogPost[] = postsData as BlogPost[];
