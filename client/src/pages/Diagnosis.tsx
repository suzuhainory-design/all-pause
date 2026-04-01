/*
 * 行业诊断页面
 * Design: Soft Industrial - 评分卡片 + 竞品表格 + 结论面板
 * 🔌 API 需求：
 *   - 行业数据 API（艾瑞咨询/QuestMobile 等，获取行业增长数据）
 *   - 竞品监测 API（蝉妈妈/新榜，获取竞品投放数据）
 *   - AI 辅助诊断 API（基于 LLM 生成诊断建议）
 */
import { useState, useMemo } from "react";
import { useParams, useLocation, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { PageHeader, RiskBadge, StageBadge, EmptyState } from "@/components/shared";
import {
  mockOpportunities,
  mockDiagnoses,
  mockDueDiligence,
  diagnosisDimensions,
  checkDDGate,
  type DiagnosisScore,
  type Competitor,
  type IndustryDiagnosis,
  type Opportunity,
} from "@/lib/data";
import { exportDiagnosisReportPdf } from "@/lib/exportPdf";
import { toast } from "sonner";
import {
  Save,
  Send,
  Plus,
  Trash2,
  BarChart3,
  Users,
  FileText,
  Target,
  AlertTriangle,
  CheckCircle2,
  Search,
  ArrowRight,
  Clock,
  TrendingUp,
  Radar,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

const EMPTY_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663030768548/caknB78rP4AmfUA5GjZSaU/empty-state-illustration-Ft6XUiG9ZzmVNDhw7zHbCw.webp";

type DiagStatus = "not_started" | "in_progress" | "completed" | "all";

function getDiagStatus(opp: Opportunity): "not_started" | "in_progress" | "completed" {
  const diag = mockDiagnoses[opp.id];
  if (!diag) return "not_started";
  if (diag.status === "submitted") return "completed";
  return "in_progress";
}

// ==================== 诊断列表页 ====================

export function DiagnosisListPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<DiagStatus>("all");

  const items = useMemo(() => {
    return mockOpportunities
      .map((opp) => {
        const diag = mockDiagnoses[opp.id];
        const dd = mockDueDiligence[opp.id];
        const diagStatus = getDiagStatus(opp);
        const ddGate = checkDDGate(opp.id);
        return { opp, diag, dd, diagStatus, ddGate };
      })
      .filter((item) => {
        if (search) {
          const q = search.toLowerCase();
          if (
            !item.opp.customer.companyName.toLowerCase().includes(q) &&
            !item.opp.name.toLowerCase().includes(q)
          )
            return false;
        }
        if (statusFilter !== "all" && item.diagStatus !== statusFilter) return false;
        return true;
      });
  }, [search, statusFilter]);

  const stats = useMemo(() => {
    const all = mockOpportunities.map((o) => getDiagStatus(o));
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
        title="行业诊断"
        subtitle="基于标准化评分模型输出行业诊断与合作建议"
      />

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Radar className="text-primary" size={20} />
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

      {/* 筛选 */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="搜索客户名称、商机名称..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as DiagStatus)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="诊断状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="not_started">未开始</SelectItem>
            <SelectItem value="in_progress">进行中</SelectItem>
            <SelectItem value="completed">已完成</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 列表 */}
      {items.length === 0 ? (
        <EmptyState title="暂无匹配的诊断记录" description="尝试调整筛选条件" imageUrl={EMPTY_IMG} />
      ) : (
        <div className="space-y-3">
          {items.map(({ opp, diag, dd, diagStatus, ddGate }) => {
            const canStartDiag = ddGate.canProceed;
            return (
              <Card key={opp.id} className="border-border/50 hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-5">
                    {/* 状态图标 */}
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                        diagStatus === "completed" ? "bg-emerald-50" : diagStatus === "in_progress" ? "bg-amber-50" : "bg-muted"
                      )}
                    >
                      {diagStatus === "completed" ? (
                        <CheckCircle2 size={22} className="text-emerald-600" />
                      ) : diagStatus === "in_progress" ? (
                        <TrendingUp size={22} className="text-amber-600" />
                      ) : (
                        <Clock size={22} className="text-muted-foreground" />
                      )}
                    </div>

                    {/* 信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">{opp.customer.companyName}</h3>
                        <StageBadge stage={opp.currentStage} />
                        {diag && <RiskBadge level={diag.riskLevel} />}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {opp.code} · {opp.name}
                      </p>

                      {diag ? (
                        <div className="grid grid-cols-4 gap-3">
                          <div className="text-center p-2 rounded-lg bg-muted/50">
                            <p className="text-lg font-bold text-primary">{diag.opportunityScore}</p>
                            <p className="text-[10px] text-muted-foreground">机会评分</p>
                          </div>
                          <div className="text-center p-2 rounded-lg bg-muted/50">
                            <p className="text-lg font-bold">{diag.difficultyScore}</p>
                            <p className="text-[10px] text-muted-foreground">难度评分</p>
                          </div>
                          <div className="text-center p-2 rounded-lg bg-muted/50">
                            <p className="text-lg font-bold">{diag.competitors.length}</p>
                            <p className="text-[10px] text-muted-foreground">竞品数</p>
                          </div>
                          <div className="text-center p-2 rounded-lg bg-muted/50">
                            <p className="text-lg font-bold text-emerald-600">
                              {(diag.suggestedBudgetMin / 10000).toFixed(0)}-{(diag.suggestedBudgetMax / 10000).toFixed(0)}万
                            </p>
                            <p className="text-[10px] text-muted-foreground">建议预算</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {!canStartDiag && (
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-700">
                              <AlertTriangle size={12} />
                              前置条件未满足：{ddGate.reasons[0]}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* 操作 */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span
                        className={cn(
                          "text-xs font-medium px-2.5 py-1 rounded-full",
                          diagStatus === "completed" ? "bg-emerald-50 text-emerald-700" :
                          diagStatus === "in_progress" ? "bg-amber-50 text-amber-700" :
                          "bg-muted text-muted-foreground"
                        )}
                      >
                        {diagStatus === "completed" ? "已完成" : diagStatus === "in_progress" ? "进行中" : "未开始"}
                      </span>
                      <Link href={`/opportunities/${opp.id}/diagnosis`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5"
                          disabled={!canStartDiag && diagStatus === "not_started"}
                        >
                          {diagStatus === "not_started" ? "开始诊断" : diagStatus === "in_progress" ? "继续诊断" : "查看报告"}
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

// ==================== 诊断编辑页 ====================

export function DiagnosisEditPage() {
  const params = useParams<{ id: string }>();
  const oppId = parseInt(params.id || "0");
  const opp = mockOpportunities.find((o) => o.id === oppId);
  const existing = mockDiagnoses[oppId];
  const dd = mockDueDiligence[oppId];
  const [, navigate] = useLocation();

  const [scores, setScores] = useState<DiagnosisScore[]>(
    existing?.scores ||
    diagnosisDimensions.map((dim) => ({
      dimension: dim,
      score: 3,
      basis: "",
      dataSource: "",
      note: "",
    }))
  );

  const [competitors, setCompetitors] = useState<Competitor[]>(
    existing?.competitors || []
  );

  const [conclusion, setConclusion] = useState({
    recommendedModel: existing?.recommendedModel || "",
    suggestedBudgetMin: existing?.suggestedBudgetMin || 0,
    suggestedBudgetMax: existing?.suggestedBudgetMax || 0,
    summary: existing?.summary || "",
  });

  const [activeTab, setActiveTab] = useState("scores");

  // 计算评分
  const computed = useMemo(() => {
    const positiveWeights = [0.2, 0, 0.15, 0.15, 0.1, 0.1, 0, 0.15]; // 机会维度
    const negativeWeights = [0, 0.25, 0, 0, 0, 0, 0.35, 0]; // 难度维度
    let oppScore = 0;
    let diffScore = 0;
    scores.forEach((s, i) => {
      oppScore += s.score * (positiveWeights[i] || 0);
      diffScore += s.score * (negativeWeights[i] || 0);
    });
    oppScore = Math.round(oppScore * 20);
    diffScore = Math.round(diffScore * 20);
    const risk = oppScore < 40 ? "high" : oppScore < 60 ? "medium" : "low";
    return { oppScore, diffScore, risk };
  }, [scores]);

  // 准入检查
  const ddGate = checkDDGate(oppId);

  if (!opp) {
    return (
      <div className="p-6">
        <EmptyState title="商机不存在" description="请返回诊断列表" imageUrl={EMPTY_IMG} />
      </div>
    );
  }

  if (!ddGate.canProceed && !existing) {
    return (
      <div className="p-6 max-w-[800px] mx-auto">
        <PageHeader title="行业诊断" backTo="/diagnosis" />
        <Card className="mt-6 border-orange-200 bg-orange-50/50">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="mx-auto mb-3 text-orange-500" size={40} />
            <h3 className="font-semibold text-lg mb-2">前置条件未满足</h3>
            <p className="text-sm text-muted-foreground mb-4">
              需要完成客户尽调后才能开始行业诊断
            </p>
            <ul className="text-sm text-orange-700 space-y-1 mb-4">
              {ddGate.reasons.map((r, i) => (
                <li key={i}>• {r}</li>
              ))}
            </ul>
            <Link href={`/opportunities/${oppId}/dd`}>
              <Button>前往完成尽调</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const updateScore = (index: number, field: keyof DiagnosisScore, value: string | number) => {
    setScores((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const addCompetitor = () => {
    setCompetitors((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        platform: "",
        sellingPoint: "",
        approach: "",
        priceRange: "",
        referencePoint: "",
        differentiator: "",
      },
    ]);
  };

  const removeCompetitor = (id: number) => {
    setCompetitors((prev) => prev.filter((c) => c.id !== id));
  };

  const updateCompetitor = (id: number, field: keyof Competitor, value: string) => {
    setCompetitors((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const handleSave = () => {
    toast.success("诊断报告已保存为草稿");
  };

  const handleSubmit = () => {
    // 校验
    const emptyScores = scores.filter((s) => !s.basis);
    if (emptyScores.length > 0) {
      toast.error(`还有 ${emptyScores.length} 个维度未填写评分依据`);
      return;
    }
    if (!conclusion.recommendedModel) {
      toast.error("请填写推荐合作模式");
      return;
    }
    if (!conclusion.summary) {
      toast.error("请填写诊断结论");
      return;
    }
    toast.success("诊断报告已提交，商机阶段已推进至「诊断完成」");
    setTimeout(() => navigate("/diagnosis"), 800);
  };

  const handleExportReport = () => {
    exportDiagnosisReportPdf({
      opportunityName: opp.name,
      opportunityCode: opp.code,
      customerName: opp.customer.companyName,
      industryLevel1: opp.customer.industryLevel1,
      industryLevel2: opp.customer.industryLevel2,
      scores,
      competitors,
      opportunityScore: computed.oppScore,
      difficultyScore: computed.diffScore,
      riskLevel: computed.risk as "low" | "medium" | "high",
      recommendedModel: conclusion.recommendedModel,
      suggestedBudgetMin: conclusion.suggestedBudgetMin,
      suggestedBudgetMax: conclusion.suggestedBudgetMax,
      summary: conclusion.summary,
    });
    toast.success("诊断报告已生成，请在新窗口中保存为 PDF");
  };


  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <PageHeader
        title={`${opp.name} - 行业诊断`}
        subtitle={`${opp.customer.companyName} · ${opp.customer.industryLevel1} - ${opp.customer.industryLevel2}`}
        backTo="/diagnosis"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportReport} className="gap-1.5">
              <Download size={14} />
              导出报告
            </Button>
            <Button variant="outline" size="sm" onClick={handleSave} className="gap-1.5">
              <Save size={14} />
              保存草稿
            </Button>
            <Button size="sm" onClick={handleSubmit} className="gap-1.5">
              <Send size={14} />
              提交诊断
            </Button>
          </div>
        }
      />

      {/* 评分概览 */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{computed.oppScore}</p>
            <p className="text-xs text-muted-foreground mt-1">机会评分</p>
            <Progress value={computed.oppScore} className="mt-2 h-1.5" />
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold">{computed.diffScore}</p>
            <p className="text-xs text-muted-foreground mt-1">难度评分</p>
            <Progress value={computed.diffScore} className="mt-2 h-1.5" />
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <RiskBadge level={computed.risk as any} />
            <p className="text-xs text-muted-foreground mt-2">综合风险等级</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab 内容 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scores" className="gap-1.5">
            <BarChart3 size={14} />
            八维评分
          </TabsTrigger>
          <TabsTrigger value="competitors" className="gap-1.5">
            <Users size={14} />
            竞品分析
          </TabsTrigger>
          <TabsTrigger value="conclusion" className="gap-1.5">
            <Target size={14} />
            诊断结论
          </TabsTrigger>
        </TabsList>

        {/* 八维评分 */}
        <TabsContent value="scores" className="space-y-3 mt-4">
          {scores.map((s, i) => (
            <Card key={s.dimension} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-[180px] shrink-0">
                    <p className="font-medium text-sm">{s.dimension}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Slider
                        value={[s.score]}
                        onValueChange={([v]) => updateScore(i, "score", v)}
                        min={1}
                        max={5}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-lg font-bold w-8 text-center text-primary">{s.score}</span>
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">评分依据</Label>
                      <Input
                        value={s.basis}
                        onChange={(e) => updateScore(i, "basis", e.target.value)}
                        placeholder="填写评分依据..."
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">数据来源</Label>
                      <Input
                        value={s.dataSource}
                        onChange={(e) => updateScore(i, "dataSource", e.target.value)}
                        placeholder="数据来源..."
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">备注</Label>
                      <Input
                        value={s.note}
                        onChange={(e) => updateScore(i, "note", e.target.value)}
                        placeholder="备注..."
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* 竞品分析 */}
        <TabsContent value="competitors" className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">
              已录入 {competitors.length} 个竞品
            </p>
            <Button variant="outline" size="sm" onClick={addCompetitor} className="gap-1.5">
              <Plus size={14} />
              添加竞品
            </Button>
          </div>
          {competitors.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="py-12 text-center">
                <Users className="mx-auto mb-3 text-muted-foreground" size={32} />
                <p className="text-sm text-muted-foreground mb-3">暂无竞品数据</p>
                <Button variant="outline" size="sm" onClick={addCompetitor}>添加第一个竞品</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {competitors.map((c) => (
                <Card key={c.id} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <Input
                        value={c.name}
                        onChange={(e) => updateCompetitor(c.id, "name", e.target.value)}
                        placeholder="竞品名称"
                        className="font-semibold w-[200px]"
                      />
                      <Button variant="ghost" size="sm" onClick={() => removeCompetitor(c.id)}>
                        <Trash2 size={14} className="text-destructive" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">主要平台</Label>
                        <Input value={c.platform} onChange={(e) => updateCompetitor(c.id, "platform", e.target.value)} className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">核心卖点</Label>
                        <Input value={c.sellingPoint} onChange={(e) => updateCompetitor(c.id, "sellingPoint", e.target.value)} className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">营销打法</Label>
                        <Input value={c.approach} onChange={(e) => updateCompetitor(c.id, "approach", e.target.value)} className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">价格带</Label>
                        <Input value={c.priceRange} onChange={(e) => updateCompetitor(c.id, "priceRange", e.target.value)} className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">参考点</Label>
                        <Input value={c.referencePoint} onChange={(e) => updateCompetitor(c.id, "referencePoint", e.target.value)} className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">差异化优势</Label>
                        <Input value={c.differentiator} onChange={(e) => updateCompetitor(c.id, "differentiator", e.target.value)} className="mt-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* 诊断结论 */}
        <TabsContent value="conclusion" className="mt-4 space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">合作建议</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>推荐合作模式</Label>
                <Select
                  value={conclusion.recommendedModel}
                  onValueChange={(v) => setConclusion((p) => ({ ...p, recommendedModel: v }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="选择合作模式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="全案代运营 + 内容共创">全案代运营 + 内容共创</SelectItem>
                    <SelectItem value="内容营销 + 精准投放">内容营销 + 精准投放</SelectItem>
                    <SelectItem value="品牌策略 + 媒介代理">品牌策略 + 媒介代理</SelectItem>
                    <SelectItem value="数据驱动增长">数据驱动增长</SelectItem>
                    <SelectItem value="全域整合营销">全域整合营销</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>建议预算下限（元）</Label>
                  <Input
                    type="number"
                    value={conclusion.suggestedBudgetMin}
                    onChange={(e) => setConclusion((p) => ({ ...p, suggestedBudgetMin: Number(e.target.value) }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>建议预算上限（元）</Label>
                  <Input
                    type="number"
                    value={conclusion.suggestedBudgetMax}
                    onChange={(e) => setConclusion((p) => ({ ...p, suggestedBudgetMax: Number(e.target.value) }))}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label>诊断结论</Label>
                <Textarea
                  value={conclusion.summary}
                  onChange={(e) => setConclusion((p) => ({ ...p, summary: e.target.value }))}
                  placeholder="综合分析客户所在行业的机会与挑战，给出合作建议..."
                  rows={5}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
