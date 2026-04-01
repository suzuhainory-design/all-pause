/*
 * 工作台首页 - Workbench
 * Design: Soft Industrial - 暖灰底 + 统计卡片 + 商机速览
 */
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader, StatCard, StageBadge, RiskBadge, StatusNote } from "@/components/shared";
import {
  mockOpportunities,
  mockApprovals,
  stageLabel,
} from "@/lib/data";
import {
  Briefcase,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileText,
  Receipt,
} from "lucide-react";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663030768548/caknB78rP4AmfUA5GjZSaU/hero-dashboard-PTznywZ8SF38ApiTKmMomX.webp";

export default function Home() {
  const { user } = useAuth();

  const activeOpps = mockOpportunities.filter(
    (o) => o.currentStage !== "signed" && o.currentStage !== "lost"
  );
  const highRisk = activeOpps.filter((o) => o.riskLevel === "high");
  const pendingApprovals = mockApprovals.filter((a) => a.status === "pending");
  const recentOpps = mockOpportunities.slice(0, 5);

  // 漏斗统计
  const funnelData = [
    { label: "尽调中", count: mockOpportunities.filter((o) => o.currentStage === "dd_in_progress").length },
    { label: "诊断中", count: mockOpportunities.filter((o) => o.currentStage === "diag_in_progress").length },
    { label: "方案中", count: mockOpportunities.filter((o) => o.currentStage === "proposal_in_progress").length },
    { label: "报价中", count: mockOpportunities.filter((o) => o.currentStage === "quote_in_progress").length },
    { label: "审批中", count: mockOpportunities.filter((o) => o.currentStage === "approval_in_progress").length },
    { label: "待签约", count: mockOpportunities.filter((o) => o.currentStage === "waiting_sign").length },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Workbench"
        title="工作台"
        subtitle="聚合商机推进、风险跟踪与下一步动作"
      />

      <div className="p-6 space-y-6">
        {/* Hero banner */}
        <div className="relative rounded-xl overflow-hidden h-44">
          <img
            src={HERO_IMG}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
          <div className="relative z-10 h-full flex flex-col justify-center px-8">
            <p className="text-[11px] font-semibold text-white/70 uppercase tracking-widest">
              Allpause Marketing Platform
            </p>
            <h2 className="text-2xl font-bold text-white mt-1">
              全案营销闭环平台
            </h2>
            <p className="text-sm text-white/80 mt-1 max-w-lg">
              客户尽调 → 行业诊断 → 定制全案方案 → 签约定价，端到端流程驱动
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="活跃商机"
            value={activeOpps.length}
            sub={`共 ${mockOpportunities.length} 个商机`}
            icon={<Briefcase size={20} />}
          />
          <StatCard
            label="高风险"
            value={highRisk.length}
            sub="需优先处理"
            icon={<AlertTriangle size={20} />}
          />
          <StatCard
            label="待审批"
            value={pendingApprovals.length}
            sub="报价/法务审批"
            icon={<Clock size={20} />}
          />
          <StatCard
            label="签约率"
            value="12.5%"
            sub="本月"
            icon={<TrendingUp size={20} />}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* 漏斗 */}
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">前期漏斗</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-3 h-32">
                {funnelData.map((item, i) => {
                  const maxCount = Math.max(...funnelData.map((d) => d.count), 1);
                  const height = Math.max((item.count / maxCount) * 100, 8);
                  return (
                    <div key={item.label} className="flex-1 flex flex-col items-center gap-1.5">
                      <span className="text-sm font-bold text-foreground">
                        {item.count}
                      </span>
                      <div
                        className="w-full rounded-t-md bg-primary/15 transition-all"
                        style={{ height: `${height}%` }}
                      >
                        <div
                          className="w-full h-full rounded-t-md bg-primary/80"
                          style={{ opacity: 1 - i * 0.12 }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* 待办 */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">待处理审批</CardTitle>
                <Link href="/approvals">
                  <Button variant="ghost" size="sm" className="text-xs h-7">
                    查看全部 <ArrowRight size={12} className="ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingApprovals.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  暂无待处理审批
                </p>
              ) : (
                pendingApprovals.map((a) => (
                  <Link key={a.id} href="/approvals">
                    <div className="flex items-start gap-3 p-3 rounded-lg border border-border/60 hover:border-primary/30 hover:bg-primary/[0.02] transition-all cursor-pointer">
                      <div className="w-8 h-8 rounded-lg bg-terracotta/10 flex items-center justify-center shrink-0">
                        {a.sourceType === "quotation" ? (
                          <Receipt size={14} className="text-terracotta" />
                        ) : (
                          <FileText size={14} className="text-terracotta" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {a.type}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {a.opportunityName} · {a.applicant}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* 最近商机 */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">最近商机</CardTitle>
              <Link href="/opportunities">
                <Button variant="ghost" size="sm" className="text-xs h-7">
                  查看全部 <ArrowRight size={12} className="ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60">
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">编号</th>
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">客户</th>
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">阶段</th>
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">风险</th>
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">负责人</th>
                    <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">下一步</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOpps.map((opp) => (
                    <tr
                      key={opp.id}
                      className="border-b border-border/30 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-3 px-3">
                        <Link
                          href={`/opportunities/${opp.id}`}
                          className="text-primary font-medium hover:underline"
                        >
                          {opp.code}
                        </Link>
                      </td>
                      <td className="py-3 px-3 font-medium">{opp.customer.companyName}</td>
                      <td className="py-3 px-3">
                        <StageBadge stage={opp.currentStage} />
                      </td>
                      <td className="py-3 px-3">
                        <RiskBadge level={opp.riskLevel} />
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">{opp.ownerName}</td>
                      <td className="py-3 px-3 text-xs text-muted-foreground max-w-[200px] truncate">
                        {opp.nextActions[0] || "—"}
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
