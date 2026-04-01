"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { Lock, PlayCircle, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import coursesData from "@/data/khoa-hoc.json";

export default function CourseLearnPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [access, setAccess] = useState<"loading" | "granted" | "denied">("loading");

  const course = coursesData.find((c) => c.id === slug);

  // Kiểm tra quyền truy cập (Access Control) trong Firestore
  useEffect(() => {
    if (authLoading) return; // Chờ Firebase Auth khởi tạo 

    if (!user) {
      setAccess("denied");
      return;
    }

    const checkAccess = async () => {
      try {
        const courseRef = doc(db, "users", user.uid, "user_courses", slug);
        const courseSnap = await getDoc(courseRef);

        if (courseSnap.exists()) {
          setAccess("granted");
        } else {
          setAccess("denied");
        }
      } catch (e) {
        console.error("Lỗi kiểm tra quyền truy cập khóa học:", e);
        setAccess("denied");
      }
    };

    checkAccess();
  }, [user, authLoading, slug]);


  if (!course) {
    return <div className="p-20 text-center text-red-500 font-bold text-2xl">404 - KHÔNG TÌM THẤY KHÓA HỌC</div>;
  }

  // UI Đang Loading / Kiểm tra Auth
  if (access === "loading" || authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Đang tải phòng học...</h2>
        <p className="text-slate-400">Vui lòng chờ giây lát để hệ thống kiểm tra quyền truy cập của bạn.</p>
      </div>
    );
  }

  // UI Bị Từ Chối (Chưa Mua)
  if (access === "denied") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full bg-red-500/10 blur-[100px] pointer-events-none" />
        
        <Lock className="w-20 h-20 text-red-500/80 mb-6 drop-shadow-md" />
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 text-center">Nội Dung Đã Bị Khóa</h1>
        <p className="text-lg text-slate-400 mb-8 max-w-lg text-center">
          Khóa học <strong className="text-white">"{course.title}"</strong> yêu cầu quyền truy cập. 
          Vui lòng đăng ký / mua khóa học để mở khóa toàn bộ bài giảng chất lượng cao!
        </p>

        <div className="flex gap-4">
          <Link href={`/khoa-hoc/${course.id}`}>
            <Button size="lg" className="bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-bold text-lg hover:brightness-110 shadow-lg px-8 py-6 rounded-full">
              Xem Chi Tiết & Mua Ngay
            </Button>
          </Link>
          <Link href="/khoa-hoc">
            <Button variant="outline" size="lg" className="text-slate-300 border-white/20 hover:text-white px-8 py-6 rounded-full">
              Khám Phá Khóa Khác
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // UI Bạn Đã Cấp Quyền => Hiển thị Video/Tài Liệu Cực Cháy
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {/* Header Room */}
      <header className="px-6 py-4 bg-slate-900 border-b border-white/10 flex items-center justify-between z-20 sticky top-0">
        <div className="flex items-center gap-4">
          <Link href="/khoa-hoc" className="p-2 rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-lg md:text-xl font-bold font-heading">{course.title}</h1>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <CheckCircle className="w-3.5 h-3.5" /> Đã Kích Hoạt Quyền Sở Hữu
            </div>
          </div>
        </div>
      </header>

      {/* Main Learning Content Viewer */}
      <div className="flex-1 flex flex-col items-center justify-start p-4 md:p-8 relative">
        <div className="absolute top-1/4 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
        
        <div className="w-full max-w-6xl space-y-8 z-10">
          
          {/* Video Player */}
          <div className="w-full aspect-video rounded-3xl overflow-hidden bg-black/50 border border-white/10 shadow-2xl relative">
            <iframe 
              src={course.videoUrl} 
              className="w-full h-full border-none pointer-events-auto"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-3xl font-bold">Tổng quan khóa học</h2>
              <p className="text-slate-300 leading-relaxed text-lg">
                Chào mừng bạn đến với chương trình đào tạo chuyên sâu. Ở bài học này, bạn sẽ làm quen với các khái niệm và công cụ cốt lõi. Ghi chú ngay vào Vscode của bạn và bắt đầu thực hành nhé.
              </p>
            </div>
            
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
              <h3 className="font-bold text-lg border-b border-white/5 pb-2">Danh sách Bài Học</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-cyan-400 p-2 rounded-lg bg-cyan-500/10 cursor-pointer">
                  <PlayCircle className="w-5 h-5" />
                  <span className="font-medium text-sm">1. Giới thiệu tổng quan hệ thống</span>
                </li>
                <li className="flex items-center gap-3 text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
                  <PlayCircle className="w-5 h-5" />
                  <span className="font-medium text-sm">2. Cài đặt môi trường Dev</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
