"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PlayCircle, Star, Users } from "lucide-react";

import Link from "next/link";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Course } from "@/types/course";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function KhoaHocPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const snapshot = await getDocs(collection(db, "courses"));
        const list: Course[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as Course);
        });
        setCourses(list);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">

      {/* Header */}
      <motion.div
        className="flex flex-col items-center justify-center text-center mb-16 max-w-2xl mx-auto space-y-4"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Khóa Học Thực Chiến</h1>
        <p className="text-muted-foreground text-lg">
          Lộ trình học tập rõ ràng, cập nhật xu hướng AI và MMO mới nhất giúp bạn ra kết quả ngay.
        </p>
      </motion.div>

      {/* Filter tabs */}
      <motion.div
        className="flex gap-2 justify-center mb-10 flex-wrap"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        <Button variant="secondary" className="rounded-full">Tất cả</Button>
        <Button variant="ghost" className="rounded-full">Make Money Online</Button>
        <Button variant="ghost" className="rounded-full">AI Ứng Dụng</Button>
        <Button variant="ghost" className="rounded-full">Xây Kênh Social</Button>
      </motion.div>

      {/* Course Cards — stagger */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {courses.map((course, idx) => (
          <motion.div key={idx} variants={cardVariant}>
            <Link href={`/khoa-hoc/${course.id}`}>
              <Card className="glass-card overflow-hidden group h-full hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all cursor-pointer">
                <div className={`h-48 bg-gradient-to-br ${course.color} relative p-6 flex flex-col justify-between group-hover:scale-105 transition-transform duration-500 ease-out`}>
                  <div className="flex justify-between items-start">
                    <Badge variant="secondary" className="bg-black/20 hover:bg-black/30 text-white backdrop-blur-sm shadow-none">
                      {course.tag}
                    </Badge>
                    {course.badge && (
                      <Badge className="bg-red-500 hover:bg-red-600 text-white border-none shrink-0 shadow-lg">
                        {course.badge}
                      </Badge>
                    )}
                  </div>
                  <PlayCircle className="w-12 h-12 text-white/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-md group-hover:scale-110 transition-transform group-hover:text-white" />
                </div>

                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-500 fill-amber-500" /> {course.rating}</span>
                    <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {course.students}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 leading-tight group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed mb-4">
                    {course.desc}
                  </p>
                </CardContent>

                <CardFooter className="border-t border-white/5 pt-4 flex items-center justify-between">
                  <span className="font-bold text-xl text-emerald-400">{course.price}</span>
                  <Button size="sm" className="rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 !text-black font-bold hover:brightness-110 shadow-[0_0_15px_rgba(45,212,191,0.5)] transition-all pointer-events-none">Xem Chi Tiết</Button>
                </CardFooter>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
