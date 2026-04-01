"use client"

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Send, FileText, Image as ImageIcon, Tag, ChevronLeft, Pencil, Trash2, Globe, FileSignature, Users } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import nextDynamic from "next/dynamic"

// Import MDEditor dynamically to avoid SSR issues
const MDEditor = nextDynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false, loading: () => <div className="h-96 w-full animate-pulse bg-slate-900/50 rounded-xl" /> }
)

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState<any[]>([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [editId, setEditId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    coverImage: "",
    category: "Tutorial",
    status: "Published",
    content: ""
  })

  // Fetch posts on mount
  const fetchPosts = async () => {
    setLoadingPosts(true)
    try {
      const res = await fetch("/api/posts")
      if (res.ok) {
        const data = await res.json()
        setPosts(data)
      }
    } catch (e) {
      console.error("Failed to fetch posts:", e)
    } finally {
      setLoadingPosts(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleEdit = (post: any) => {
    setEditId(post.id)
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      coverImage: post.coverImage.replace("/blog/", ""), // Assuming cover image usually prefixed or URL
      category: post.category,
      status: post.status || "Published", // fallback for older posts
      content: post.content
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) return;
    
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "DELETE"
      })
      if (res.ok) {
        fetchPosts() // refresh list
      } else {
        alert("Xoá bài viết thất bại!")
      }
    } catch (e) {
      console.error(e)
      alert("Lỗi kết nối!")
    }
  }

  const resetForm = () => {
    setEditId(null)
    setFormData({
      title: "",
      excerpt: "",
      coverImage: "",
      category: "Tutorial",
      status: "Published",
      content: ""
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitting form...", formData)
    setLoading(true)

    try {
      // If editId is present, we PUT instead of POST
      const url = editId ? `/api/posts/${editId}` : "/api/posts"
      const method = editId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      console.log("Response status:", res.status)
      if (res.ok) {
        const data = await res.json()
        console.log("Success:", data)
        alert(editId ? "Cập nhật thành công!" : "Đăng bài thành công!")
        resetForm()
        fetchPosts()
        // If published, maybe redirect or just stay? We'll stay on page to manage more.
      } else {
        const errData = await res.json()
        console.error("Error from API:", errData)
        alert(`Lỗi: ${errData.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Fetch error:", error)
      alert("Đã có lỗi xảy ra khi kết nối server!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-8 w-full mx-auto relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
          
          {/* Main Form Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="glass-card border-white/10 shadow-neon-sm overflow-hidden">
              <CardHeader className="border-b border-white/5 bg-white/[0.02] p-8">
                <div className="flex items-center gap-3 mb-2">
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/20">Admin Panel</Badge>
                  <Badge variant="outline" className="border-white/10 text-slate-500">v2.1 CRUD</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-3xl md:text-4xl font-bold font-heading flex items-center gap-3">
                    <FileText className="text-emerald-500 w-8 h-8" />
                    {editId ? "Chỉnh Sửa Bài Viết" : "Tạo Bài Viết Mới"}
                  </CardTitle>
                  {editId && (
                    <Button variant="outline" size="sm" onClick={resetForm} className="border-white/10 text-slate-400 hover:text-white">
                      Hủy Sửa
                    </Button>
                  )}
                </div>
                <CardDescription className="text-slate-400 text-lg mt-2">
                  Mọi định dạng sẽ được Auto-Format chuẩn theo Markdown cao cấp.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Tiêu đề bài viết
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Ví dụ: Cách dùng GPT-5.0..."
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-white"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-emerald-500" /> Danh mục
                      </label>
                      <select
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-white [&>option]:bg-slate-900"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option>Tutorial</option>
                        <option>Review</option>
                        <option>News</option>
                        <option>Case Study</option>
                        <option>Tips & Tricks</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <ImageIcon className="w-3.5 h-3.5 text-emerald-500" /> Ảnh bìa (URL hoặc Tên file)
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="anh-dep.jpg hoặc link Unsplash..."
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono text-sm text-white"
                        value={formData.coverImage}
                        onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        {formData.status === "Published" ? <Globe className="w-3.5 h-3.5 text-emerald-500" /> : <FileSignature className="w-3.5 h-3.5 text-yellow-500" />} 
                        Trạng thái
                      </label>
                      <select
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-white [&>option]:bg-slate-900"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      >
                        <option value="Published">Xuất bản</option>
                        <option value="Draft">Lưu nháp</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Mô tả ngắn (Excerpt)</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Tóm tắt ngắn về bài viết để hiển thị trên Card..."
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none text-white"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Nội dung (Markdown)</label>
                    <div data-color-mode="dark" className="rounded-xl overflow-hidden border border-white/10">
                      <MDEditor
                        value={formData.content}
                        onChange={(val) => setFormData({ ...formData, content: val || "" })}
                        height={600}
                        previewOptions={{
                          components: {}
                        }}
                        className="!bg-slate-900/50 !border-0"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-8 text-lg font-bold bg-emerald-500 hover:bg-emerald-600 shadow-neon transition-all duration-300 flex gap-3 rounded-2xl"
                  >
                    {loading ? (
                      "Đang xử lý..."
                    ) : (
                      <>
                        <Send className="w-5 h-5" /> {editId ? "CẬP NHẬT BÀI VIẾT" : "XUẤT BÀI MỚI"}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar: Posts List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <Card className="glass-card border-white/10 shadow-neon-sm flex-1 max-h-[1100px] flex flex-col">
              <CardHeader className="border-b border-white/5 bg-white/[0.02] p-6 shrink-0">
                <CardTitle className="text-xl font-bold font-heading flex items-center gap-2">
                  <FileText className="text-slate-400 w-5 h-5" />
                  Quản Lý Bài Viết ({posts.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-y-auto custom-scrollbar flex-1">
                {loadingPosts ? (
                  <div className="p-8 text-center text-slate-500">Đang tải...</div>
                ) : posts.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">Chưa có bài viết nào</div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {posts.map(post => (
                      <div key={post.id} className={`p-4 hover:bg-white/[0.02] transition-colors flex flex-col gap-3 ${editId === post.id ? "bg-emerald-500/10 border-l-2 border-emerald-500" : ""}`}>
                        <div>
                          <h4 className="font-bold text-sm text-slate-200 line-clamp-2 leading-tight mb-2">
                            {post.title}
                          </h4>
                          <div className="flex gap-2 text-xs">
                            <Badge variant="outline" className="border-white/10 text-slate-400 font-normal px-1.5 py-0">{post.category}</Badge>
                            {post.status === "Draft" ? (
                              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/20 font-normal px-1.5 py-0">Nháp</Badge>
                            ) : (
                              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/20 font-normal px-1.5 py-0">Publish</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                          <Button 
                            variant="ghost" 
                            size="icon-sm" 
                            className="h-8 w-8 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10"
                            onClick={() => handleEdit(post)}
                            title="Sửa bài viết"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon-sm" 
                            className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                            onClick={() => handleDelete(post.id)}
                            title="Xóa bài viết"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
