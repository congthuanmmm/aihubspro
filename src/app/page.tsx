"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ArrowRight, Bot, Code, Cpu, Layout, Sparkles, Star, Users, Video, Zap, Brain, MessageSquare } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Marquee from "react-fast-marquee";

export default function Home() {
  return (
    <div className="flex flex-col pb-24">
      {/* 
        A - Attention: Hero Section 
      */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-20 overflow-hidden">
        {/* Abstract Background (Wealth & Tech) */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-background to-background"></div>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-900/20 via-background to-background"></div>
        
        {/* Sci-Fi Grid Pattern & Radial Spotlight */}
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none"></div>
        
        {/* Luồng sáng cực mạnh */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-500/30 blur-[120px] rounded-full pointer-events-none -z-10 mix-blend-screen"></div>

        
        <div className="container mx-auto px-4 md:px-6 relative text-center">
          <ScrollReveal className="flex justify-center mb-6">
            <Badge variant="outline" className="px-4 py-1.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Nền tảng Premium Số 1 dành cho Creator & Marketer</span>
            </Badge>
          </ScrollReveal>

          <ScrollReveal as="div" delay={0.1} className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-5xl mx-auto mb-8 text-white">
            Trang Bị "Vũ Khí" AI & MMO Để <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Bứt Phá Thu Nhập
            </span>
          </ScrollReveal>

          <ScrollReveal delay={0.2} className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Tổng hợp các khóa học thực chiến, tài khoản AI Premium và công cụ Automation mạnh mẽ nhất giúp bạn làm việc thông minh hơn x10 lần.
          </ScrollReveal>

          <ScrollReveal delay={0.3} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto text-base h-14 px-8 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 !text-black font-bold hover:brightness-110 shadow-[0_0_15px_rgba(45,212,191,0.5)] transition-all relative group overflow-hidden">
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
              Khám phá Top AI
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-14 px-8 rounded-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50">
              Xem Khóa Học
            </Button>
          </ScrollReveal>
        </div>

        {/* Infinite Logo Marquee */}
        <ScrollReveal delay={0.5} className="mt-12 md:mt-16 w-full max-w-6xl mx-auto overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <Marquee speed={40} gradient={false} pauseOnHover={true} className="py-4">
            <div className="flex items-center gap-16 md:gap-24 pl-16 md:pl-24">
              <span className="text-xl md:text-2xl font-black tracking-widest uppercase bg-gradient-to-r from-slate-600 via-slate-400 to-slate-600 bg-clip-text text-transparent hover:from-white hover:via-cyan-100 hover:to-white transition-all duration-500 cursor-pointer select-none">CHATGPT</span>
              <span className="text-xl md:text-2xl font-black tracking-widest uppercase bg-gradient-to-r from-slate-600 via-slate-400 to-slate-600 bg-clip-text text-transparent hover:from-white hover:via-cyan-100 hover:to-white transition-all duration-500 cursor-pointer select-none">GEMINI</span>
              <span className="text-xl md:text-2xl font-black tracking-widest uppercase bg-gradient-to-r from-slate-600 via-slate-400 to-slate-600 bg-clip-text text-transparent hover:from-white hover:via-cyan-100 hover:to-white transition-all duration-500 cursor-pointer select-none">CLAUDE</span>
              <span className="text-xl md:text-2xl font-black tracking-widest uppercase bg-gradient-to-r from-slate-600 via-slate-400 to-slate-600 bg-clip-text text-transparent hover:from-white hover:via-cyan-100 hover:to-white transition-all duration-500 cursor-pointer select-none">GROK</span>
              <span className="text-xl md:text-2xl font-black tracking-widest uppercase bg-gradient-to-r from-slate-600 via-slate-400 to-slate-600 bg-clip-text text-transparent hover:from-white hover:via-cyan-100 hover:to-white transition-all duration-500 cursor-pointer select-none">DEEPSEEK</span>
              <span className="text-xl md:text-2xl font-black tracking-widest uppercase bg-gradient-to-r from-slate-600 via-slate-400 to-slate-600 bg-clip-text text-transparent hover:from-white hover:via-cyan-100 hover:to-white transition-all duration-500 cursor-pointer select-none">MIDJOURNEY</span>
              <span className="text-xl md:text-2xl font-black tracking-widest uppercase bg-gradient-to-r from-slate-600 via-slate-400 to-slate-600 bg-clip-text text-transparent hover:from-white hover:via-cyan-100 hover:to-white transition-all duration-500 cursor-pointer select-none">KLING AI</span>
            </div>
          </Marquee>
        </ScrollReveal>

        {/* Sci-Fi Neon Divider */}
        <div className="h-[1px] w-full max-w-4xl mx-auto bg-gradient-to-r from-transparent via-teal-400/50 to-transparent relative mt-12">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-16 bg-teal-400/10 blur-[30px] rounded-full pointer-events-none"></div>
        </div>
      </section>

      {/* 
        I - Interest: Key Features (4 Pillars) 
      */}
      <section className="container mx-auto px-4 md:px-6">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Hệ Sinh Thái Toàn Diện</h2>
          <p className="text-muted-foreground text-lg">Mọi thứ bạn cần để thành công trong kỷ nguyên AI.</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Layout className="w-6 h-6 text-emerald-400" />,
              title: "Khóa Học Thực Chiến",
              desc: "Học từ các chuyên gia hàng đầu. Các khóa học từ số 0 đến ra thu nhập thật trong lĩnh vực MMO.",
            },
            {
              icon: <Cpu className="w-6 h-6 text-cyan-400" />,
              title: "Top List Công Cụ AI",
              desc: "Tuyển tập và đánh giá những công cụ AI mạnh mẽ nhất giúp x10 hiệu suất công việc của bạn.",
            },
            {
              icon: <Code className="w-6 h-6 text-teal-400" />,
              title: "Blog & Case Study",
              desc: "Đọc các case study thực tế, tips & tricks độc quyền chỉ có tại cộng đồng Aihubs.",
            },
            {
              icon: <Zap className="w-6 h-6 text-emerald-500" />,
              title: "Tài Khoản Premium",
              desc: "Cung cấp tài khoản ChatGPT Plus, Midjourney, Claude... với mức giá tốt nhất thị trường.",
            },
          ].map((feature, i) => (
            <ScrollReveal key={i} delay={i * 0.1} className="glass p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
              <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 
        D - Desire: Social Proof & Trust 
      */}
      <ScrollReveal as="section" className="container mx-auto px-4 md:px-6 mt-24" y={32} duration={0.6}>
        <div className="glass-card rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden">
          {/* Decorative blur */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px]"></div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                Được tin tưởng bởi hàng ngàn Creators.
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Chúng tôi không chỉ bán khóa học hay tài khoản, chúng tôi cung cấp "vũ khí" để bạn chiến thắng trong cuộc đua Digital.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">10K+</p>
                  <p className="text-zinc-400">Học viên hoạt động</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">50+</p>
                  <p className="text-zinc-400">Tool AI được review</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">99%</p>
                  <p className="text-zinc-400">Tỷ lệ hài lòng</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">24/7</p>
                  <p className="text-zinc-400">Hỗ trợ kỹ thuật</p>
                </div>
              </div>
            </div>

            <div className="relative border border-white/10 rounded-2xl p-6 bg-background/50 backdrop-blur-sm">
              <div className="flex gap-2 text-emerald-400 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="fill-current w-5 h-5" />
                ))}
              </div>
              <p className="text-lg italic mb-6 leading-relaxed">
                "Từ khi biết đến Aihubs, mình tiết kiệm được cả chục triệu tiền mua lẻ tài khoản AI mỗi tháng. Các case study thực tế trong Blog cũng giúp mình build kênh TikTok lên 100k fl siêu nhanh!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-xl text-black">
                  T
                </div>
                <div>
                  <p className="font-bold">Tuấn Trần</p>
                  <p className="text-sm text-muted-foreground">Content Creator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 
        A - Action: Final CTA 
      */}
      <ScrollReveal as="section" className="container mx-auto px-4 md:px-6 mb-12 mt-24" y={32} duration={0.6}>
        <div className="text-center max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold">
            Sẵn sàng để thay đổi cách bạn kiếm tiền?
          </h2>
          <p className="text-xl text-muted-foreground">
            Bắt đầu với một khóa học hoặc một tài khoản Premium ngay hôm nay. Bạn sẽ không hối hận đâu.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="w-full sm:w-auto text-base h-14 px-8 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 !text-black font-bold hover:brightness-110 shadow-[0_0_15px_rgba(45,212,191,0.5)] transition-all">
              Mua Tài Khoản Ngay
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-14 px-8 rounded-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50">
              Đọc Blog Free
            </Button>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
