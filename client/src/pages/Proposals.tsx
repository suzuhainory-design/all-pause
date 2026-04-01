/*
 * 全案方案编辑器
 * Design: Soft Industrial - 左侧模块目录 + 中间编辑区 + 右侧摘要
 */
import { useState, useMemo } from "react";
import { useParams, useLocation, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, StatusNote, RiskBadge } from "@/components/shared";
import {
  mockOpportunities,
  mockProposals,
  mockDiagnoses,
  proposalModuleTemplates,
  checkDiagnosisGate,
  type ProposalVersion,
  type ProposalModule,
} from "@/lib/data";
import { exportProposalPdf } from "@/lib/exportPdf";
import { toast } from "sonner";
import {
  Save,
  Send,
  Plus,
  FileText,
  GripVertical,
  Eye,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  History,
  Copy,
  ChevronRight,
  Search,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const platformOptions = [
  "抖音", "小红书", "微信视频号", "微信公众号", "微博", "B站",
  "快手", "百度", "京东", "天猫", "汽车之家", "知乎", "LinkedIn",
];

const proposalTypes = ["基础版", "增长版", "全域版", "定制版"] as const;

// ==================== 方案列表页 ====================

export function ProposalListPage() {
  const [search, setSearch] = useState("");
  const items = useMemo(() => {
    return mockOpportunities.map((opp) => {
      const proposal = mockProposals[opp.id];
      const diagGate = checkDiagnosisGate(opp.id);
      const status = proposal ? (proposal.feasibilityStatus === "pass" ? "completed" : "in_progress") : "not_started";
      return { opp, proposal, diagGate, status };
    }).filter((item) => {
      if (search) {
        const q = search.toLowerCase();
        return item.opp.customer.companyName.toLowerCase().includes(q) || item.opp.name.toLowerCase().includes(q);
      }
      return true;
    });
  }, [search]);

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <PageHeader
        title="全案方案"
        subtitle="组装、编辑和管理全案营销方案"
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        <Input placeholder="搜索客户名称、商机名称..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="space-y-3">
        {items.map(({ opp, proposal, diagGate, status }) => {
          const p = proposal;
          const feasColor = p ? ({
            pass: "bg-emerald-50 text-emerald-700",
            warning: "bg-amber-50 text-amber-700",
            fail: "bg-red-50 text-red-700",
          }[p.feasibilityStatus]) : "";
          const feasLabel = p ? ({ pass: "通过", warning: "有风险", fail: "不通过" }[p.feasibilityStatus]) : "";
          return (
            <Card key={opp.id} className="border-border/50 hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-5">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                    status === "completed" ? "bg-emerald-50" : status === "in_progress" ? "bg-amber-50" : "bg-muted"
                  )}>
                    {status === "completed" ? <CheckCircle2 size={22} className="text-emerald-600" /> :
                     status === "in_progress" ? <FileText size={22} className="text-amber-600" /> :
                     <FileText size={22} className="text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">{opp.customer.companyName}</h3>
                      {p && <span className={cn("text-[10px] px-2 py-0.5 rounded-full", feasColor)}>可行性：{feasLabel}</span>}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{opp.code} · {opp.name}</p>
                    {p ? (
                      <div className="grid grid-cols-4 gap-3">
                        <div className="text-center p-2 rounded-lg bg-muted/50">
                          <p className="text-sm font-bold">{p.proposalType}</p>
                          <p className="text-[10px] text-muted-foreground">方案类型</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-muted/50">
                          <p className="text-sm font-bold">{p.serviceCycleMonths}个月</p>
                          <p className="text-[10px] text-muted-foreground">服务周期</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-muted/50">
                          <p className="text-sm font-bold">{p.majorPlatforms.length}个</p>
                          <p className="text-[10px] text-muted-foreground">平台</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-muted/50">
                          <p className="text-sm font-bold">v{p.version}</p>
                          <p className="text-[10px] text-muted-foreground">版本</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        {!diagGate.canProceed && (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-700">
                            <AlertTriangle size={12} />
                            前置条件未满足：{diagGate.reasons[0]}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={cn(
                      "text-xs font-medium px-2.5 py-1 rounded-full",
                      status === "completed" ? "bg-emerald-50 text-emerald-700" :
                      status === "in_progress" ? "bg-amber-50 text-amber-700" :
                      "bg-muted text-muted-foreground"
                    )}>
                      {status === "completed" ? "已完成" : status === "in_progress" ? "编辑中" : "未开始"}
                    </span>
                    <Link href={`/opportunities/${opp.id}/proposal`}>
                      <Button variant="outline" size="sm" className="gap-1.5" disabled={!diagGate.canProceed && !p}>
                        {p ? "编辑方案" : "创建方案"}
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
    </div>
  );
}

// ==================== 方案编辑页 ====================

export function ProposalEditPage() {
  const params = useParams<{ id: string }>();
  const oppId = parseInt(params.id || "0");
  const opp = mockOpportunities.find((o) => o.id === oppId);
  const existing = mockProposals[oppId];
  const diagnosis = mockDiagnoses[oppId];
  const [, navigate] = useLocation();

  const [meta, setMeta] = useState({
    proposalName: existing?.proposalName || `${opp?.customer.companyName || ""} 全案营销方案`,
    proposalType: existing?.proposalType || ("增长版" as typeof proposalTypes[number]),
    serviceCycleMonths: existing?.serviceCycleMonths || 6,
    coreGoals: existing?.coreGoals || [],
    majorPlatforms: existing?.majorPlatforms || [],
    strategyPath: existing?.strategyPath || "",
    serviceBoundary: existing?.serviceBoundary || "",
    suggestedAdBudget: existing?.suggestedAdBudget || 0,
    includesAgencyOperation: existing?.includesAgencyOperation || false,
    versionNote: existing?.versionNote || "",
  });

  const [modules, setModules] = useState<ProposalModule[]>(
    existing?.modules ||
    proposalModuleTemplates.map((t, i) => ({
      id: t.id,
      title: t.title,
      content: "",
      order: i,
    }))
  );

  const [activeModuleId, setActiveModuleId] = useState(modules[0]?.id || "");
  const [newGoal, setNewGoal] = useState("");

  const activeModule = modules.find((m) => m.id === activeModuleId);

  const updateModuleContent = (id: string, content: string) => {
    setModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, content } : m))
    );
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      setMeta((p) => ({ ...p, coreGoals: [...p.coreGoals, newGoal.trim()] }));
      setNewGoal("");
    }
  };

  const removeGoal = (index: number) => {
    setMeta((p) => ({ ...p, coreGoals: p.coreGoals.filter((_, i) => i !== index) }));
  };

  const togglePlatform = (platform: string) => {
    setMeta((p) => ({
      ...p,
      majorPlatforms: p.majorPlatforms.includes(platform)
        ? p.majorPlatforms.filter((pl) => pl !== platform)
        : [...p.majorPlatforms, platform],
    }));
  };

  // 可行性校验
  const feasibility = useMemo(() => {
    const notes: string[] = [];
    let status: "pass" | "warning" | "fail" = "pass";

    if (meta.suggestedAdBudget <= 0) {
      notes.push("投放预算未设置");
      status = "fail";
    }
    if (meta.majorPlatforms.length === 0) {
      notes.push("未选择投放平台");
      status = "fail";
    }
    if (meta.coreGoals.length === 0) {
      notes.push("未设置核心目标");
      status = "fail";
    }
    if (!meta.serviceBoundary.trim()) {
      notes.push("服务边界未定义");
      if (status !== "fail") status = "warning";
    }
    const filledModules = modules.filter((m) => m.content.trim().length > 0);
    if (filledModules.length < modules.length * 0.5) {
      notes.push(`方案模块填充率不足（${filledModules.length}/${modules.length}）`);
      if (status !== "fail") status = "warning";
    }

    return { status, notes };
  }, [meta, modules]);

  if (!opp) {
    return <div><PageHeader title="商机不存在" backTo="/opportunities" /></div>;
  }

  const handleSubmit = () => {
    if (feasibility.status === "fail") {
      toast.error("可行性校验未通过", { description: feasibility.notes.join("；") });
      return;
    }
    toast.success("方案已提交", { description: "可进入报价阶段" });
    navigate(`/opportunities/${oppId}`);
  };

  return (
    <div>
      <PageHeader
        eyebrow={opp.code}
        title="全案方案编辑器"
        subtitle={`${opp.customer.companyName} · ${opp.name}`}
        backTo={`/opportunities/${oppId}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.success("草稿已保存")}>
              <Save size={14} className="mr-1.5" /> 保存
            </Button>
            <Button variant="outline" size="sm" onClick={() => {
              exportProposalPdf({
                opportunityName: opp.name,
                opportunityCode: opp.code,
                customerName: opp.customer.companyName,
                industryLevel1: opp.customer.industryLevel1,
                industryLevel2: opp.customer.industryLevel2,
                proposalName: meta.proposalName,
                proposalType: meta.proposalType,
                serviceCycleMonths: meta.serviceCycleMonths,
                coreGoals: meta.coreGoals,
                majorPlatforms: meta.majorPlatforms,
                strategyPath: meta.strategyPath,
                serviceBoundary: meta.serviceBoundary,
                suggestedAdBudget: meta.suggestedAdBudget,
                includesAgencyOperation: meta.includesAgencyOperation,
                modules,
                feasibilityStatus: feasibility.status,
                feasibilityNotes: feasibility.notes,
                versionNote: meta.versionNote,
              });
              toast.success("方案已生成，请在新窗口中保存为 PDF");
            }}>
              <Download size={14} className="mr-1.5" /> 导出方案
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast("功能开发中")}>
              <Eye size={14} className="mr-1.5" /> 预览
            </Button>
            <Button size="sm" onClick={handleSubmit}>
              <Send size={14} className="mr-1.5" /> 提交方案
            </Button>
          </div>
        }
      />

      <div className="p-6">
        <Tabs defaultValue="meta" className="space-y-4">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="meta" className="text-xs">方案信息</TabsTrigger>
            <TabsTrigger value="modules" className="text-xs">方案模块</TabsTrigger>
            <TabsTrigger value="feasibility" className="text-xs">可行性校验</TabsTrigger>
          </TabsList>

          {/* 方案基本信息 */}
          <TabsContent value="meta">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">基本信息</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">方案名称</Label>
                        <Input value={meta.proposalName} onChange={(e) => setMeta((p) => ({ ...p, proposalName: e.target.value }))} />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">方案类型</Label>
                        <Select value={meta.proposalType} onValueChange={(v: any) => setMeta((p) => ({ ...p, proposalType: v }))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {proposalTypes.map((t) => (
                              <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">服务周期（月）</Label>
                        <Input type="number" value={meta.serviceCycleMonths} onChange={(e) => setMeta((p) => ({ ...p, serviceCycleMonths: parseInt(e.target.value) || 0 }))} />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">建议投放预算（元/月）</Label>
                        <Input type="number" value={meta.suggestedAdBudget || ""} onChange={(e) => setMeta((p) => ({ ...p, suggestedAdBudget: parseInt(e.target.value) || 0 }))} placeholder="如：500000" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="agency"
                        checked={meta.includesAgencyOperation}
                        onCheckedChange={(v) => setMeta((p) => ({ ...p, includesAgencyOperation: !!v }))}
                      />
                      <Label htmlFor="agency" className="text-sm">包含代运营服务</Label>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">核心目标</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {meta.coreGoals.map((g, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary/5 text-primary text-xs">
                          {g}
                          <button onClick={() => removeGoal(i)} className="ml-1 hover:text-destructive">
                            <XCircle size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        placeholder="输入核心目标..."
                        className="text-sm"
                        onKeyDown={(e) => e.key === "Enter" && addGoal()}
                      />
                      <Button variant="outline" size="sm" onClick={addGoal}>
                        <Plus size={14} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">平台与策略</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">主要平台</Label>
                      <div className="flex flex-wrap gap-2">
                        {platformOptions.map((p) => (
                          <label key={p} className="flex items-center gap-1.5 cursor-pointer">
                            <Checkbox
                              checked={meta.majorPlatforms.includes(p)}
                              onCheckedChange={() => togglePlatform(p)}
                            />
                            <span className="text-sm">{p}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">策略路径</Label>
                      <Input value={meta.strategyPath} onChange={(e) => setMeta((p) => ({ ...p, strategyPath: e.target.value }))} placeholder="如：成分科技 → 达人种草 → 品牌自播 → 私域沉淀" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">服务边界</Label>
                      <Textarea value={meta.serviceBoundary} onChange={(e) => setMeta((p) => ({ ...p, serviceBoundary: e.target.value }))} placeholder="明确不包含的服务范围..." rows={3} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 诊断参考 */}
              <div className="space-y-4">
                {diagnosis && (
                  <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold">诊断参考</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">机会评分</span>
                        <span className="font-semibold text-primary">{diagnosis.opportunityScore}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">推荐模式</span>
                        <span className="font-medium text-xs">{diagnosis.recommendedModel}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">建议预算</span>
                        <span className="font-mono text-xs">
                          ¥{(diagnosis.suggestedBudgetMin / 10000).toFixed(0)}-{(diagnosis.suggestedBudgetMax / 10000).toFixed(0)}万
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">风险等级</span>
                        <RiskBadge level={diagnosis.riskLevel} />
                      </div>
                    </CardContent>
                  </Card>
                )}
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">可行性状态</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-3">
                      {feasibility.status === "pass" && <CheckCircle2 size={18} className="text-success" />}
                      {feasibility.status === "warning" && <AlertTriangle size={18} className="text-warning" />}
                      {feasibility.status === "fail" && <XCircle size={18} className="text-danger" />}
                      <span className={cn(
                        "text-sm font-semibold",
                        feasibility.status === "pass" && "text-success",
                        feasibility.status === "warning" && "text-warning",
                        feasibility.status === "fail" && "text-danger",
                      )}>
                        {feasibility.status === "pass" ? "校验通过" : feasibility.status === "warning" ? "有风险" : "未通过"}
                      </span>
                    </div>
                    {feasibility.notes.length > 0 && (
                      <ul className="space-y-1">
                        {feasibility.notes.map((n, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                            <span className="text-danger mt-0.5">·</span>
                            {n}
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* 方案模块编辑 */}
          <TabsContent value="modules">
            <div className="grid lg:grid-cols-4 gap-4">
              {/* 模块目录 */}
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">模块目录</CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="space-y-0.5">
                    {modules.map((m) => {
                      const hasCont = m.content.trim().length > 0;
                      return (
                        <button
                          key={m.id}
                          onClick={() => setActiveModuleId(m.id)}
                          className={cn(
                            "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-all",
                            activeModuleId === m.id
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-foreground hover:bg-muted/50"
                          )}
                        >
                          <span className={cn(
                            "w-1.5 h-1.5 rounded-full shrink-0",
                            hasCont ? "bg-success" : "bg-border"
                          )} />
                          <span className="truncate">{m.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* 编辑区 */}
              <div className="lg:col-span-3">
                {activeModule ? (
                  <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-semibold">
                          {activeModule.title}
                        </CardTitle>
                        <span className="text-[10px] text-muted-foreground">
                          {activeModule.content.length} 字
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={activeModule.content}
                        onChange={(e) => updateModuleContent(activeModule.id, e.target.value)}
                        placeholder={`请输入${activeModule.title}的详细内容...\n\n可以包含：\n- 现状分析\n- 策略建议\n- 执行计划\n- 预期效果`}
                        rows={18}
                        className="text-sm leading-relaxed resize-none"
                      />
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="shadow-sm">
                    <CardContent className="py-12 text-center text-muted-foreground">
                      请从左侧选择一个模块开始编辑
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* 可行性校验 */}
          <TabsContent value="feasibility">
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">交付可行性校验</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-lg border border-border/60">
                  {feasibility.status === "pass" && <CheckCircle2 size={24} className="text-success" />}
                  {feasibility.status === "warning" && <AlertTriangle size={24} className="text-warning" />}
                  {feasibility.status === "fail" && <XCircle size={24} className="text-danger" />}
                  <div>
                    <p className={cn(
                      "text-lg font-bold",
                      feasibility.status === "pass" && "text-success",
                      feasibility.status === "warning" && "text-warning",
                      feasibility.status === "fail" && "text-danger",
                    )}>
                      {feasibility.status === "pass" ? "校验通过" : feasibility.status === "warning" ? "存在风险" : "校验未通过"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {feasibility.status === "pass"
                        ? "方案满足所有交付可行性条件，可进入报价阶段"
                        : feasibility.status === "warning"
                        ? "方案存在部分风险，建议优化后再进入报价"
                        : "方案未满足交付可行性条件，不可进入报价阶段"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">校验项目</h4>
                  <div className="space-y-2">
                    {[
                      { label: "投放预算已设置", pass: meta.suggestedAdBudget > 0 },
                      { label: "已选择投放平台", pass: meta.majorPlatforms.length > 0 },
                      { label: "已设置核心目标", pass: meta.coreGoals.length > 0 },
                      { label: "服务边界已定义", pass: meta.serviceBoundary.trim().length > 0 },
                      { label: "方案模块填充率 ≥ 50%", pass: modules.filter((m) => m.content.trim()).length >= modules.length * 0.5 },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2 text-sm">
                        {item.pass ? (
                          <CheckCircle2 size={16} className="text-success shrink-0" />
                        ) : (
                          <XCircle size={16} className="text-danger shrink-0" />
                        )}
                        <span className={item.pass ? "text-foreground" : "text-danger"}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {feasibility.notes.length > 0 && (
                  <StatusNote type={feasibility.status === "fail" ? "danger" : "warning"}>
                    <strong>问题清单：</strong>
                    <ul className="mt-1 space-y-0.5">
                      {feasibility.notes.map((n, i) => (
                        <li key={i}>· {n}</li>
                      ))}
                    </ul>
                  </StatusNote>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
