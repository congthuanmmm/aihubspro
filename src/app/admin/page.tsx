"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserData } from "@/lib/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, FileText, UserPlus, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Fetch Users
  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData: UserData[] = [];
      snapshot.forEach((doc) => {
        usersData.push(doc.data() as UserData);
      });
      setUsers(usersData);
      setLoadingUsers(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch Posts total
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        if (res.ok) {
          const data = await res.json();
          setTotalPosts(data.length || 0);
        }
      } catch (e) {
        console.error("Failed to fetch posts:", e);
      }
    };
    fetchPosts();
  }, []);

  // Calculate Stats
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  
  const newUsersToday = users.filter((u) => {
    if (!u.createdAt) return false;
    const date = u.createdAt.toDate ? u.createdAt.toDate().getTime() : new Date(u.createdAt).getTime();
    return date >= todayStart;
  }).length;

  // Process Chart Data (Last 7 days)
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i)); // 6 days ago up to today
    d.setHours(0, 0, 0, 0);
    const endOfDay = d.getTime() + 86400000;
    
    const count = users.filter(u => {
      if (!u.createdAt) return false;
      const t = u.createdAt.toDate ? u.createdAt.toDate().getTime() : new Date(u.createdAt).getTime();
      return t >= d.getTime() && t < endOfDay;
    }).length;

    return {
      date: `${d.getDate()}/${d.getMonth() + 1}`,
      Users: count
    };
  });

  const stats = [
    {
      title: "Tổng Người Dùng",
      value: loadingUsers ? "..." : users.length,
      icon: Users,
      desc: "Toàn bộ thành viên",
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
    {
      title: "Bài Viết",
      value: totalPosts,
      icon: FileText,
      desc: "Blog posts đã xuất bản",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Đăng Ký Hôm Nay",
      value: loadingUsers ? "..." : `+${newUsersToday}`,
      icon: UserPlus,
      desc: "User mới trong 24h",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold font-heading text-white">
          Thống Kê Khái Quát
        </h1>
        <p className="text-slate-400 text-lg mt-2">
          Theo dõi sát sao tình hình phát triển của nền tảng 📊
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
          >
            <Card className="glass-card border-white/10 shadow-neon-sm bg-slate-900/40 relative overflow-hidden">
              {/* Highlight Blur */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} rounded-full blur-[50px] -mr-10 -mt-10 pointer-events-none`} />
              
              <CardContent className="p-6 relative z-10 flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-slate-400 font-medium text-sm uppercase tracking-wider">
                    {stat.title}
                  </p>
                  <div className="text-4xl font-bold font-heading text-white">
                    {stat.value}
                  </div>
                  <p className="text-xs text-slate-500">{stat.desc}</p>
                </div>
                <div className={`p-4 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chart Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="glass-card border-white/10 shadow-neon-sm bg-slate-900/40">
          <CardHeader className="border-b border-white/5 bg-white/[0.02] p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-cyan-500 w-6 h-6" />
              <CardTitle className="text-xl text-white font-bold">Người Dùng Mới (7 Ngày Gần Nhất)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "rgba(15, 23, 42, 0.9)", 
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "0.5rem",
                      color: "#fff"
                    }}
                    itemStyle={{ color: "#22d3ee", fontWeight: "bold" }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Users" 
                    stroke="#06b6d4" 
                    strokeWidth={4}
                    dot={{ fill: "#06b6d4", strokeWidth: 2, r: 6, stroke: "#0f172a" }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
