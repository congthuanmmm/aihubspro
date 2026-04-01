import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { slugify } from "@/lib/slugify";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "src/data/posts.json");
    const fileData = await fs.readFile(filePath, "utf-8");
    const posts = JSON.parse(fileData);
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, excerpt, coverImage, category, content: rawContent, status = "Published" } = body;

    // Convert standalone YouTube links to <YouTube url="..." />
    // This looks for lines that exactly match a YouTube URL.
    const withYouTubeContent = rawContent.replace(
      /^\s*(https:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)[^\s]+)\s*$/gm, 
      '<YouTube url="$1" />'
    );

    // Prepare content: Escape curly braces that are not part of MDX components
    // This prevents "Could not parse expression with acorn" errors when users paste JSON-like text.
    const escapedContent = withYouTubeContent.replace(/([{}])/g, (match: string, char: string, offset: number) => {
      // Look back to see if we are inside a tag (very basic check)
      const textBefore = withYouTubeContent.slice(0, offset);

      const lastOpenTag = textBefore.lastIndexOf("<");
      const lastCloseTag = textBefore.lastIndexOf(">");
      
      // If we are inside a tag like <YouTube ... />, don't escape
      if (lastOpenTag > lastCloseTag) {
        return char;
      }
      return char === "{" ? "&#123;" : "&#125;";
    });

    // 1. Auto-Format Logic
    const rawLines = escapedContent.replace(/\r\n/g, "\n").split("\n");
    const formattedLines = rawLines.map((line: string) => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      
      let processed = trimmed;
      
      // Auto-Callout (must be done BEFORE auto-bold to match properly)
      if (/^(Lưu ý|Chú ý|Note|Warning):/i.test(processed)) {
        processed = `<Callout type="warning">\n  ${processed}\n</Callout>`;
      } else if (/^(Mẹo|Tip|Info):/i.test(processed)) {
        processed = `<Callout type="info">\n  ${processed}\n</Callout>`;
      }

      // Auto-bold phrases ending with colon before space/end (e.g., "- Lợi ích: abc" -> "- **Lợi ích:** abc")
      // Do not apply if inside Callout
      if (!processed.startsWith('<Callout')) {
        processed = processed.replace(/^((?:[-*]\s|\d+\.\s)?)([^:*_]{2,60}):(\s|$)/, "$1**$2:**$3");
      }

      // Auto-italicize quotes (e.g., "... “abc” ... " -> "... *“abc”* ... ")
      processed = processed.replace(/(“[^”]+”)/g, (match) => `*${match}*`);
      // Cleanup double asterisks if it was already formatted
      processed = processed.replace(/\*\*\*/g, '*');

      // Auto Heading: Short line (< 70), no ending punctuation, starts with Uppercase, not a list item
      const isShort = processed.length > 0 && processed.length < 70;
      const noEndingPunctuation = !/[.,?!:;]$/.test(processed);
      const isNotListOrQuote = !/^[-*>]\s/.test(processed) && !/^\d+\.\s/.test(processed);
      const firstChar = processed.replace(/^[-*>\s]+|^\d+\.\s+/, "").charAt(0);
      const startsWithUppercase = firstChar === firstChar.toUpperCase() && firstChar !== firstChar.toLowerCase();
      
      if (isShort && noEndingPunctuation && isNotListOrQuote && startsWithUppercase && !processed.startsWith("#")) {
        processed = `## ${processed}`;
      }
      
      return processed;
    }).filter((line: string) => line.length > 0);

    // Join with \n\n for paragraphs, but keep lists together with \n
    const finalContent = formattedLines.reduce((acc: string, curr: string, idx: number, arr: string[]) => {
      if (idx === 0) return curr;
      const prev = arr[idx - 1];
      const currIsList = /^[-*]\s|^\d+\.\s/.test(curr);
      const prevIsList = /^[-*]\s|^\d+\.\s/.test(prev);
      
      if (currIsList && prevIsList) {
        return acc + "\n" + curr;
      }
      return acc + "\n\n" + curr;
    }, "");

    // 2. Generate Metadata
    const newPost = {
      id: Date.now().toString(),
      slug: slugify(title),
      title,
      excerpt,
      category,
      date: new Date().toLocaleDateString("vi-VN"),
      readTime: `${Math.ceil(finalContent.split(" ").length / 200)} min read`,
      author: "Admin",
      authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop",
      featured: false,
      coverImage: coverImage.startsWith("http") || coverImage.startsWith("/") ? coverImage : `/blog/${coverImage}`,
      content: finalContent,
      status
    };

    // 3. Perspectives File
    const filePath = path.join(process.cwd(), "src/data/posts.json");
    console.log("Saving post to:", filePath);

    let posts = [];
    try {
      const fileData = await fs.readFile(filePath, "utf-8");
      posts = JSON.parse(fileData);
    } catch (e) {
      console.error("Error reading file, creating new array:", e);
    }
    
    // Add to top (newest first)
    posts.unshift(newPost);
    
    await fs.writeFile(filePath, JSON.stringify(posts, null, 2), "utf-8");
    console.log("Post saved successfully!");

    return NextResponse.json({ success: true, slug: newPost.slug });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ success: false, error: "Failed to create post" }, { status: 500 });
  }
}
