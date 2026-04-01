/*
 * Forbidden (403) - 无权限访问页面
 * Design: Soft Industrial
 */
import { useAuth, ROLE_META } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ShieldOff, ArrowLeft, Home } from "lucide-react";

export default function ForbiddenPage() {
  const { user } = useAuth();
  const roleMeta = user ? ROLE_META[user.role] : null;

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <ShieldOff className="text-destructive" size={28} />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">无权访问</h1>
        <p className="text-muted-foreground text-sm mb-2">
          您当前的角色
          {roleMeta && (
            <span
              className="inline-flex items-center mx-1 px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ backgroundColor: `${roleMeta.color}14`, color: roleMeta.color }}
            >
              {roleMeta.label}
            </span>
          )}
          没有权限访问此页面。
        </p>
        <p className="text-muted-foreground text-xs mb-8">
          如需更多权限，请联系系统管理员为您分配对应角色。
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft size={14} className="mr-1" />
            返回上页
          </Button>
          <Link href="/">
            <Button size="sm">
              <Home size={14} className="mr-1" />
              回到工作台
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
