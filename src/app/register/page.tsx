"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, googleProvider, auth } from "@/lib/firebase";
import { syncUserToFirestore } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bot, Mail, Lock, User as UserIcon, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">Đang tải...</div>}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParams = searchParams?.get("redirect");

  const handleRedirect = () => {
    if (redirectParams) {
      router.push(redirectParams);
    } else {
      router.push("/");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải từ 6 ký tự trở lên.");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      // Update the user object with the new display name before syncing
      await userCredential.user.reload();
      await syncUserToFirestore(auth.currentUser || userCredential.user);
      
      handleRedirect();
    } catch (err: any) {
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("Email này đã được sử dụng. Vui lòng đăng nhập.");
          break;
        case "auth/invalid-email":
          setError("Email không hợp lệ.");
          break;
        case "auth/weak-password":
          setError("Mật khẩu quá yếu.");
          break;
        default:
          setError("Đã xảy ra lỗi khi tạo tài khoản.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      await syncUserToFirestore(user);
      handleRedirect();
    } catch (err) {
      setError("Không thể đăng ký bằng Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-md glass p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl z-10">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="bg-cyan-500/10 p-3 rounded-2xl mb-4">
            <Bot className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl tracking-tight text-white mb-2">
            Tạo tài khoản mới
          </h1>
          <p className="text-slate-400 text-sm md:text-base text-center">
            Mở khóa đầy đủ toàn bộ ecosystem Aihubs PRO
          </p>
        </div>

        {error && (
          <div className="p-3 mb-6 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300 ml-1">Tên hiển thị</label>
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Ví dụ: Nguyễn Văn A"
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all text-white placeholder:text-slate-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="email"
                placeholder="Nhập email của bạn..."
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all text-white placeholder:text-slate-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300 ml-1">Mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all text-white placeholder:text-slate-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="space-y-1.5 pb-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Xác nhận mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all text-white placeholder:text-slate-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full py-6 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 !text-black font-bold text-base hover:brightness-110 shadow-[0_0_15px_rgba(45,212,191,0.5)] transition-all"
          >
            {loading ? "Đang xử lý..." : "Tạo Tài Khoản"}
          </Button>
        </form>

        <div className="mt-6 mb-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-slate-500 uppercase font-medium">Hoặc</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <Button 
          type="button" 
          variant="outline" 
          onClick={handleGoogleLogin} 
          disabled={loading}
          className="w-full py-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium flex items-center justify-center gap-3 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sử dụng tài khoản Google
        </Button>

        <p className="mt-8 text-center text-sm text-slate-400">
          Đã có tài khoản?{" "}
          <Link href={`/login${redirectParams ? `?redirect=${redirectParams}` : ''}`} className="text-emerald-400 font-medium hover:text-cyan-400 transition-colors">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
