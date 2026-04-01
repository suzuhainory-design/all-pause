/*
 * AppLayout - 全局布局组件
 * Design: Soft Industrial - 暖灰底色 + 深青侧边栏
 * 左侧 260px 固定导航 + 右侧主内容区
 * 根据用户角色动态过滤导航项
 */
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth, ROLE_META } from "@/contexts/AuthContext";
import {
  BarChart3,
  Briefcase,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  FileSignature,
  FileText,
  LayoutDashboard,
  LogOut,
  Receipt,
  Settings,
  Stethoscope,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const allNavItems = [
  { path: "/", label: "工作台", icon: LayoutDashboard },
  { path: "/opportunities", label: "商机管理", icon: Briefcase },
  { path: "/due-diligence", label: "客户尽调", icon: ClipboardCheck },
  { path: "/diagnosis", label: "行业诊断", icon: Stethoscope },
  { path: "/proposals", label: "全案方案", icon: FileText },
  { path: "/quotations", label: "签约定价", icon: Receipt },
  { path: "/approvals", label: "审批中心", icon: CheckSquare },
  { path: "/contracts", label: "合同签约", icon: FileSignature },
  { path: "/dashboard", label: "数据看板", icon: BarChart3 },
];

const allBottomNavItems = [
  { path: "/users", label: "用户管理", icon: Users },
  { path: "/settings", label: "系统配置", icon: Settings },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout, hasNavAccess } = useAuth();

  const navItems = allNavItems.filter((item) => hasNavAccess(item.path));
  const bottomNavItems = allBottomNavItems.filter((item) => hasNavAccess(item.path));

  const isActive = (path: string) => {
    if (path === "/") return location === "/";
    return location.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  const roleMeta = user ? ROLE_META[user.role] : null;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out",
          collapsed ? "w-[68px]" : "w-[260px]"
        )}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-bold text-sm">A</span>
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold text-sidebar-foreground tracking-tight truncate">
                Allpause
              </h1>
              <p className="text-[10px] text-muted-foreground truncate">
                全案营销系统
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <Icon className={cn("shrink-0", active ? "text-sidebar-primary" : "")} size={18} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom nav */}
        <div className="px-3 pb-2 space-y-0.5">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                  active
                    ? "bg-sidebar-accent text-sidebar-primary font-medium"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Collapse toggle */}
        <div className="border-t border-sidebar-border px-3 py-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all duration-200 w-full"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!collapsed && <span>收起侧栏</span>}
          </button>
        </div>

        {/* User info with logout */}
        <div className="border-t border-sidebar-border px-3 py-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 w-full px-1 py-1 rounded-lg hover:bg-sidebar-accent/50 transition-colors">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: roleMeta ? `${roleMeta.color}14` : undefined,
                    color: roleMeta?.color,
                  }}
                >
                  <span className="text-xs font-semibold">
                    {user?.displayName?.[0] || "?"}
                  </span>
                </div>
                {!collapsed && (
                  <div className="overflow-hidden text-left">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">
                      {user?.displayName || "未登录"}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {roleMeta?.label || ""}
                    </p>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top" className="w-56">
              <div className="px-3 py-2">
                <p className="text-sm font-medium">{user?.displayName}</p>
                <p className="text-xs text-muted-foreground">@{user?.username}</p>
                {roleMeta && (
                  <span
                    className="inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium"
                    style={{ backgroundColor: `${roleMeta.color}14`, color: roleMeta.color }}
                  >
                    {roleMeta.label}
                  </span>
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut size={14} className="mr-2" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
