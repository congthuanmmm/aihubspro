"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { collection, onSnapshot, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserData } from "@/lib/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Download, 
  ChevronLeft, 
  Loader2, 
  ShieldCheck, 
  User as UserIcon 
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Lấy dữ liệu Real-time
  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData: UserData[] = [];
      snapshot.forEach((doc) => {
        usersData.push(doc.data() as UserData);
      });
      setUsers(usersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Xử lý đổi Role
  const handleRoleChange = async (userId: string, newRole: "user" | "admin") => {
    setUpdatingId(userId);
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { role: newRole });
      // Thành công: Toast or feedback (Snapshot sẽ tự động render lại UI nên không cần setState)
    } catch (error) {
      console.error("Lỗi khi cập nhật role:", error);
      alert("Cập nhật quyền thất bại!");
    } finally {
      setUpdatingId(null);
    }
  };

  // Convert Timestamp -> Date string
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  // Xuất CSV
  const handleExportCSV = () => {
    const headers = ["Email, Tên hiển thị, Quyền (Role), Ngày tạo, Đăng nhập cuối"];
    const csvContent = users.map(user => {
      const created = user.createdAt ? formatDate(user.createdAt) : "N/A";
      const lastLogin = user.lastLoginAt ? formatDate(user.lastLoginAt) : "N/A";
      // Escape phẩy trong tên
      const name = user.displayName ? `"${user.displayName.replace(/"/g, '""')}"` : "N/A";
      return `${user.email},${name},${user.role},"${created}","${lastLogin}"`;
    });

    const csvData = new Blob([[headers, ...csvContent].join("\n")], { type: "text/csv;charset=utf-8;" });
    const csvUrl = URL.createObjectURL(csvData);
    const hiddenElement = document.createElement("a");
    hiddenElement.href = csvUrl;
    hiddenElement.target = "_blank";
    hiddenElement.download = "aihubs_users_export.csv";
    hiddenElement.click();
  };

  return (
    <div className="p-4 md:p-8 w-full mx-auto relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass-card border-white/10 shadow-neon-sm overflow-hidden">
            <CardHeader className="border-b border-white/5 bg-white/[0.02] p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/20">Admin Panel</Badge>
                  <Badge variant="outline" className="border-white/10 text-slate-500">Real-time Sync</Badge>
                </div>
                <CardTitle className="text-3xl md:text-4xl font-bold font-heading flex items-center gap-3">
                  <Users className="text-cyan-500 w-8 h-8" />
                  Quản Lý Người Dùng
                </CardTitle>
                <CardDescription className="text-slate-400 text-lg mt-2">
                  Toàn bộ danh sách Users được tự động lưu trữ và đồng bộ với Firestore.
                </CardDescription>
              </div>
              <Button 
                onClick={handleExportCSV}
                className="bg-white/10 text-white hover:bg-white/20 border border-white/10 rounded-xl flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Xuất CSV
              </Button>
            </CardHeader>

            <CardContent className="p-0 overflow-x-auto">
              {loading ? (
                <div className="p-16 flex flex-col items-center justify-center text-slate-500 gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
                  <span>Đang tải danh sách người dùng...</span>
                </div>
              ) : users.length === 0 ? (
                <div className="p-16 text-center text-slate-500">Chưa có người dùng nào.</div>
              ) : (
                <table className="w-full text-left text-sm whitespace-nowrap border-collapse">
                  <thead className="bg-white/[0.04] text-slate-400 uppercase font-medium text-xs border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4">Người dùng</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4 w-40">Vai trò (Role)</th>
                      <th className="px-6 py-4">Tham gia ngày</th>
                      <th className="px-6 py-4">Đăng nhập cuối</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map((user) => (
                      <tr key={user.uid} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {user.photoURL ? (
                              <img src={user.photoURL} alt="Avatar" className="w-9 h-9 rounded-full border border-white/10" />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center">
                                {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                              </div>
                            )}
                            <span className="font-semibold text-white">
                              {user.displayName || "Chưa cập nhật"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-300">
                          {user.email}
                        </td>
                        <td className="px-6 py-4">
                          <div className="relative inline-block w-full max-w-[130px]">
                            {updatingId === user.uid ? (
                              <div className="flex items-center gap-2 text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/20">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-xs font-semibold">Đang lưu...</span>
                              </div>
                            ) : (
                              <select
                                value={user.role}
                                onChange={(e) => handleRoleChange(user.uid, e.target.value as "user" | "admin")}
                                className={`appearance-none w-full px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider outline-none cursor-pointer transition-colors ${
                                  user.role === "admin"
                                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                                    : "bg-slate-800 text-slate-300 border-white/10 hover:bg-slate-700"
                                }`}
                              >
                                <option value="user" className="bg-slate-900 text-slate-300">User</option>
                                <option value="admin" className="bg-slate-900 text-amber-400">Admin</option>
                              </select>
                            )}
                            {/* Icon layer based on role (nếu ko loading) */}
                            {updatingId !== user.uid && (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                {user.role === "admin" ? (
                                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500/70" />
                                ) : (
                                  <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          {formatDate(user.lastLoginAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
