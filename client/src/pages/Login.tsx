/*
 * Login / Register Page
 * Design: Soft Industrial - 左侧品牌展示 + 右侧表单
 * 暖灰底色 + 深青主色调
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  ArrowRight,
  Shield,
  BarChart3,
  Users,
  FileText,
} from "lucide-react";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (mode === "login") {
        const result = login(username, password);
        if (result.success) {
          toast.success("登录成功", { description: "欢迎回到 Allpause 全案营销系统" });
          setLocation("/");
        } else {
          toast.error("登录失败", { description: result.error });
        }
      } else {
        const result = register(username, password, displayName);
        if (result.success) {
          toast.success("注册成功", { description: "欢迎加入 Allpause，您当前为系统用户" });
          setLocation("/");
        } else {
          toast.error("注册失败", { description: result.error });
        }
      }
      setLoading(false);
    }, 400);
  };

  const features = [
    { icon: Users, title: "客户尽调", desc: "自动化工商查询与风险识别" },
    { icon: BarChart3, title: "行业诊断", desc: "8维评分模型深度分析" },
    { icon: FileText, title: "全案方案", desc: "模块化方案编辑与版本管理" },
    { icon: Shield, title: "签约定价", desc: "智能报价引擎与审批流程" },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* 左侧品牌展示区 */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-gradient-to-br from-[#0f766e] via-[#115e59] to-[#134e4a]">
        {/* 装饰纹理 */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        {/* 装饰圆形 */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white/[0.02]" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-xl tracking-tight">Allpause</h1>
              <p className="text-white/50 text-xs">全案营销系统</p>
            </div>
          </div>

          {/* 主标语 */}
          <div className="space-y-8">
            <div>
              <h2 className="text-white text-4xl font-bold leading-tight tracking-tight">
                全案营销<br />
                <span className="text-white/70">闭环平台</span>
              </h2>
              <p className="text-white/50 mt-4 text-base leading-relaxed max-w-md">
                从客户尽调到签约定价，端到端流程驱动，<br />
                让每一个营销决策都有据可依。
              </p>
            </div>

            {/* 功能卡片 */}
            <div className="grid grid-cols-2 gap-3 max-w-lg">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    className="bg-white/[0.07] backdrop-blur-sm rounded-xl p-4 border border-white/[0.08] hover:bg-white/[0.1] transition-colors duration-300"
                  >
                    <Icon className="text-white/70 mb-2" size={20} />
                    <h3 className="text-white text-sm font-semibold">{f.title}</h3>
                    <p className="text-white/40 text-xs mt-1">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 底部 */}
          <p className="text-white/30 text-xs">
            &copy; {new Date().getFullYear()} Allpause Marketing Platform. All rights reserved.
          </p>
        </div>
      </div>

      {/* 右侧登录表单区 */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[400px]">
          {/* 移动端 Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">A</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground">Allpause</h1>
              <p className="text-[10px] text-muted-foreground">全案营销系统</p>
            </div>
          </div>

          {/* 标题 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              {mode === "login" ? "欢迎回来" : "创建账号"}
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
              {mode === "login"
                ? "登录您的账号以继续使用系统"
                : "注册后默认为系统用户，如需更多权限请联系管理员"}
            </p>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-sm font-medium text-foreground">
                  显示名称
                </Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="您的姓名或昵称"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="h-11 bg-muted/30 border-border/60 focus:border-primary focus:ring-primary/20"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-foreground">
                用户名
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="请输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-11 bg-muted/30 border-border/60 focus:border-primary focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                密码
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 pr-10 bg-muted/30 border-border/60 focus:border-primary focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  {mode === "login" ? "登录中..." : "注册中..."}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {mode === "login" ? <LogIn size={16} /> : <UserPlus size={16} />}
                  {mode === "login" ? "登 录" : "注 册"}
                </span>
              )}
            </Button>
          </form>

          {/* 切换模式 */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {mode === "login" ? "还没有账号？" : "已有账号？"}
              <button
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login");
                  setUsername("");
                  setPassword("");
                  setDisplayName("");
                }}
                className="text-primary font-medium hover:underline ml-1 inline-flex items-center gap-1"
              >
                {mode === "login" ? "立即注册" : "返回登录"}
                <ArrowRight size={14} />
              </button>
            </p>
          </div>

          {/* 演示账号提示 */}
          <div className="mt-8 p-4 rounded-xl bg-muted/40 border border-border/50">
            <p className="text-xs font-medium text-foreground mb-2">演示账号</p>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>超级管理员</span>
                <span className="font-mono text-foreground/70">admin / admin</span>
              </div>
              <div className="flex justify-between">
                <span>销售顾问</span>
                <span className="font-mono text-foreground/70">zhangxiaoshou / 123456</span>
              </div>
              <div className="flex justify-between">
                <span>策略经理</span>
                <span className="font-mono text-foreground/70">licelue / 123456</span>
              </div>
              <div className="flex justify-between">
                <span>财务人员</span>
                <span className="font-mono text-foreground/70">wangcaiwu / 123456</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
