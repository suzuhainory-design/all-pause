/*
 * 数据看板页面
 * Design: Soft Industrial - 统计卡片 + 漏斗图 + 阶段分布 + 审批统计
 */
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader, StatCard, RiskBadge, StageBadge } from "@/components/shared";
import {
  mockOpportunities,
  mockApprovals,
  mockQuotations,
  stageLabel,
  stageOrder,
  type Stage,
} from "@/lib/data";
import { Link } from "wouter";
import {
  Briefcase,
  TrendingUp,
  Receipt,
  CheckSquare,
  AlertTriangle,
  Clock,
  DollarSign,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const stats = useMemo(() => {
    const opps = mockOpportunities;
    const totalOpps = opps.length;
    const activeOpps = opps.filter((o) => o.currentStage !== "lost" && o.currentStage !== "signed").length;
    const signedOpps = opps.filter((o) => o.currentStage === "signed").length;
    const lostOpps = opps.filter((o) => o.currentStage === "lost").length;
    const totalBudget = opps.reduce((sum, o) => sum + o.estimatedBudget, 0);
    const avgProbability = Math.round(
      opps.filter((o) => o.currentStage !== "lost").reduce((sum, o) => sum + o.estimatedSignProbability, 0) /
      Math.max(opps.filter((o) => o.currentStage !== "lost").length, 1)
    );
    const pendingApprovals = mockApprovals.filter((a) => a.status === "pending").length;
    const highRiskOpps = opps.filter((o) => o.riskLevel === "high").length;

    // 阶段分布
    const stageDistribution = stageOrder.map((stage) => ({
      stage,
      count: opps.filter((o) => o.currentStage === stage).length,
    }));

    // 漏斗数据
    const funnelStages: { label: string; stages: Stage[]; color: string }[] = [
      { label: "新建/尽调", stages: ["new", "dd_in_progress", "dd_done"], color: "bg-info" },
      { label: "诊断", stages: ["diag_in_progress", "diag_done"], color: "bg-teal" },
      { label: "方案", stages: ["proposal_in_progress", "proposal_done"], color: "bg-gold" },
      { label: "报价/审批", stages: ["quote_in_progress", "approval_in_progress"], color: "bg-terracotta" },
      { label: "待签约", stages: ["waiting_sign"], color: "bg-success" },
      { label: "已签约", stages: ["signed"], color: "bg-primary" },
    ];
    const funnel = funnelStages.map((f) => ({
      ...f,
      count: opps.filter((o) => f.stages.includes(o.currentStage)).length,
    }));
    const maxFunnel = Math.max(...funnel.map((f) => f.count), 1);

    // 风险分布
    const riskDistribution = {
      low: opps.filter((o) => o.riskLevel === "low").length,
      medium: opps.filter((o) => o.riskLevel === "medium").length,
      high: opps.filter((o) => o.riskLevel === "high").length,
    };

    return {
      totalOpps, activeOpps, signedOpps, lostOpps, totalBudget,
      avgProbability, pendingApprovals, highRiskOpps,
      stageDistribution, funnel, maxFunnel, riskDistribution,
    };
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="Analytics Dashboard"
        title="数据看板"
        subtitle="全案营销系统前期流程数据概览"
      />
      <div className="p-6 space-y-6">
        {/* 核心指标 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="活跃商机"
            value={stats.activeOpps}
            sub={`共 ${stats.totalOpps} 个商机`}
            icon={<Briefcase size={20} />}
          />
          <StatCard
            label="预估总预算"
            value={`¥${(stats.totalBudget / 10000).toFixed(0)}万`}
            sub="活跃商机预估"
            icon={<DollarSign size={20} />}
          />
          <StatCard
            label="平均签约概率"
            value={`${stats.avgProbability}%`}
            sub="排除已丢单"
            icon={<Target size={20} />}
          />
          <StatCard
            label="待审批"
            value={stats.pendingApprovals}
            sub={stats.pendingApprovals > 0 ? "需要及时处理" : "全部已处理"}
            icon={<CheckSquare size={20} />}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* 漏斗图 */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">商机漏斗</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.funnel.map((f, i) => (
                    <div key={f.label} className="flex items-center gap-4">
                      <span className="text-xs text-muted-foreground w-20 shrink-0 text-right">
                        {f.label}
                      </span>
                      <div className="flex-1 relative">
                        <div
                          className={cn("h-9 rounded-lg flex items-center px-3 transition-all", f.color)}
                          style={{
                            width: `${Math.max((f.count / stats.maxFunnel) * 100, 15)}%`,
                            opacity: 0.15 + (1 - i / stats.funnel.length) * 0.85,
                          }}
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold">
                          {f.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                  <span>转化率：新建→签约 {stats.totalOpps > 0 ? Math.round((stats.signedOpps / stats.totalOpps) * 100) : 0}%</span>
                  <span>丢单率：{stats.totalOpps > 0 ? Math.round((stats.lostOpps / stats.totalOpps) * 100) : 0}%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 风险分布 */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">风险分布</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(["low", "medium", "high"] as const).map((level) => {
                const count = stats.riskDistribution[level];
                const total = stats.totalOpps;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                const colors = {
                  low: "bg-success",
                  medium: "bg-warning",
                  high: "bg-danger",
                };
                return (
                  <div key={level} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <RiskBadge level={level} />
                      <span className="text-sm font-bold">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all", colors[level])}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {stats.highRiskOpps > 0 && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-danger/5 border border-danger/20 text-xs text-danger">
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                  <span>{stats.highRiskOpps} 个高风险商机需要关注</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* 阶段分布 */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">阶段分布明细</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.stageDistribution.map(({ stage, count }) => (
                  <div key={stage} className="flex items-center justify-between py-1.5">
                    <StageBadge stage={stage} />
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${stats.totalOpps > 0 ? (count / stats.totalOpps) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold w-6 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 审批统计 */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">审批概览</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-lg bg-terracotta/5 border border-terracotta/10">
                  <p className="text-2xl font-bold text-terracotta">
                    {mockApprovals.filter((a) => a.status === "pending").length}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">待审批</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-success/5 border border-success/10">
                  <p className="text-2xl font-bold text-success">
                    {mockApprovals.filter((a) => a.status === "approved").length}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">已通过</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-danger/5 border border-danger/10">
                  <p className="text-2xl font-bold text-danger">
                    {mockApprovals.filter((a) => a.status === "rejected").length}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">已驳回</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  最近审批
                </p>
                {mockApprovals.slice(0, 3).map((a) => (
                  <Link key={a.id} href="/approvals">
                    <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                        a.status === "pending" ? "bg-terracotta/10 text-terracotta" :
                        a.status === "approved" ? "bg-success/10 text-success" :
                        "bg-danger/10 text-danger"
                      )}>
                        {a.status === "pending" ? <Clock size={14} /> :
                         a.status === "approved" ? <CheckSquare size={14} /> :
                         <AlertTriangle size={14} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{a.sourceName}</p>
                        <p className="text-[10px] text-muted-foreground">{a.type} · {a.applicant}</p>
                      </div>
                      <span className={cn(
                        "px-2 py-0.5 rounded-md text-[10px] border shrink-0",
                        a.status === "pending" ? "bg-terracotta/10 text-terracotta border-terracotta/20" :
                        a.status === "approved" ? "bg-success/10 text-success border-success/20" :
                        "bg-danger/10 text-danger border-danger/20"
                      )}>
                        {a.status === "pending" ? "待审批" : a.status === "approved" ? "已通过" : "已驳回"}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 需关注的商机 */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">需关注的商机</CardTitle>
              <Link href="/opportunities">
                <span className="text-xs text-primary hover:underline cursor-pointer">查看全部</span>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60">
                    <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">商机</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">客户</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">阶段</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">风险</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">阻塞项</th>
                    <th className="text-right py-2 px-3 text-xs font-semibold text-muted-foreground">签约概率</th>
                  </tr>
                </thead>
                <tbody>
                  {mockOpportunities
                    .filter((o) => o.blockers.length > 0 || o.riskLevel === "high")
                    .slice(0, 5)
                    .map((opp) => (
                      <tr key={opp.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                        <td className="py-2.5 px-3">
                          <Link href={`/opportunities/${opp.id}`} className="text-primary hover:underline font-medium">
                            {opp.name}
                          </Link>
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground">{opp.customer.companyName}</td>
                        <td className="py-2.5 px-3"><StageBadge stage={opp.currentStage} /></td>
                        <td className="py-2.5 px-3"><RiskBadge level={opp.riskLevel} /></td>
                        <td className="py-2.5 px-3">
                          {opp.blockers.length > 0 ? (
                            <span className="text-xs text-danger">{opp.blockers[0]}</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">无</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold">
                          {opp.estimatedSignProbability}%
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
