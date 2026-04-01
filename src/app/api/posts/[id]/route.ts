import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { slugify } from "@/lib/slugify";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, excerpt, coverImage, category, content: rawContent, status = "Published" } = body;

    const filePath = path.join(process.cwd(), "src/data/posts.json");
    const fileData = await fs.readFile(filePath, "utf-8");
    let posts = JSON.parse(fileData);

    const postIndex = posts.findIndex((p: any) => p.id === id);
    if (postIndex === -1) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    // Auto-Format Logic
    const withYouTubeContent = rawContent.replace(
      /^\s*(https:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)[^\s]+)\s*$/gm, 
      '<YouTube url="$1" />'
    );

    const escapedContent = withYouTubeContent.replace(/([{}])/g, (match: string, char: string, offset: number) => {
      const textBefore = withYouTubeContent.slice(0, offset);
      const lastOpenTag = textBefore.lastIndexOf("<");
      const lastCloseTag = textBefore.lastIndexOf(">");
      if (lastOpenTag > lastCloseTag) {
        return char;
      }
      return char === "{" ? "&#123;" : "&#125;";
    });

    const rawLines = escapedContent.replace(/\r\n/g, "\n").split("\n");
    const formattedLines = rawLines.map((line: string) => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      
      let processed = trimmed;
      
      // Auto-Callout
      if (/^(Lưu ý|Chú ý|Note|Warning):/i.test(processed)) {
        processed = `<Callout type="warning">\n  ${processed}\n</Callout>`;
      } else if (/^(Mẹo|Tip|Info):/i.test(processed)) {
        processed = `<Callout type="info">\n  ${processed}\n</Callout>`;
      }

      // Auto-bold
      if (!processed.startsWith('<Callout')) {
        processed = processed.replace(/^((?:[-*]\s|\d+\.\s)?)([^:*_]{2,60}):(\s|$)/, "$1**$2:**$3");
      }

      // Auto-italicize quotes
      processed = processed.replace(/(“[^”]+”)/g, (match: string) => `*${match}*`);
      processed = processed.replace(/\*\*\*/g, '*'); 

      // Auto Heading
      const isShort = processed.length > 0 && processed.length < 70;
      const noEndingPunctuation = !/[.,?!:;]$/.test(processed);
      const isNotListOrQuote = !/^[-*>\s]+|^\d+\.\s+/.test(processed);
      const firstChar = processed.replace(/^[-*>\s]+|^\d+\.\s+/, "").charAt(0);
      const startsWithUppercase = firstChar === firstChar.toUpperCase() && firstChar !== firstChar.toLowerCase();
      
      if (isShort && noEndingPunctuation && isNotListOrQuote && startsWithUppercase && !processed.startsWith("#")) {
        processed = `## ${processed}`;
      }
      
      return processed;
    }).filter((line: string) => line.length > 0);

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

    // Update Post
    posts[postIndex] = {
      ...posts[postIndex],
      slug: slugify(title),
      title,
      excerpt,
      category,
      coverImage: coverImage.startsWith("http") || coverImage.startsWith("/") ? coverImage : `/blog/${coverImage}`,
      content: finalContent,
      status
    };

    await fs.writeFile(filePath, JSON.stringify(posts, null, 2), "utf-8");

    return NextResponse.json({ success: true, slug: posts[postIndex].slug });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ success: false, error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const filePath = path.join(process.cwd(), "src/data/posts.json");
    const fileData = await fs.readFile(filePath, "utf-8");
    let posts = JSON.parse(fileData);

    const initialLength = posts.length;
    posts = posts.filter((p: any) => p.id !== id);

    if (posts.length === initialLength) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    await fs.writeFile(filePath, JSON.stringify(posts, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ success: false, error: "Failed to delete post" }, { status: 500 });
  }
}
