/*
 * AuthContext - 认证与权限管理
 * 角色体系：
 *   admin    - 超级管理员，全部权限，可创建员工账号
 *   sales    - 销售顾问，商机/尽调/诊断/方案/报价
 *   strategy - 策略经理，诊断/方案/数据看板
 *   finance  - 财务人员，报价/审批
 *   user     - 注册用户（系统使用者），仅工作台和有限查看
 */
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

// ─── 角色定义 ───
export type UserRole = "admin" | "sales" | "strategy" | "finance" | "user";

export interface User {
  id: string;
  username: string;
  displayName: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  createdBy?: string; // 由谁创建（管理员创建员工时记录）
  status: "active" | "disabled";
}

// ─── 角色元数据 ───
export const ROLE_META: Record<UserRole, { label: string; color: string; description: string }> = {
  admin: { label: "超级管理员", color: "#dc2626", description: "拥有全部权限，可管理用户和系统配置" },
  sales: { label: "销售顾问", color: "#0f766e", description: "管理商机、尽调、诊断、方案、报价" },
  strategy: { label: "策略经理", color: "#7c3aed", description: "负责行业诊断、全案方案、数据分析" },
  finance: { label: "财务人员", color: "#d97706", description: "管理报价审批和财务相关事项" },
  user: { label: "系统用户", color: "#6b7280", description: "注册用户，查看工作台和基本信息" },
};

// ─── 路由权限映射 ───
// 每个角色可访问的路由前缀
export const ROLE_ROUTES: Record<UserRole, string[]> = {
  admin: ["/", "/opportunities", "/due-diligence", "/diagnosis", "/proposals", "/quotations", "/approvals", "/contracts", "/dashboard", "/settings", "/users"],
  sales: ["/", "/opportunities", "/due-diligence", "/diagnosis", "/proposals", "/quotations", "/approvals", "/contracts"],
  strategy: ["/", "/opportunities", "/due-diligence", "/diagnosis", "/proposals", "/dashboard"],
  finance: ["/", "/quotations", "/approvals", "/contracts", "/dashboard"],
  user: ["/"],
};

// ─── 侧边栏导航权限 ───
// 每个导航项对应的最低角色要求
export const NAV_PERMISSIONS: Record<string, UserRole[]> = {
  "/": ["admin", "sales", "strategy", "finance", "user"],
  "/opportunities": ["admin", "sales", "strategy"],
  "/due-diligence": ["admin", "sales", "strategy"],
  "/diagnosis": ["admin", "sales", "strategy"],
  "/proposals": ["admin", "sales", "strategy"],
  "/quotations": ["admin", "sales", "finance"],
  "/approvals": ["admin", "sales", "finance"],
  "/contracts": ["admin", "sales", "finance"],
  "/dashboard": ["admin", "strategy", "finance"],
  "/settings": ["admin"],
  "/users": ["admin"],
};

// ─── 本地存储 Key ───
const STORAGE_KEY_USER = "allpause_current_user";
const STORAGE_KEY_USERS = "allpause_users";

// ─── 初始用户数据（含超管） ───
function getInitialUsers(): User[] {
  const stored = localStorage.getItem(STORAGE_KEY_USERS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fall through
    }
  }
  const defaults: User[] = [
    {
      id: "u-admin",
      username: "admin",
      displayName: "超级管理员",
      role: "admin",
      createdAt: "2024-01-01T00:00:00Z",
      status: "active",
    },
    {
      id: "u-sales-01",
      username: "zhangxiaoshou",
      displayName: "张销售",
      role: "sales",
      createdAt: "2024-01-15T08:00:00Z",
      createdBy: "u-admin",
      status: "active",
    },
    {
      id: "u-strategy-01",
      username: "licelue",
      displayName: "李策略",
      role: "strategy",
      createdAt: "2024-01-15T08:00:00Z",
      createdBy: "u-admin",
      status: "active",
    },
    {
      id: "u-finance-01",
      username: "wangcaiwu",
      displayName: "王财务",
      role: "finance",
      createdAt: "2024-02-01T08:00:00Z",
      createdBy: "u-admin",
      status: "active",
    },
  ];
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(defaults));
  return defaults;
}

// ─── 密码存储（简易 hash，前端演示用） ───
const STORAGE_KEY_PASSWORDS = "allpause_passwords";

function getPasswords(): Record<string, string> {
  const stored = localStorage.getItem(STORAGE_KEY_PASSWORDS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fall through
    }
  }
  const defaults: Record<string, string> = {
    admin: "admin",
    zhangxiaoshou: "123456",
    licelue: "123456",
    wangcaiwu: "123456",
  };
  localStorage.setItem(STORAGE_KEY_PASSWORDS, JSON.stringify(defaults));
  return defaults;
}

function setPassword(username: string, password: string) {
  const passwords = getPasswords();
  passwords[username] = password;
  localStorage.setItem(STORAGE_KEY_PASSWORDS, JSON.stringify(passwords));
}

