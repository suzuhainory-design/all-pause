/*
 * 商机管理 - 列表页 + 详情页
 * Design: Soft Industrial
 */
import { useState, useMemo } from "react";
import { Link, useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  PageHeader,
  StageBadge,
  RiskBadge,
  StagePipeline,
  StatCard,
  CompletenessIndicator,
  StatusNote,
  EmptyState,
} from "@/components/shared";
import { BusinessIntelligenceSummaryCard } from "@/components/BusinessIntelligence";
import {
  mockOpportunities,
  mockDueDiligence,
  mockDiagnoses,
  mockProposals,
  mockQuotations,
  mockFollowUps,
  mockContracts,
  contractStatusLabel,
  stageLabel,
  type Stage,
  type Risk,
  type Opportunity,
  type DueDiligenceData,
} from "@/lib/data";
import {
  Search,
  Plus,
  Filter,
  Briefcase,
  TrendingUp,
  AlertTriangle,
  Calendar,
  User,
  Building2,
  Phone,
  Mail,
  FileText,
  Clock,
  ChevronRight,
  MessageSquare,
  ArrowRight,
  FileSignature,
  DollarSign,
  Pen,
} from "lucide-react";
import { toast } from "sonner";

const EMPTY_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663030768548/caknB78rP4AmfUA5GjZSaU/empty-state-illustration-Ft6XUiG9ZzmVNDhw7zHbCw.webp";

// ==================== 商机列表页 ====================

