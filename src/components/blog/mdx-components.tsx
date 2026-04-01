import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const mdxComponents = {
  h1: ({ className, ...props }: any) => (
    <h1 className={cn("text-4xl font-bold mt-8 mb-4", className)} {...props} />
  ),
  h2: ({ className, ...props }: any) => (
    <h2 className={cn("text-3xl font-bold mt-12 mb-4 scroll-m-20", className)} {...props} />
  ),
  h3: ({ className, ...props }: any) => (
    <h3 className={cn("text-2xl font-bold mt-8 mb-4 scroll-m-20", className)} {...props} />
  ),
  p: ({ className, ...props }: any) => (
    <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)} {...props} />
  ),
  ul: ({ className, ...props }: any) => (
    <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)} {...props} />
  ),
  ol: ({ className, ...props }: any) => (
    <ol className={cn("my-6 ml-6 list-decimal [&>li]:mt-2", className)} {...props} />
  ),
  li: ({ className, ...props }: any) => (
    <li className={cn("mt-2", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: any) => (
    <blockquote className={cn("mt-6 border-l-4 border-emerald-500/50 pl-6 italic text-slate-300 bg-emerald-500/5 py-3 pr-4 rounded-r-lg", className)} {...props} />
  ),
  strong: ({ className, ...props }: any) => (
    <strong className={cn("font-bold text-emerald-400", className)} {...props} />
  ),
  em: ({ className, ...props }: any) => (
    <em className={cn("italic text-emerald-300", className)} {...props} />
  ),
  a: ({ className, ...props }: any) => (
    <Link 
      className={cn("font-medium text-emerald-400 underline underline-offset-4 hover:text-emerald-300", className)} 
      href={props.href}
      {...props} 
    />
  ),
  img: ({ className, alt, src, ...props }: any) => (
    <img
      src={src}
      alt={alt || "Blog image"}
      className={cn("w-full h-auto mx-auto my-8 rounded-2xl object-cover border border-white/10 shadow-2xl", className)}
      {...props}
    />
  ),
  iframe: ({ className, frameborder, frameBorder, allowfullscreen, allowFullScreen, width, height, ...rest }: any) => (
    <div className="relative w-full aspect-video my-8 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      <iframe 
        className={cn("absolute inset-0 w-full h-full", className)}
        style={{ border: "none" }}
        allowFullScreen
        {...rest} 
      />
    </div>
  ),
  YouTube: ({ id, url }: { id?: string; url?: string }) => {
    let videoId = id;
    if (url) {
      const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^"&?\/\s]{11})/);
      if (match) videoId = match[1];
    }
    if (!videoId) return null;
    
    return (
      <div className="relative aspect-video my-8 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  },
  Callout: ({ children, type = "info" }: { children: React.ReactNode, type?: "info" | "warning" | "error" }) => (
    <div className={cn(
      "my-6 p-4 rounded-xl border-l-4",
      type === "info" && "bg-emerald-500/5 border-emerald-500 text-emerald-200",
      type === "warning" && "bg-yellow-500/5 border-yellow-500 text-yellow-200",
      type === "error" && "bg-red-500/5 border-red-500 text-red-200"
    )}>
      {children}
    </div>
  ),
};
