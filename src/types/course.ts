export interface Course {
  id: string; // Document ID (slug)
  title: string;
  desc: string;
  price: string;
  numericPrice: number;
  oldPrice?: string;
  students?: string;
  rating?: number;
  badge?: string;
  tag?: string;
  color?: string;
  features: string[];
  videoUrl?: string;
}