export function OpportunityListPage() {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return mockOpportunities.filter((opp) => {
      if (search && !opp.name.includes(search) && !opp.customer.companyName.includes(search) && !opp.code.includes(search)) return false;
      if (stageFilter !== "all" && opp.currentStage !== stageFilter) return false;
      if (riskFilter !== "all" && opp.riskLevel !== riskFilter) return false;
      return true;
    });
  }, [search, stageFilter, riskFilter]);

  const activeCount = mockOpportunities.filter((o) => o.currentStage !== "signed" && o.currentStage !== "lost").length;

  return (
    <div>
      <PageHeader
        eyebrow="Opportunity Hub"
        title="商机管理"
        subtitle="管理所有商机的全生命周期，从线索到签约"
        actions={
          <Button size="sm" onClick={() => toast("功能开发中", { description: "创建商机功能即将上线" })}>
            <Plus size={14} className="mr-1.5" />
            创建商机
          </Button>
        }
      />

      <div className="p-6 space-y-5">
        {/* 漏斗摘要 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="全部商机" value={mockOpportunities.length} icon={<Briefcase size={18} />} />
          <StatCard label="活跃推进" value={activeCount} icon={<TrendingUp size={18} />} />
          <StatCard label="高风险" value={mockOpportunities.filter((o) => o.riskLevel === "high").length} icon={<AlertTriangle size={18} />} />
          <StatCard label="已签约" value={mockOpportunities.filter((o) => o.currentStage === "signed").length} sub="本期" icon={<FileText size={18} />} />
        </div>

        {/* 筛选 */}
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="搜索商机编号、客户名称..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <Select value={stageFilter} onValueChange={setStageFilter}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="阶段筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部阶段</SelectItem>
                  {Object.entries(stageLabel).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-[120px] h-9">
                  <SelectValue placeholder="风险筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部风险</SelectItem>
                  <SelectItem value="low">低风险</SelectItem>
                  <SelectItem value="medium">中风险</SelectItem>
                  <SelectItem value="high">高风险</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 列表 */}
        <Card className="shadow-sm">
          <CardContent className="p-0">
            {filtered.length === 0 ? (
              <EmptyState
                title="未找到匹配的商机"
                description="尝试调整筛选条件或创建新商机"
                imageUrl={EMPTY_IMG}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/30">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">编号</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">客户名称</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">行业</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">当前阶段</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">预算</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">签约概率</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">风险</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">负责人</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((opp) => (
                      <tr key={opp.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-4">
                          <Link href={`/opportunities/${opp.id}`} className="text-primary font-medium hover:underline">
                            {opp.code}
                          </Link>
                        </td>
                        <td className="py-3 px-4 font-medium">{opp.customer.companyName}</td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {opp.customer.industryLevel1}/{opp.customer.industryLevel2}
                        </td>
                        <td className="py-3 px-4"><StageBadge stage={opp.currentStage} /></td>
                        <td className="py-3 px-4 font-mono text-xs">
                          ¥{(opp.estimatedBudget / 10000).toFixed(0)}万
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{ width: `${opp.estimatedSignProbability}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium">{opp.estimatedSignProbability}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4"><RiskBadge level={opp.riskLevel} /></td>
                        <td className="py-3 px-4 text-muted-foreground">{opp.ownerName}</td>
                        <td className="py-3 px-4">
                          <Link href={`/opportunities/${opp.id}`}>
                            <Button variant="ghost" size="sm" className="h-7 text-xs">
                              详情 <ChevronRight size={12} className="ml-0.5" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ==================== 商机详情页 ====================

export function OpportunityDetailPage() {
  const params = useParams<{ id: string }>();
  const oppId = parseInt(params.id || "0");
  const opp = mockOpportunities.find((o) => o.id === oppId);
  const dd = mockDueDiligence[oppId];
  const diagnosis = mockDiagnoses[oppId];
  const proposal = mockProposals[oppId];
  const quotation = mockQuotations[oppId];
  const followUps = mockFollowUps[oppId] || [];
  const [, navigate] = useLocation();

  if (!opp) {
    return (
      <div>
        <PageHeader title="商机不存在" backTo="/opportunities" />
        <EmptyState title="未找到该商机" description="请检查商机编号是否正确" imageUrl={EMPTY_IMG} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow={opp.code}
        title={opp.name}
        backTo="/opportunities"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => toast("功能开发中")}>
              添加跟进
            </Button>
            <Button size="sm" onClick={() => toast("功能开发中")}>
              推进阶段
            </Button>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        {/* 顶部信息 + 进度条 */}
        <Card className="shadow-sm">
          <CardContent className="p-5">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <StageBadge stage={opp.currentStage} />
              <RiskBadge level={opp.riskLevel} />
              <span className="text-sm text-muted-foreground">
                负责人：{opp.ownerName}
              </span>
              <span className="text-sm text-muted-foreground">
                签约概率：{opp.estimatedSignProbability}%
              </span>
              <span className="text-sm text-muted-foreground">
                预算：¥{(opp.estimatedBudget / 10000).toFixed(0)}万
              </span>
            </div>
            <StagePipeline currentStage={opp.currentStage} />
            {opp.blockers.length > 0 && (
              <div className="mt-4">
                <StatusNote type="warning">
                  <strong>当前阻塞：</strong>
                  {opp.blockers.join("；")}
                </StatusNote>
              </div>
            )}
            {opp.nextActions.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {opp.nextActions.map((action, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary/5 text-primary text-xs font-medium"
                  >
                    <ArrowRight size={11} />
                    {action}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tab 内容区 */}
        <Tabs defaultValue="customer" className="space-y-4">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="customer" className="text-xs">客户档案</TabsTrigger>
            <TabsTrigger value="dd" className="text-xs">尽调</TabsTrigger>
            <TabsTrigger value="diagnosis" className="text-xs">行业诊断</TabsTrigger>
            <TabsTrigger value="proposal" className="text-xs">全案方案</TabsTrigger>
            <TabsTrigger value="quotation" className="text-xs">报价</TabsTrigger>
            <TabsTrigger value="contract" className="text-xs">合同签约</TabsTrigger>
            <TabsTrigger value="followup" className="text-xs">跟进记录</TabsTrigger>
          </TabsList>

          {/* 客户档案 Tab */}
          <TabsContent value="customer">
            <div className="grid lg:grid-cols-2 gap-4">
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Building2 size={15} /> 企业信息
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <InfoRow label="公司名称" value={opp.customer.companyName} />
                  <InfoRow label="一级行业" value={opp.customer.industryLevel1} />
                  <InfoRow label="二级行业" value={opp.customer.industryLevel2} />
                  {opp.customer.remark && <InfoRow label="备注" value={opp.customer.remark} />}
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <User size={15} /> 联系人
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <InfoRow label="联系人" value={opp.customer.contactName} />
                  <InfoRow label="电话" value={opp.customer.contactPhone} icon={<Phone size={13} />} />
                  <InfoRow label="邮箱" value={opp.customer.contactEmail} icon={<Mail size={13} />} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 尽调 Tab */}
          <TabsContent value="dd">
            {dd ? (
              <DueDiligenceTab oppId={oppId} data={dd.data} completeness={dd.completeness} riskTags={dd.riskTags} onEdit={() => navigate(`/opportunities/${oppId}/dd`)} />
            ) : (
              <Card className="shadow-sm">
                <CardContent className="py-12">
                  <EmptyState
                    title="尚未开始尽调"
                    description="点击下方按钮开始客户尽调流程"
                    action={
                      <Button size="sm" onClick={() => navigate(`/opportunities/${oppId}/dd`)}>
                        开始尽调
                      </Button>
                    }
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* 诊断 Tab */}
          <TabsContent value="diagnosis">
            {diagnosis ? (
              <DiagnosisSummaryTab diagnosis={diagnosis} oppId={oppId} />
            ) : (
              <Card className="shadow-sm">
                <CardContent className="py-12">
                  <EmptyState
                    title="尚未开始行业诊断"
                    description={dd && dd.completeness >= 80 ? "尽调已完成，可以开始行业诊断" : "需先完成尽调（完整度 ≥ 80%）"}
                    action={
                      dd && dd.completeness >= 80 ? (
                        <Button size="sm" onClick={() => navigate(`/opportunities/${oppId}/diagnosis`)}>
                          开始诊断
                        </Button>
                      ) : undefined
                    }
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* 方案 Tab */}
          <TabsContent value="proposal">
            {proposal ? (
              <ProposalSummaryTab proposal={proposal} oppId={oppId} />
            ) : (
              <Card className="shadow-sm">
                <CardContent className="py-12">
                  <EmptyState
                    title="尚未创建方案"
                    description={diagnosis ? "诊断已完成，可以开始制作方案" : "需先完成行业诊断"}
                    action={
                      diagnosis ? (
                        <Button size="sm" onClick={() => navigate(`/opportunities/${oppId}/proposal`)}>
                          创建方案
                        </Button>
                      ) : undefined
                    }
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* 报价 Tab */}
          <TabsContent value="quotation">
            {quotation ? (
              <QuotationSummaryTab quotation={quotation} oppId={oppId} />
            ) : (
              <Card className="shadow-sm">
                <CardContent className="py-12">
                  <EmptyState
                    title="尚未创建报价"
                    description={proposal ? "方案已完成，可以开始报价" : "需先完成全案方案"}
                    action={
                      proposal && proposal.feasibilityStatus !== "fail" ? (
                        <Button size="sm" onClick={() => navigate(`/opportunities/${oppId}/quotation`)}>
                          创建报价
                        </Button>
                      ) : undefined
                    }
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* 合同签约 Tab */}
          <TabsContent value="contract">
            {(() => {
              const contract = mockContracts[oppId];
              if (contract) {
                const statusColor: Record<string, string> = {
                  draft: "bg-muted text-muted-foreground",
                  reviewing: "bg-blue-50 text-blue-700",
                  pending_sign: "bg-amber-50 text-amber-700",
                  signed: "bg-emerald-50 text-emerald-700",
                  terminated: "bg-red-50 text-red-700",
                };
                return (
                  <div className="space-y-4">
                    <Card className="shadow-sm">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold">{contract.contractName}</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">{contract.contractCode}</p>
                          </div>
                          <span className={`text-xs px-2.5 py-1 rounded-full ${statusColor[contract.status] || ""}`}>
                            {contractStatusLabel[contract.status]}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="text-center p-3 rounded-lg bg-muted/50">
                            <p className="text-lg font-bold">¥{(contract.totalAmount / 10000).toFixed(1)}万</p>
                            <p className="text-[10px] text-muted-foreground">合同金额</p>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-muted/50">
                            <p className="text-lg font-bold">{contract.serviceCycleMonths}个月</p>
                            <p className="text-[10px] text-muted-foreground">服务周期</p>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-muted/50">
                            <p className="text-lg font-bold">{contract.paymentSchedule.length}期</p>
                            <p className="text-[10px] text-muted-foreground">付款节点</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => navigate(`/opportunities/${oppId}/contract`)} className="gap-1.5">
                            <FileText size={14} />
                            查看合同详情
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    {/* 付款计划摘要 */}
                    <Card className="shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                          <DollarSign size={15} /> 付款计划
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {contract.paymentSchedule.map((p, i) => (
                            <div key={i} className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/30">
                              <span className="font-medium">{p.milestone}</span>
                              <div className="flex items-center gap-3">
                                <span className="text-muted-foreground">{p.percentage}%</span>
                                <span className="font-semibold">¥{p.amount.toLocaleString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              }
              return (
                <Card className="shadow-sm">
                  <CardContent className="py-12">
                    <EmptyState
                      title="尚未创建合同"
                      description={quotation ? "报价已完成，可以创建合同" : "需先完成报价审批"}
                      action={
                        quotation ? (
                          <Button size="sm" onClick={() => navigate(`/opportunities/${oppId}/contract`)}>
                            创建合同
                          </Button>
                        ) : undefined
                      }
                    />
                  </CardContent>
                </Card>
              );
            })()}
          </TabsContent>

          {/* 跟进记录 Tab */}
          <TabsContent value="followup">
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">跟进记录</CardTitle>
                  <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => toast("功能开发中")}>
                    <Plus size={12} className="mr-1" /> 添加跟进
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {followUps.length === 0 ? (
                  <EmptyState title="暂无跟进记录" description="添加第一条跟进记录" />
                ) : (
                  <div className="space-y-4">
                    {followUps.map((fu) => (
                      <div key={fu.id} className="relative pl-6 pb-4 border-l-2 border-border/60 last:border-l-0">
                        <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-primary" />
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock size={12} />
                            <span>{fu.createdAt}</span>
                            <span>·</span>
                            <span>{fu.createdBy}</span>
                            <span className="px-1.5 py-0.5 rounded bg-muted text-[10px]">{fu.type}</span>
                          </div>
                          <p className="text-sm text-foreground">{fu.content}</p>
                          {fu.objection && (
                            <p className="text-xs text-terracotta">
                              <strong>客户异议：</strong>{fu.objection}
                            </p>
                          )}
                          {fu.nextAction && (
                            <p className="text-xs text-primary">
                              <strong>下一步：</strong>{fu.nextAction}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ==================== 子组件 ====================

function InfoRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-xs text-muted-foreground w-20 shrink-0 pt-0.5">{label}</span>
      <div className="flex items-center gap-1.5 text-sm text-foreground">
        {icon}
        <span>{value}</span>
      </div>
    </div>
  );
}

function DueDiligenceTab({
  oppId,
  data,
  completeness,
  riskTags,
  onEdit,
}: {
  oppId: number;
  data: Partial<DueDiligenceData>;
  completeness: number;
  riskTags: string[];
  onEdit: () => void;
}) {
  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">客户基础信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <InfoRow label="公司全称" value={data.companyFullName || "—"} />
            <InfoRow label="注册资本" value={data.registeredCapital || "—"} />
            <InfoRow label="成立年份" value={data.foundedYear || "—"} />
            <InfoRow label="员工规模" value={data.employeeCount || "—"} />
            <InfoRow label="年营收" value={data.annualRevenue || "—"} />
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">营销现状</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <InfoRow label="当前投放" value={data.currentAdSpend || "—"} />
            <InfoRow label="主要平台" value={data.mainAdPlatforms?.join("、") || "—"} />
            <InfoRow label="代理商" value={data.hasAgencyPartner ? data.currentAgencyName || "有" : "无"} />
            <InfoRow label="内容团队" value={data.contentTeamSize ? `${data.contentTeamSize}人` : "—"} />
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">合作诉求</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <InfoRow label="合作目标" value={data.cooperationGoal || "—"} />
            <InfoRow label="预算区间" value={data.expectedBudgetRange || "—"} />
            <InfoRow label="期望启动" value={data.expectedStartDate || "—"} />
            <InfoRow label="核心指标" value={data.keyMetrics || "—"} />
          </CardContent>
        </Card>
      </div>
      <div className="space-y-4">
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">尽调评估</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CompletenessIndicator value={completeness} />
            {riskTags.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">风险标签</p>
                <div className="flex flex-wrap gap-1.5">
                  {riskTags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-md bg-danger/10 text-danger text-xs border border-danger/20">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <Button size="sm" className="w-full" onClick={onEdit}>
              编辑尽调
            </Button>
          </CardContent>
        </Card>
        {/* 工商信息概览卡片 */}
        <BusinessIntelligenceSummaryCard opportunityId={oppId} />
      </div>
    </div>
  );
}

function DiagnosisSummaryTab({ diagnosis, oppId }: { diagnosis: any; oppId: number }) {
  const [, navigate] = useLocation();
  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">评分概览</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {diagnosis.scores.map((s: any) => (
                <div key={s.dimension} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-28 shrink-0">{s.dimension}</span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${s.score * 20}%` }} />
                  </div>
                  <span className="text-sm font-semibold w-6 text-right">{s.score}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-4">
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">诊断结论</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="机会评分" value={`${diagnosis.opportunityScore}/100`} />
            <InfoRow label="投放难度" value={`${diagnosis.difficultyScore}/100`} />
            <InfoRow label="风险等级" value={diagnosis.riskLevel} />
            <InfoRow label="推荐模式" value={diagnosis.recommendedModel} />
            <InfoRow label="建议预算" value={`¥${(diagnosis.suggestedBudgetMin / 10000).toFixed(0)}-${(diagnosis.suggestedBudgetMax / 10000).toFixed(0)}万`} />
            <Button size="sm" className="w-full" onClick={() => navigate(`/opportunities/${oppId}/diagnosis`)}>
              查看完整诊断
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ProposalSummaryTab({ proposal, oppId }: { proposal: any; oppId: number }) {
  const [, navigate] = useLocation();
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">{proposal.proposalName}</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">v{proposal.version}</span>
            {proposal.isActive && (
              <span className="px-2 py-0.5 rounded-md bg-success/10 text-success text-xs border border-success/20">
                生效版本
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoRow label="方案类型" value={proposal.proposalType} />
          <InfoRow label="服务周期" value={`${proposal.serviceCycleMonths}个月`} />
          <InfoRow label="投放预算" value={`¥${(proposal.suggestedAdBudget / 10000).toFixed(0)}万`} />
          <InfoRow label="代运营" value={proposal.includesAgencyOperation ? "包含" : "不包含"} />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1.5">核心目标</p>
          <div className="flex flex-wrap gap-1.5">
            {proposal.coreGoals.map((g: string) => (
              <span key={g} className="px-2 py-0.5 rounded-md bg-primary/5 text-primary text-xs">{g}</span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1.5">策略路径</p>
          <p className="text-sm">{proposal.strategyPath}</p>
        </div>
        {proposal.feasibilityStatus === "fail" && (
          <StatusNote type="danger">
            可行性校验未通过：{proposal.feasibilityNotes.join("；")}
          </StatusNote>
        )}
        {proposal.feasibilityStatus === "warning" && (
          <StatusNote type="warning">
            可行性校验有风险：{proposal.feasibilityNotes.join("；")}
          </StatusNote>
        )}
        <Button size="sm" onClick={() => navigate(`/opportunities/${oppId}/proposal`)}>
          编辑方案
        </Button>
      </CardContent>
    </Card>
  );
}

function QuotationSummaryTab({ quotation, oppId }: { quotation: any; oppId: number }) {
  const [, navigate] = useLocation();
  const statusMap: Record<string, { label: string; color: string }> = {
    draft: { label: "草稿", color: "bg-muted text-muted-foreground" },
    pending_approval: { label: "审批中", color: "bg-terracotta/10 text-terracotta border-terracotta/20" },
    approved: { label: "已通过", color: "bg-success/10 text-success border-success/20" },
    rejected: { label: "已驳回", color: "bg-danger/10 text-danger border-danger/20" },
    sent: { label: "已发送", color: "bg-primary/10 text-primary border-primary/20" },
    expired: { label: "已过期", color: "bg-muted text-muted-foreground" },
  };
  const st = statusMap[quotation.status] || statusMap.draft;

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">{quotation.quotationCode}</CardTitle>
          <span className={`px-2 py-0.5 rounded-md text-xs border ${st.color}`}>{st.label}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">原价</p>
            <p className="text-lg font-bold font-mono">¥{quotation.originalPrice.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">折扣</p>
            <p className="text-lg font-bold font-mono">{quotation.discountRate}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">最终报价</p>
            <p className="text-lg font-bold font-mono text-primary">¥{quotation.finalPrice.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">毛利率</p>
            <p className={`text-lg font-bold font-mono ${quotation.grossMarginRate < 30 ? "text-danger" : "text-success"}`}>
              {quotation.grossMarginRate}%
            </p>
          </div>
        </div>
        {quotation.approvalTriggers.length > 0 && (
          <StatusNote type="warning">
            <strong>已触发审批规则：</strong>
            <ul className="mt-1 space-y-0.5">
              {quotation.approvalTriggers.map((t: string, i: number) => (
                <li key={i}>· {t}</li>
              ))}
            </ul>
          </StatusNote>
        )}
        <Button size="sm" onClick={() => navigate(`/opportunities/${oppId}/quotation`)}>
          编辑报价
        </Button>
      </CardContent>
    </Card>
  );
}
