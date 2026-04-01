"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { collection, onSnapshot, doc, updateDoc, query, orderBy, getDocs } from "firebase/firestore";
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
  User as UserIcon,
  X,
  BookOpen
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Modal State
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [userCourses, setUserCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

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

  // Mở modal và fetch courses
  const handleViewDetails = async (user: UserData) => {
    setSelectedUser(user);
    setLoadingCourses(true);
    setUserCourses([]);
    try {
      const coursesRef = collection(db, "users", user.uid, "user_courses");
      const snap = await getDocs(coursesRef);
      const list: any[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() });
      });
      // Sort by purchasedAt if exists
      list.sort((a, b) => {
        const timeA = a.purchasedAt?.seconds || 0;
        const timeB = b.purchasedAt?.seconds || 0;
        return timeB - timeA;
      });
      setUserCourses(list);
    } catch (error) {
      console.error("Lỗi fetch khóa học:", error);
    } finally {
      setLoadingCourses(false);
    }
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
    <div className="p-4 md:p-8 w-full mx-auto relative overflow-hidden min-h-screen">
      {/* Background Decor */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Modal / Dialog */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedUser(null)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            className="relative w-full max-w-2xl glass-card bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-cyan-400" />
                  Hồ sơ: {selectedUser.displayName || selectedUser.email}
                </h3>
                <p className="text-sm text-slate-400 opacity-80 mt-1">{selectedUser.uid}</p>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <h4 className="font-bold text-slate-300 mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" /> Khóa học đang sở hữu
              </h4>
              
              {loadingCourses ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
                </div>
              ) : userCourses.length === 0 ? (
                <div className="text-center py-10 text-slate-500 bg-white/[0.02] rounded-xl border border-white/5">
                  Học viên này chưa sở hữu khóa học nào.
                </div>
              ) : (
                <div className="space-y-3">
                  {userCourses.map(c => (
                    <div key={c.id} className="p-4 rounded-xl border border-white/10 bg-black/20 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div>
                        <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 mb-2 font-mono">
                          {c.courseId}
                        </Badge>
                        <p className="text-sm text-slate-400 flex items-center gap-2">
                          <span className="font-semibold text-white">Nguồn:</span> {c.source === "mock" ? "Thêm thủ công" : "Mua PayOS"}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="font-bold text-cyan-400">
                          {c.amount ? `${c.amount.toLocaleString("vi-VN")} đ` : "N/A"}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {formatDate(c.purchasedAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-white/5 bg-black/20 flex justify-end">
              <Button onClick={() => setSelectedUser(null)} variant="outline" className="border-white/10 hover:bg-white/10">
                Đóng
              </Button>
            </div>
          </motion.div>
        </div>
      )}

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
                      <tr key={user.uid} className="hover:bg-white/[0.04] transition-colors cursor-pointer" onClick={() => handleViewDetails(user)}>
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
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
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
