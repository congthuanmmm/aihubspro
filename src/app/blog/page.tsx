"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, User, Search, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { posts } from "@/data/posts";
import { cn } from "@/lib/utils";

const CATEGORIES = ["Tất cả", "Tutorial", "Review", "Tips & Tricks", "Case Study"];

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [displayCount, setDisplayCount] = useState(6);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "Tất cả" || post.category === selectedCategory;
      const isPublished = post.status !== "Draft";
      return matchesSearch && matchesCategory && isPublished;
    });
  }, [searchTerm, selectedCategory]);

  const featuredPost = posts.find(p => p.featured) || posts[0];
  const regularPosts = filteredPosts.filter(p => p.id !== (searchTerm || selectedCategory !== "Tất cả" ? "" : featuredPost.id));
  const visiblePosts = regularPosts.slice(0, displayCount);

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Hero Section with Featured Post */}
      {!searchTerm && selectedCategory === "Tất cả" && (
        <section className="relative pt-12 pb-20 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)] pointer-events-none" />
          
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 font-heading">
                Blog <span className="text-emerald-500">Kiến Thức</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-2xl">
                Nơi hội tụ những kiến thức thực chiến nhất về AI, MMO và tương lai của công nghệ sáng tạo.
              </p>
            </div>

            <Card className="glass-card overflow-hidden border-white/5 hover:border-emerald-500/20 group">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative aspect-video lg:aspect-auto h-full overflow-hidden">
                  <Image 
                    src={featuredPost.coverImage} 
                    alt={featuredPost.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent lg:hidden" />
                </div>
                
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <Badge className="w-fit mb-6 bg-emerald-500/20 text-emerald-400 border-emerald-500/20">
                    Featured Post
                  </Badge>
                  
                  <Link href={`/blog/${featuredPost.slug}`}>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 group-hover:text-emerald-400 transition-colors leading-tight font-heading">
                      {featuredPost.title}
                    </h2>
                  </Link>
                  
                  <p className="text-slate-400 text-lg mb-8 line-clamp-3 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <Image 
                        src={featuredPost.authorAvatar} 
                        alt={featuredPost.author}
                        width={40}
                        height={40}
                        className="rounded-full border border-white/10"
                      />
                      <div>
                        <p className="text-sm font-medium">{featuredPost.author}</p>
                        <p className="text-xs text-slate-500">{featuredPost.date} • {featuredPost.readTime}</p>
                      </div>
                    </div>
                    
                    <Link 
                      href={`/blog/${featuredPost.slug}`}
                      className={cn(buttonVariants({ variant: "ghost" }), "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 gap-2")}
                    >
                      Đọc bài viết <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Filter & Search Section */}
      <section className="sticky top-[80px] z-30 bg-slate-950/80 backdrop-blur-md border-y border-white/5 py-6 mb-12">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar w-full md:w-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap border",
                  selectedCategory === cat 
                    ? "bg-emerald-500 border-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
                    : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Tìm kiếm..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="container mx-auto px-4 md:px-6">
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visiblePosts.map((post) => (
              <Card 
                key={post.id} 
                className="glass-card overflow-hidden group border-white/5 hover:border-emerald-500/20 transition-all flex flex-col h-full"
              >
                <Link href={`/blog/${post.slug}`} className="block relative aspect-video overflow-hidden">
                  <Image 
                    src={post.coverImage} 
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <Badge className="absolute top-4 left-4 bg-black/40 backdrop-blur-md border-white/10 text-white">
                    {post.category}
                  </Badge>
                </Link>
                
                <CardContent className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                  </div>
                  
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="text-xl font-bold mb-4 group-hover:text-emerald-400 transition-colors leading-tight font-heading">
                      {post.title}
                    </h3>
                  </Link>
                  
                  <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="mt-auto flex items-center gap-3 pt-6 border-t border-white/5">
                    <Image 
                      src={post.authorAvatar} 
                      alt={post.author}
                      width={32}
                      height={32}
                      className="rounded-full border border-white/10"
                    />
                    <span className="text-sm font-medium text-slate-300">{post.author}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 glass-card rounded-3xl border-dashed">
            <p className="text-slate-500">Không tìm thấy bài viết nào phù hợp với yêu cầu của bạn.</p>
            <Button 
              variant="link" 
              onClick={() => {setSearchTerm(""); setSelectedCategory("Tất cả");}}
              className="text-emerald-400 mt-4"
            >
              Đặt lại bộ lọc
            </Button>
          </div>
        )}
        
        {displayCount < regularPosts.length && (
          <div className="flex justify-center mt-16">
            <Button 
              variant="outline" 
              className="rounded-full px-8 py-6 border-emerald-500/20 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all text-lg"
              onClick={() => setDisplayCount(prev => prev + 3)}
            >
              Xem Thêm Bài Viết
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
