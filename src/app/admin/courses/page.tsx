"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Pencil, Trash2, Send, Tag, Save, Database } from "lucide-react";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { Course } from "@/types/course";
import khoaHocData from "@/data/khoa-hoc.json";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Course>>({
    id: "",
    title: "",
    desc: "",
    price: "",
    numericPrice: 0,
    oldPrice: "",
    students: "",
    rating: 5,
    badge: "",
    tag: "",
    color: "from-emerald-600 to-emerald-900",
    features: [],
    videoUrl: ""
  });

  const [featuresText, setFeaturesText] = useState("");

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "courses"));
      const list: Course[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as Course);
      });
      setCourses(list);
    } catch (error) {
      console.error("Lỗi khi tải danh sách khóa học:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEdit = (course: Course) => {
    setEditId(course.id);
    setFormData(course);
    setFeaturesText(course.features.join("\n"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bộ thực sự muốn xóa khóa học này sao? Hành động này không thể hoàn tác!")) return;
    
    try {
      await deleteDoc(doc(db, "courses", id));
      alert("Xóa thành công!");
      fetchCourses();
    } catch (e) {
      console.error(e);
      alert("Xóa thất bại!");
    }
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({
      id: "",
      title: "",
      desc: "",
      price: "",
      numericPrice: 0,
      oldPrice: "",
      students: "",
      rating: 5,
      badge: "",
      tag: "",
      color: "from-emerald-600 to-emerald-900",
      features: [],
      videoUrl: ""
    });
    setFeaturesText("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id) {
      alert("Vui lòng nhập ID cho khóa học!");
      return;
    }

    setSubmitting(true);
    try {
      const finalData: Course = {
        ...(formData as Course),
        features: featuresText.split("\n").map(f => f.trim()).filter(f => f.length > 0)
      };

      await setDoc(doc(db, "courses", finalData.id), finalData);
      alert(editId ? "Cập nhật thành công!" : "Tạo khóa học thành công!");
      resetForm();
      fetchCourses();
    } catch (error) {
      console.error("Lỗi lưu khóa học:", error);
      alert("Có lỗi khi lưu!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSyncData = async () => {
    if (!window.confirm("Thao tác này sẽ ghi đè lên Firestore bằng dữ liệu từ JSON. Có chắc không?")) return;
    setSubmitting(true);
    try {
      for (const course of khoaHocData) {
        await setDoc(doc(db, "courses", course.id), course as Course);
      }
      alert("Đồng bộ dữ liệu JSON -> Firebase thành công!");
      fetchCourses();
    } catch (e) {
      console.error(e);
      alert("Lỗi đồng bộ!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8 w-full mx-auto relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
          
          {/* Main Form Area */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="glass-card border-white/10 shadow-neon-sm overflow-hidden">
              <CardHeader className="border-b border-white/5 bg-white/[0.02] p-8">
                <div className="flex items-center gap-3 mb-2">
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/20">Quản Lý Hệ Thống</Badge>
                  <Button variant="outline" size="sm" onClick={handleSyncData} className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
                    <Database className="w-4 h-4 mr-2" /> Sync từ JSON
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-3xl md:text-4xl font-bold font-heading flex items-center gap-3">
                    <BookOpen className="text-emerald-500 w-8 h-8" />
                    {editId ? "Chỉnh sửa Khóa Học" : "Thêm Khóa Học Mới"}
                  </CardTitle>
                  {editId && (
                    <Button variant="outline" size="sm" onClick={resetForm} className="border-white/10 text-slate-400 hover:text-white">
                      Hủy & Tạo Mới
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">ID / Đường dẫn (Ví dụ: master-mmo)</label>
                      <input required disabled={!!editId} type="text" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white disabled:opacity-50" value={formData.id} onChange={(e) => setFormData({...formData, id: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Tên khóa học</label>
                      <input required type="text" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Mô tả ngắn</label>
                    <textarea required rows={2} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white resize-none" value={formData.desc} onChange={(e) => setFormData({...formData, desc: e.target.value})} />
                  </div>

                  {/* Pricing Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Giá thanh toán chuẩn (VNĐ k phẩy)</label>
                      <input required type="number" placeholder="Ví dụ: 990000" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white" value={formData.numericPrice || ""} onChange={(e) => setFormData({...formData, numericPrice: Number(e.target.value)})} />
                      <p className="text-xs text-emerald-400">Giá trị thật để thanh toán PayOS.</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Giá hiển thị (vd: 990,000 đ)</label>
                      <input required type="text" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Giá gốc (Gạch bỏ)</label>
                      <input type="text" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white" value={formData.oldPrice} onChange={(e) => setFormData({...formData, oldPrice: e.target.value})} />
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Số Học viên (Vd: 1.2k)</label>
                      <input type="text" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white" value={formData.students} onChange={(e) => setFormData({...formData, students: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Tag (Vd: MMO)</label>
                      <input type="text" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white" value={formData.tag} onChange={(e) => setFormData({...formData, tag: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Badge (Vd: Hot, New)</label>
                      <input type="text" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white" value={formData.badge} onChange={(e) => setFormData({...formData, badge: e.target.value})} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Màu nền Tailwind Gradients</label>
                      <input type="text" placeholder="from-emerald-500 to-cyan-500" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">URL Youtube Video Trailer</label>
                      <input type="url" placeholder="https://youtube.com/embed/..." className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white" value={formData.videoUrl} onChange={(e) => setFormData({...formData, videoUrl: e.target.value})} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Quyền lợi hiển thị (Mỗi quyền lợi 1 dòng)</label>
                    <textarea rows={6} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white resize-none" value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} placeholder="- Học trọn đời..." />
                  </div>

                  <Button type="submit" disabled={submitting} className="w-full py-6 text-lg font-bold bg-emerald-500 hover:bg-emerald-600 shadow-neon rounded-2xl">
                    {submitting ? "Đang lưu..." : <><Save className="w-5 h-5 mr-2" /> LƯU KHÓA HỌC</>}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar: Course List */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex flex-col gap-6">
            <Card className="glass-card border-white/10 shadow-neon-sm flex-1 max-h-[1100px] flex flex-col">
              <CardHeader className="border-b border-white/5 bg-white/[0.02] p-6 shrink-0">
                <CardTitle className="text-xl font-bold font-heading flex items-center gap-2">
                  <Tag className="text-slate-400 w-5 h-5" />
                  Danh Sách Hiện Tại ({courses.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-y-auto custom-scrollbar flex-1">
                {loading ? (
                  <div className="p-8 text-center text-slate-500">Đang tải...</div>
                ) : courses.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">Trống trơn! Bấm Sync JSON nhé.</div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {courses.map(course => (
                      <div key={course.id} className={`p-4 hover:bg-white/[0.02] transition-colors flex flex-col gap-3 ${editId === course.id ? "bg-emerald-500/10 border-l-2 border-emerald-500" : ""}`}>
                        <div>
                          <h4 className="font-bold text-sm text-slate-200 line-clamp-2 leading-tight mb-2">
                            {course.title}
                          </h4>
                          <div className="flex gap-2 text-xs">
                            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 font-normal px-1.5 py-0">
                              {course.numericPrice?.toLocaleString("vi-VN")} đ
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                          <Button variant="ghost" size="icon-sm" className="h-8 w-8 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10" onClick={() => handleEdit(course)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon-sm" className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10" onClick={() => handleDelete(course.id)}>
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
  );
}
