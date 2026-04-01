import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, User, ChevronLeft, Share2, Globe, MessageCircle, Link as LinkIcon, ArrowRight } from "lucide-react";
import { posts } from "@/data/posts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/components/blog/mdx-components";
import { ShareButtons } from "@/components/blog/share-buttons";
import rehypeFixHtmlAttrs from "@/lib/rehype-fix-html-attrs";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: "Post Not Found" };

  const url = `https://aihubs.pro/blog/${slug}`;
  const imageUrl = post.coverImage.startsWith("http") ? post.coverImage : `https://aihubs.pro${post.coverImage}`;

  return {
    title: `${post.title} | Aihubs PRO`,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.excerpt,
      siteName: "Aihubs PRO",
      publishedTime: post.date,
      authors: [post.author],
      tags: [post.category],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = posts
    .filter((p) => p.category === post.category && p.slug !== post.slug && p.status !== "Draft")
    .slice(0, 3);

  // Fallback: nếu không đủ bài cùng category, bổ sung bài Published khác
  const fallbackPosts = relatedPosts.length < 3
    ? posts
        .filter((p) => p.slug !== post.slug && p.status !== "Draft" && !relatedPosts.find(r => r.slug === p.slug))
        .slice(0, 3 - relatedPosts.length)
    : [];
  const allRelatedPosts = [...relatedPosts, ...fallbackPosts];

  const nav = (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-500 mb-8">
      <Link href="/" className="hover:text-white transition-colors">Trang chủ</Link>
      <span aria-hidden="true">/</span>
      <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
      <span aria-hidden="true">/</span>
      <span className="text-slate-300 truncate max-w-[200px]" aria-current="page">{post.title}</span>
    </nav>
  );
  const tocMatches = Array.from(post.content.matchAll(/## (.*?)\n/g));
  const toc = tocMatches.map(match => {
    const title = match[1].split("{#")[0].trim();
    const id = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    return { title, id };
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 pb-20">
      {/* 1. Header Bài Viết */}
      <header className="relative pt-12 pb-16 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="container max-w-5xl mx-auto px-4">
          {nav}

          <Link 
            href="/blog" 
            className="inline-flex items-center text-sm text-emerald-400 hover:text-emerald-300 mb-8 transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Quay lại Blog
          </Link>

          <Badge className="mb-6 bg-emerald-500/20 text-emerald-400 border-emerald-500/20 px-3 py-1">
            {post.category}
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-[1.1] font-heading">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-6 pb-12 border-b border-white/5">
            <div className="flex items-center gap-4">
          <Image 
                src={post.authorAvatar} 
                alt={post.author}
                width={48}
                height={48}
                className="rounded-full border-2 border-emerald-500/20"
                sizes="48px"
              />
              <div>
                <p className="font-medium text-slate-200">{post.author}</p>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ShareButtons url={`https://aihubs.pro/blog/${post.slug}`} title={post.title} variant="header" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <div className="container max-w-5xl mx-auto px-4 -mt-8 relative z-10">
        <div className="relative aspect-[21/9] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
            quality={85}
            sizes="(max-width: 1024px) 100vw, 80vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent" />
        </div>
      </div>

      {/* 2. & 3. Main Layout: Content + ToC */}
      <main className="container max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-16">
          {/* Main Content */}
          <section className="max-w-3xl mx-auto lg:mx-0 w-full overflow-hidden">
            <div className="prose-content">
              <MDXRemote 
                source={post.content} 
                components={mdxComponents}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [
                      rehypeFixHtmlAttrs,
                      rehypeSlug,
                      [rehypePrettyCode, {
                        theme: "github-dark",
                        keepBackground: true,
                      }]
                    ]
                  }
                }}
              />
            </div>
            
            {/* Post Footer/Newsletter */}
            <div className="mt-20 p-8 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 shadow-neon-sm">
              <h3 className="text-2xl font-bold mb-4 font-heading">Đăng ký nhận tin AI mới nhất</h3>
              <p className="text-slate-400 mb-6">Đừng bỏ lỡ những bài viết chuyên sâu và công cụ AI đỉnh cao được cập nhật hàng tuần.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Email của bạn..." 
                  className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <Button className="bg-emerald-500 hover:bg-emerald-600 font-bold px-6 shadow-neon">Đăng ký ngay</Button>
              </div>
            </div>
          </section>

          {/* Sticky Sidebar (ToC) */}
          <aside className="hidden lg:block">
            <div className="sticky top-32 space-y-12">
              {toc.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6 font-heading">Mục lục bài viết</h4>
                  <ul className="space-y-4 border-l border-white/5">
                    {toc.map((item, index) => (
                      <li key={index}>
                        <a 
                          href={`#${item.id}`}
                          className="block pl-4 -ml-px border-l border-transparent text-sm text-slate-500 hover:text-emerald-400 hover:border-emerald-500 transition-all font-medium"
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6 font-heading">Chia sẻ</h4>
                <ShareButtons url={`https://aihubs.pro/blog/${post.slug}`} title={post.title} variant="sidebar" />
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* 4. Bài Viết Liên Quan Section */}
      {allRelatedPosts.length > 0 && (
        <section aria-label="Bài viết liên quan" className="bg-white/[0.02] border-t border-white/5 py-24">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold font-heading">Bài viết liên quan</h2>
              <Link href="/blog" className="text-emerald-400 group flex items-center gap-2 px-4 py-2 hover:bg-emerald-500/10 rounded-lg transition-all">
                Xem tất cả <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {allRelatedPosts.map((p) => (
                <Card 
                  key={p.id} 
                  className="glass-card overflow-hidden group border-white/5 hover:border-emerald-500/20 transition-all flex flex-col h-full"
                >
                  <Link href={`/blog/${p.slug}`} className="block relative aspect-[16/10] overflow-hidden" aria-label={`Đọc bài viết: ${p.title}`}>
                    <Image 
                      src={p.coverImage} 
                      alt={p.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-1000"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </Link>
                  <CardContent className="p-6 flex flex-col flex-1">
                    <Badge className="w-fit mb-4 bg-white/5 border-white/10 text-slate-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
                      {p.category}
                    </Badge>
                    <Link href={`/blog/${p.slug}`}>
                      <h3 className="text-lg font-bold group-hover:text-emerald-400 transition-colors leading-tight mb-4 font-heading line-clamp-2">
                        {p.title}
                      </h3>
                    </Link>
                    <div className="mt-auto flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-white/5">
                      <span>{p.date}</span>
                      <span>{p.readTime}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