// ─── Context 类型 ───
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  allUsers: User[];
  login: (username: string, password: string) => { success: boolean; error?: string };
  register: (username: string, password: string, displayName: string) => { success: boolean; error?: string };
  logout: () => void;
  hasRouteAccess: (path: string) => boolean;
  hasNavAccess: (path: string) => boolean;
  // 管理员功能
  createEmployee: (data: { username: string; password: string; displayName: string; role: UserRole }) => { success: boolean; error?: string };
  updateUserRole: (userId: string, role: UserRole) => { success: boolean; error?: string };
  toggleUserStatus: (userId: string) => { success: boolean; error?: string };
  deleteUser: (userId: string) => { success: boolean; error?: string };
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [allUsers, setAllUsers] = useState<User[]>(getInitialUsers);
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY_USER);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // 验证用户仍然存在且未被禁用
        const users = getInitialUsers();
        const found = users.find((u) => u.id === parsed.id && u.status === "active");
        return found || null;
      } catch {
        return null;
      }
    }
    return null;
  });

  // 持久化用户列表
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(allUsers));
  }, [allUsers]);

  // 持久化当前用户
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [user]);

  const login = useCallback(
    (username: string, password: string): { success: boolean; error?: string } => {
      const passwords = getPasswords();
      const foundUser = allUsers.find((u) => u.username === username);
      if (!foundUser) {
        return { success: false, error: "用户名不存在" };
      }
      if (foundUser.status === "disabled") {
        return { success: false, error: "该账号已被禁用，请联系管理员" };
      }
      if (passwords[username] !== password) {
        return { success: false, error: "密码错误" };
      }
      setUser(foundUser);
      return { success: true };
    },
    [allUsers]
  );

  const register = useCallback(
    (username: string, password: string, displayName: string): { success: boolean; error?: string } => {
      if (allUsers.some((u) => u.username === username)) {
        return { success: false, error: "用户名已存在" };
      }
      if (username.length < 3) {
        return { success: false, error: "用户名至少3个字符" };
      }
      if (password.length < 4) {
        return { success: false, error: "密码至少4个字符" };
      }
      const newUser: User = {
        id: `u-${Date.now()}`,
        username,
        displayName: displayName || username,
        role: "user",
        createdAt: new Date().toISOString(),
        status: "active",
      };
      setAllUsers((prev) => [...prev, newUser]);
      setPassword(username, password);
      setUser(newUser);
      return { success: true };
    },
    [allUsers]
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY_USER);
  }, []);

  const hasRouteAccess = useCallback(
    (path: string): boolean => {
      if (!user) return false;
      const routes = ROLE_ROUTES[user.role];
      return routes.some((r) => {
        if (r === "/") return path === "/";
        return path.startsWith(r);
      });
    },
    [user]
  );

  const hasNavAccess = useCallback(
    (path: string): boolean => {
      if (!user) return false;
      const allowedRoles = NAV_PERMISSIONS[path];
      if (!allowedRoles) return false;
      return allowedRoles.includes(user.role);
    },
    [user]
  );

  // ─── 管理员功能 ───
  const createEmployee = useCallback(
    (data: { username: string; password: string; displayName: string; role: UserRole }): { success: boolean; error?: string } => {
      if (!user || user.role !== "admin") {
        return { success: false, error: "无权限执行此操作" };
      }
      if (allUsers.some((u) => u.username === data.username)) {
        return { success: false, error: "用户名已存在" };
      }
      if (data.username.length < 3) {
        return { success: false, error: "用户名至少3个字符" };
      }
      if (data.password.length < 4) {
        return { success: false, error: "密码至少4个字符" };
      }
      const newUser: User = {
        id: `u-${Date.now()}`,
        username: data.username,
        displayName: data.displayName || data.username,
        role: data.role,
        createdAt: new Date().toISOString(),
        createdBy: user.id,
        status: "active",
      };
      setAllUsers((prev) => [...prev, newUser]);
      setPassword(data.username, data.password);
      return { success: true };
    },
    [user, allUsers]
  );

  const updateUserRole = useCallback(
    (userId: string, role: UserRole): { success: boolean; error?: string } => {
      if (!user || user.role !== "admin") {
        return { success: false, error: "无权限执行此操作" };
      }
      if (userId === user.id) {
        return { success: false, error: "不能修改自己的角色" };
      }
      setAllUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
      return { success: true };
    },
    [user]
  );

  const toggleUserStatus = useCallback(
    (userId: string): { success: boolean; error?: string } => {
      if (!user || user.role !== "admin") {
        return { success: false, error: "无权限执行此操作" };
      }
      if (userId === user.id) {
        return { success: false, error: "不能禁用自己的账号" };
      }
      setAllUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: u.status === "active" ? "disabled" : "active" } : u))
      );
      return { success: true };
    },
    [user]
  );

  const deleteUser = useCallback(
    (userId: string): { success: boolean; error?: string } => {
      if (!user || user.role !== "admin") {
        return { success: false, error: "无权限执行此操作" };
      }
      if (userId === user.id) {
        return { success: false, error: "不能删除自己的账号" };
      }
      const target = allUsers.find((u) => u.id === userId);
      if (target) {
        const passwords = getPasswords();
        delete passwords[target.username];
        localStorage.setItem(STORAGE_KEY_PASSWORDS, JSON.stringify(passwords));
      }
      setAllUsers((prev) => prev.filter((u) => u.id !== userId));
      return { success: true };
    },
    [user, allUsers]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        allUsers,
        login,
        register,
        logout,
        hasRouteAccess,
        hasNavAccess,
        createEmployee,
        updateUserRole,
        toggleUserStatus,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
