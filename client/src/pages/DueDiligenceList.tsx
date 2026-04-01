/*
 * 客户尽调 - 独立列表页
 * Design: Soft Industrial
 * 汇总所有商机的尽调进度，提供独立入口
 * 🔌 API 需求：天眼查 API（工商信息查询）
 */
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { PageHeader, RiskBadge, StageBadge, EmptyState } from "@/components/shared";
import {
  mockOpportunities,
  mockDueDiligence,
  mockBusinessIntelligence,
  calculateBusinessRiskLevel,
  type Opportunity,
} from "@/lib/data";
import {
  Search,
  ClipboardCheck,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  TrendingUp,
  FileWarning,
} from "lucide-react";

const EMPTY_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663030768548/caknB78rP4AmfUA5GjZSaU/empty-state-illustration-Ft6XUiG9ZzmVNDhw7zHbCw.webp";

type DDStatus = "not_started" | "in_progress" | "completed" | "all";

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  not_started: { label: "未开始", color: "text-muted-foreground", icon: Clock },
  in_progress: { label: "进行中", color: "text-amber-600", icon: TrendingUp },
  completed: { label: "已完成", color: "text-emerald-600", icon: CheckCircle2 },
};

function getDDStatus(opp: Opportunity): "not_started" | "in_progress" | "completed" {
  const dd = mockDueDiligence[opp.id];
  if (!dd) return "not_started";
  if (dd.completeness >= 80) return "completed";
  return "in_progress";
}

export default function DueDiligenceListPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<DDStatus>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");

  const items = useMemo(() => {
    return mockOpportunities
      .map((opp) => {
        const dd = mockDueDiligence[opp.id];
        const biz = mockBusinessIntelligence[opp.id];
        const ddStatus = getDDStatus(opp);
        const bizRisk = biz ? calculateBusinessRiskLevel(biz.risks) : null;
        return { opp, dd, biz, ddStatus, bizRisk };
      })
      .filter((item) => {
        if (search) {
          const q = search.toLowerCase();
          if (
            !item.opp.customer.companyName.toLowerCase().includes(q) &&
            !item.opp.name.toLowerCase().includes(q) &&
            !item.opp.code.toLowerCase().includes(q)
          )
            return false;
        }
        if (statusFilter !== "all" && item.ddStatus !== statusFilter) return false;
        if (riskFilter !== "all") {
          if (!item.bizRisk) return riskFilter === "unknown";
          if (item.bizRisk.level !== riskFilter) return false;
        }
        return true;
      });
  }, [search, statusFilter, riskFilter]);

  // 统计
  const stats = useMemo(() => {
    const all = mockOpportunities.map((o) => getDDStatus(o));
    return {
      total: all.length,
      notStarted: all.filter((s) => s === "not_started").length,
      inProgress: all.filter((s) => s === "in_progress").length,
      completed: all.filter((s) => s === "completed").length,
    };
  }, []);

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <PageHeader
        title="客户尽调"
        subtitle="管理所有商机的客户尽调进度，包括工商信息查询和关联风险识别"
      />

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ClipboardCheck className="text-primary" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">全部商机</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <Clock className="text-muted-foreground" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.notStarted}</p>
                <p className="text-xs text-muted-foreground">未开始</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <TrendingUp className="text-amber-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
                <p className="text-xs text-muted-foreground">进行中</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="text-emerald-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-xs text-muted-foreground">已完成</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 筛选栏 */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="搜索客户名称、商机编号..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as DDStatus)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="尽调状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="not_started">未开始</SelectItem>
            <SelectItem value="in_progress">进行中</SelectItem>
            <SelectItem value="completed">已完成</SelectItem>
          </SelectContent>
        </Select>
        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="风险等级" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部风险</SelectItem>
            <SelectItem value="low">低风险</SelectItem>
            <SelectItem value="medium">中风险</SelectItem>
            <SelectItem value="high">高风险</SelectItem>
            <SelectItem value="unknown">未查询</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 列表 */}
      {items.length === 0 ? (
        <EmptyState title="暂无匹配的尽调记录" description="尝试调整筛选条件" imageUrl={EMPTY_IMG} />
      ) : (
        <div className="space-y-3">
          {items.map(({ opp, dd, biz, ddStatus, bizRisk }) => {
            const sc = statusConfig[ddStatus];
            const StatusIcon = sc.icon;
            return (
              <Card key={opp.id} className="border-border/50 hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-5">
                    {/* 左侧：状态图标 */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        ddStatus === "completed"
                          ? "bg-emerald-50"
                          : ddStatus === "in_progress"
                          ? "bg-amber-50"
                          : "bg-muted"
                      }`}
                    >
                      <StatusIcon
                        size={22}
                        className={
                          ddStatus === "completed"
                            ? "text-emerald-600"
                            : ddStatus === "in_progress"
                            ? "text-amber-600"
                            : "text-muted-foreground"
                        }
                      />
                    </div>

                    {/* 中间：信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">
                          {opp.customer.companyName}
                        </h3>
                        <StageBadge stage={opp.currentStage} />
                        {bizRisk && <RiskBadge level={bizRisk.level} />}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {opp.code} · {opp.name} · 负责人: {opp.ownerName}
                      </p>

                      {/* 尽调进度条 */}
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs text-muted-foreground w-16">尽调进度</span>
                        <Progress
                          value={dd?.completeness ?? 0}
                          className="flex-1 h-2"
                        />
                        <span className="text-xs font-medium w-10 text-right">
                          {dd?.completeness ?? 0}%
                        </span>
                      </div>

                      {/* 关键信息标签 */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {biz && (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                            <Building2 size={12} />
                            {biz.registration.operatingStatus.split("（")[0]}
                          </span>
                        )}
                        {biz && biz.risks.length > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-700">
                            <AlertTriangle size={12} />
                            {biz.risks.filter((r) => r.status === "存续" || r.status === "进行中").length} 项活跃风险
                          </span>
                        )}
                        {!biz && (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                            <Shield size={12} />
                            工商信息未查询
                          </span>
                        )}
                        {dd?.riskTags?.map((tag, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-700"
                          >
                            <FileWarning size={12} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 右侧：操作 */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          ddStatus === "completed"
                            ? "bg-emerald-50 text-emerald-700"
                            : ddStatus === "in_progress"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {sc.label}
                      </span>
                      <Link href={`/opportunities/${opp.id}/dd`}>
                        <Button variant="outline" size="sm" className="gap-1.5">
                          {ddStatus === "not_started" ? "开始尽调" : ddStatus === "in_progress" ? "继续尽调" : "查看详情"}
                          <ArrowRight size={14} />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
