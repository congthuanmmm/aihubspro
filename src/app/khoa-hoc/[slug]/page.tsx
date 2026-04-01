"use client";

import { use, useState, useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, PlayCircle, Star, Users, ArrowLeft, Loader2, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Course } from "@/types/course";
import { useAuth } from "@/context/AuthContext";

export default function CourseSalePage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { user } = useAuth();
  const { slug } = use(params);
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const docSnap = await getDoc(doc(db, "courses", slug));
        if (docSnap.exists()) {
          setCourse(docSnap.data() as Course);
        } else {
          setCourse(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    fetchCourse();
  }, [slug]);

  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!course) {
    notFound();
  }

  const handleCheckout = async () => {
    if (!user) {
      alert("Bạn cần đăng nhập để mua khóa học!");
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/payos/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Gửi courseId lên để API biết khóa nào
        body: JSON.stringify({
          courseId: course.id,
          userId: user.uid,
          email: user.email
        }),
      });
      const data = await res.json();

      if (res.ok && data.checkoutUrl) {
        // Mở trang tạo QR của PayOS
        router.push(data.checkoutUrl);
      } else {
        alert("Lỗi tạo đơn hàng: " + (data.error || "Unknown"));
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi hệ thống, vui lòng thử lại.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Hero Section */}
      <div className="relative pt-24 pb-16 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Link href="/khoa-hoc" className="inline-flex items-center text-sm text-slate-400 hover:text-emerald-400 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Quay lại danh sách khóa học
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-none px-3 py-1">
                  {course.tag}
                </Badge>
                {course.badge && (
                  <Badge className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1">
                    🔥 {course.badge}
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                {course.title}
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed max-w-lg">
                {course.desc}
              </p>

              <div className="flex items-center gap-6 text-sm text-slate-400 pb-4">
                <div className="flex items-center gap-1.5"><Star className="w-5 h-5 text-amber-500 fill-amber-500" /> <span className="font-bold text-white text-base">{course.rating}</span>/5.0</div>
                <div className="flex items-center gap-1.5"><Users className="w-5 h-5" /> <span className="font-bold text-white text-base">{course.students}</span> học viên</div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
                <Button
                  onClick={handleCheckout}
                  disabled={loading}
                  size="lg"
                  className="w-full sm:w-auto text-lg px-8 py-6 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-bold hover:brightness-110 shadow-[0_0_30px_rgba(45,212,191,0.3)] transition-all"
                >
                  {loading ? (
                    <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Đang tạo đơn...</span>
                  ) : (
                    <span className="flex items-center gap-2">Đăng ký - {course.price}</span>
                  )}
                </Button>
                {course.oldPrice && (
                  <p className="text-slate-500 line-through text-lg">
                    {course.oldPrice}
                  </p>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 aspect-video shadow-2xl group flex items-center justify-center"
            >
              {/* Fake Video Player Thumbnail logic */}
              <div className={`absolute inset-0 bg-gradient-to-br ${course.color} opacity-40 mix-blend-overlay`} />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950 to-transparent opacity-80" />
              <div className="relative z-10 w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 transition-all cursor-pointer">
                <Play className="w-8 h-8 text-white ml-2" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Course Details */}
      <div className="container mx-auto px-4 md:px-6 py-16 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Bạn sẽ học được gì?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {course.features.map((feature, idx) => (
              <div key={idx} className="flex gap-4 items-start p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-slate-300 leading-relaxed pt-1">
                  {feature}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center p-8 md:p-12 rounded-3xl bg-gradient-to-br from-emerald-950/40 to-cyan-950/40 border border-emerald-500/20">
            <h3 className="text-2xl font-bold mb-4">Sẵn sàng bắt đầu hành trình?</h3>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              Tham gia cùng hàng ngàn học viên khác, truy cập trọn bộ tài liệu và bắt đầu thực hành ngay hôm nay.
            </p>
            <Button
              onClick={handleCheckout}
              disabled={loading}
              size="lg"
              className="px-10 py-6 rounded-2xl bg-white text-slate-950 font-bold hover:bg-slate-200 shadow-lg text-lg"
            >
              {loading ? (
                <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Đang tải...</span>
              ) : (
                "Mua ngay và Mở khóa Nội dung"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
