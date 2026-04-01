import { Badge } from "@/components/ui/badge";
import { ToolGrid } from "./ToolGrid";

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRpP5McaQlTg53FW1ZOPpiWPkyYcDPa20CPir-RM1NJXiklG90xM08jUA8-5fg8Ef7CwjTrEduxPbkk/pub?output=csv";

interface AiTool {
  category: string;
  name: string;
  link: string;
  features: string;
  logo: string;
  summary?: string;
}

function parseCSV(csv: string): AiTool[] {
  const lines = csv.split("\n");
  const dataLines = lines.slice(1);
  const tools: AiTool[] = [];

  let currentLine = "";
  for (const line of dataLines) {
    currentLine += (currentLine ? "\n" : "") + line;
    const quoteCount = (currentLine.match(/"/g) || []).length;
    if (quoteCount % 2 !== 0) continue;

    const cols: string[] = [];
    let inQuotes = false;
    let col = "";
    for (let i = 0; i < currentLine.length; i++) {
      const c = currentLine[i];
      if (c === '"') {
        inQuotes = !inQuotes;
      } else if (c === "," && !inQuotes) {
        cols.push(col.trim());
        col = "";
      } else {
        col += c;
      }
    }
    cols.push(col.trim());

    const category = cols[0] || "";
    const name = cols[1] || "";
    const link = cols[2] || "#";
    const features = cols[3] || "";
    const logo = cols[4] || "";
    const summary = cols[5] || "";

    if (name && category) {
      tools.push({ category, name, link: link || "#", features, logo, summary });
    }

    currentLine = "";
  }

  return tools;
}

async function getTools(): Promise<AiTool[]> {
  try {
    const res = await fetch(SHEET_CSV_URL, { next: { revalidate: 3600 } });
    const csv = await res.text();
    return parseCSV(csv);
  } catch (error) {
    console.error("Failed to fetch tools from Google Sheet:", error);
    return [];
  }
}

export default async function TopListAiPage() {
  const tools = await getTools();

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-12 max-w-3xl mx-auto space-y-4">
        <Badge
          variant="outline"
          className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 px-4 py-1.5"
        >
          {tools.length}+ Công Cụ AI
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Top List Công Cụ AI{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            Số 1
          </span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Bảng xếp hạng những công cụ Trí Tuệ Nhân Tạo được cộng đồng Aihubs
          đánh giá cao và sử dụng nhiều nhất cho công việc.
        </p>
      </div>

      {/* Interactive Grid (Client Component) */}
      <ToolGrid tools={tools} />

      {/* Empty State */}
      {tools.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">
            Đang tải danh sách công cụ AI... Vui lòng thử lại sau.
          </p>
        </div>
      )}
    </div>
  );
}
