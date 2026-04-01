"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Search, CheckCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

export const dynamic = "force-dynamic";

interface OrderData {
  id: string; // Tương đương orderCode
  userId: string;
  email: string;
  courseId: string;
  amount: number;
  status: "SUCCESS" | "PENDING" | "CANCELLED";
  createdAt: any;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "SUCCESS" | "PENDING">("ALL");

  useEffect(() => {
    // Note: Do có thể chưa đánh index createdAt bên Firestore, nếu query bị lỗi hãy bỏ orderBy tạm
    const q = query(collection(db, "pending_orders"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData: OrderData[] = [];
      snapshot.forEach((doc) => {
        ordersData.push({
          id: doc.id,
          ...doc.data(),
        } as OrderData);
      });
      
      // Sort client-side tạm thời để tránh chờ Index Firestore
      ordersData.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      setOrders(ordersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchSearch = order.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        order.id.includes(searchTerm) || 
                        order.courseId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = statusFilter === "ALL" ? true : order.status === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto space-y-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold font-heading text-white flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-cyan-400" />
          Quản Lý Đơn Hàng
        </h1>
        <p className="text-slate-400 text-lg mt-2">
          Theo dõi trạng thái thanh toán và lịch sử mua khóa học của Học viên.
        </p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="glass-card border-white/10 shadow-neon-sm bg-slate-900/40">
          <CardHeader className="border-b border-white/5 bg-white/[0.02] p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="text-xl text-white font-bold">Danh sách Giao dịch</CardTitle>
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm theo Mã đơn, Email, Khoá học..." 
                    className="w-full flex h-10 rounded-md border text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-9 bg-slate-900/50 border-white/10 text-white"
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/10">
                  <button 
                    className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${statusFilter === "ALL" ? "bg-white/10 text-white font-medium" : "text-slate-400 hover:text-white"}`}
                    onClick={() => setStatusFilter("ALL")}
                  >
                    Tất cả
                  </button>
                  <button 
                    className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${statusFilter === "SUCCESS" ? "bg-emerald-500/20 text-emerald-400 font-medium" : "text-slate-400 hover:text-white"}`}
                    onClick={() => setStatusFilter("SUCCESS")}
                  >
                    Thành công
                  </button>
                  <button 
                    className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${statusFilter === "PENDING" ? "bg-amber-500/20 text-amber-400 font-medium" : "text-slate-400 hover:text-white"}`}
                    onClick={() => setStatusFilter("PENDING")}
                  >
                    Đang chờ
                  </button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                Không tìm thấy đơn hàng nào phù hợp.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5">
                    <th className="p-4 text-slate-400 font-medium text-sm whitespace-nowrap">Mã Đơn / Thời gian</th>
                    <th className="p-4 text-slate-400 font-medium text-sm whitespace-nowrap">Học viên</th>
                    <th className="p-4 text-slate-400 font-medium text-sm whitespace-nowrap">Khóa học</th>
                    <th className="p-4 text-slate-400 font-medium text-sm whitespace-nowrap">Số tiền (VNĐ)</th>
                    <th className="p-4 text-slate-400 font-medium text-sm whitespace-nowrap text-right">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredOrders.map((order) => {
                    const dateObj = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt || Date.now());
                    const formatTime = dateObj.toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });

                    return (
                      <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4">
                          <p className="font-mono text-cyan-400 text-sm font-bold">#{order.id}</p>
                          <p className="text-xs text-slate-500 mt-1">{formatTime}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-white text-sm truncate max-w-[200px]">{order.email}</p>
                          <p className="text-xs text-slate-500 mt-1 truncate max-w-[200px] font-mono">{order.userId}</p>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="border-white/10 text-slate-300 font-normal">
                            {order.courseId}
                          </Badge>
                        </td>
                        <td className="p-4 font-medium text-emerald-400">
                          {order.amount?.toLocaleString("vi-VN")} đ
                        </td>
                        <td className="p-4 text-right">
                          {order.status === "SUCCESS" ? (
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5" /> Hoàn tất
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 gap-1.5">
                              <Clock className="w-3.5 h-3.5" /> Chờ TT
                            </Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
