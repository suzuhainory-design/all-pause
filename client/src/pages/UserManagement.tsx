/*
 * UserManagement - 用户管理页面（仅管理员可见）
 * Design: Soft Industrial
 * 功能：查看用户列表、创建员工账号、修改角色、启/禁用、删除
 */
import { useState } from "react";
import { useAuth, ROLE_META, type UserRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  UserPlus,
  Shield,
  Users,
  Search,
  MoreHorizontal,
  Ban,
  CheckCircle2,
  Trash2,
  UserCog,
  Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function RoleBadge({ role }: { role: UserRole }) {
  const meta = ROLE_META[role];
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: `${meta.color}14`, color: meta.color }}
    >
      <Shield size={11} />
      {meta.label}
    </span>
  );
}

function StatusBadge({ status }: { status: "active" | "disabled" }) {
  return status === "active" ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
      <CheckCircle2 size={11} />
      正常
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-500">
      <Ban size={11} />
      已禁用
    </span>
  );
}

export default function UserManagementPage() {
  const { user, allUsers, createEmployee, updateUserRole, toggleUserStatus, deleteUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("sales");

  // 角色修改弹窗状态
  const [roleEditOpen, setRoleEditOpen] = useState(false);
  const [roleEditUserId, setRoleEditUserId] = useState("");
  const [roleEditValue, setRoleEditValue] = useState<UserRole>("sales");

  const filteredUsers = allUsers.filter((u) => {
    const matchSearch =
      u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = filterRole === "all" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const handleCreate = () => {
    const result = createEmployee({
      username: newUsername,
      password: newPassword,
      displayName: newDisplayName,
      role: newRole,
    });
    if (result.success) {
      toast.success("员工账号创建成功", {
        description: `${newDisplayName} (${ROLE_META[newRole].label}) 已添加到系统`,
      });
      setCreateOpen(false);
      setNewUsername("");
      setNewPassword("");
      setNewDisplayName("");
      setNewRole("sales");
    } else {
      toast.error("创建失败", { description: result.error });
    }
  };

  const handleRoleUpdate = () => {
    const result = updateUserRole(roleEditUserId, roleEditValue);
    if (result.success) {
      toast.success("角色已更新");
      setRoleEditOpen(false);
    } else {
      toast.error("更新失败", { description: result.error });
    }
  };

  const handleToggleStatus = (userId: string) => {
    const result = toggleUserStatus(userId);
    if (result.success) {
      toast.success("状态已更新");
    } else {
      toast.error("操作失败", { description: result.error });
    }
  };

  const handleDelete = (userId: string) => {
    const result = deleteUser(userId);
    if (result.success) {
      toast.success("用户已删除");
    } else {
      toast.error("删除失败", { description: result.error });
    }
  };

  // 统计
  const stats = {
    total: allUsers.length,
    active: allUsers.filter((u) => u.status === "active").length,
    employees: allUsers.filter((u) => u.role !== "user").length,
    users: allUsers.filter((u) => u.role === "user").length,
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      {/* 页头 */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">
            User Management
          </p>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">用户管理</h1>
          <p className="text-sm text-muted-foreground mt-1">
            管理系统用户、创建员工账号、分配角色权限
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <UserPlus size={16} className="mr-2" />
              创建员工账号
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[440px]">
            <DialogHeader>
              <DialogTitle>创建员工账号</DialogTitle>
              <DialogDescription>
                为团队成员创建账号并分配对应的角色权限
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>显示名称</Label>
                <Input
                  placeholder="员工姓名"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>用户名</Label>
                <Input
                  placeholder="登录用户名（至少3个字符）"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>初始密码</Label>
                <Input
                  type="password"
                  placeholder="初始密码（至少4个字符）"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>角色</Label>
                <Select value={newRole} onValueChange={(v) => setNewRole(v as UserRole)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["sales", "strategy", "finance", "admin"] as UserRole[]).map((r) => (
                      <SelectItem key={r} value={r}>
                        <span className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: ROLE_META[r].color }}
                          />
                          {ROLE_META[r].label}
                          <span className="text-muted-foreground text-xs">
                            — {ROLE_META[r].description}
                          </span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>
                取消
              </Button>
              <Button onClick={handleCreate} disabled={!newUsername || !newPassword || !newDisplayName}>
                创建账号
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "总用户数", value: stats.total, icon: Users, color: "#0f766e" },
          { label: "活跃用户", value: stats.active, icon: CheckCircle2, color: "#059669" },
          { label: "员工账号", value: stats.employees, icon: UserCog, color: "#7c3aed" },
          { label: "注册用户", value: stats.users, icon: Shield, color: "#6b7280" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-card border border-border/60 rounded-xl p-4 flex items-center justify-between"
            >
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
              </div>
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${s.color}12` }}
              >
                <Icon size={20} style={{ color: s.color }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* 筛选栏 */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索用户名或姓名..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-muted/30"
          />
        </div>
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="全部角色" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部角色</SelectItem>
            {Object.entries(ROLE_META).map(([key, meta]) => (
              <SelectItem key={key} value={key}>
                {meta.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 用户列表 */}
      <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30">
              <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">
                用户
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">
                用户名
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">
                角色
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">
                状态
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">
                创建时间
              </th>
              <th className="text-right text-xs font-semibold text-muted-foreground px-5 py-3">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => {
              const isSelf = u.id === user?.id;
              return (
                <tr
                  key={u.id}
                  className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold"
                        style={{
                          backgroundColor: `${ROLE_META[u.role].color}14`,
                          color: ROLE_META[u.role].color,
                        }}
                      >
                        {u.displayName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {u.displayName}
                          {isSelf && (
                            <span className="ml-2 text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                              当前用户
                            </span>
                          )}
                        </p>
                        {u.createdBy && (
                          <p className="text-[11px] text-muted-foreground">
                            由{" "}
                            {allUsers.find((a) => a.id === u.createdBy)?.displayName || "管理员"}{" "}
                            创建
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-mono text-foreground/70">{u.username}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <RoleBadge role={u.role} />
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(u.createdAt).toLocaleDateString("zh-CN")}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {!isSelf && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setRoleEditUserId(u.id);
                              setRoleEditValue(u.role);
                              setRoleEditOpen(true);
                            }}
                          >
                            <UserCog size={14} className="mr-2" />
                            修改角色
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(u.id)}>
                            {u.status === "active" ? (
                              <>
                                <Ban size={14} className="mr-2" />
                                禁用账号
                              </>
                            ) : (
                              <>
                                <CheckCircle2 size={14} className="mr-2" />
                                启用账号
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 size={14} className="mr-2" />
                                删除用户
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>确认删除</AlertDialogTitle>
                                <AlertDialogDescription>
                                  确定要删除用户 <strong>{u.displayName}</strong> 吗？此操作不可撤销。
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>取消</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(u.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  确认删除
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </td>
                </tr>
              );
            })}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm text-muted-foreground">
                  没有找到匹配的用户
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 修改角色弹窗 */}
      <Dialog open={roleEditOpen} onOpenChange={setRoleEditOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>修改用户角色</DialogTitle>
            <DialogDescription>
              更改角色后，该用户可访问的功能模块将立即变更
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label className="mb-2 block">选择新角色</Label>
            <Select value={roleEditValue} onValueChange={(v) => setRoleEditValue(v as UserRole)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(["admin", "sales", "strategy", "finance", "user"] as UserRole[]).map((r) => (
                  <SelectItem key={r} value={r}>
                    <span className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: ROLE_META[r].color }}
                      />
                      {ROLE_META[r].label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* 权限说明 */}
            <div className="mt-4 p-3 rounded-lg bg-muted/40 border border-border/50">
              <p className="text-xs font-medium text-foreground mb-1">
                {ROLE_META[roleEditValue].label} 权限说明
              </p>
              <p className="text-xs text-muted-foreground">
                {ROLE_META[roleEditValue].description}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleEditOpen(false)}>
              取消
            </Button>
            <Button onClick={handleRoleUpdate}>确认修改</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
