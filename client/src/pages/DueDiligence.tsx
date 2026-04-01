/*
 * 客户尽调表单页面
 * Design: Soft Industrial - 分组表单 + 实时完整度 + 风险标记 + 工商信息自动查询
 */
import { useState, useMemo } from "react";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { PageHeader, CompletenessIndicator, StatusNote } from "@/components/shared";
import { BusinessIntelligencePanel } from "@/components/BusinessIntelligence";
import {
  mockOpportunities,
  mockDueDiligence,
  mockBusinessIntelligence,
  calculateBusinessRiskLevel,
  type DueDiligenceData,
} from "@/lib/data";
import { toast } from "sonner";
import {
  Building2,
  Users,
  TrendingUp,
  Handshake,
  AlertTriangle,
  Save,
  Send,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import { cn } from "@/lib/utils";

const adPlatformOptions = [
  "抖音", "小红书", "微信", "微博", "B站", "快手",
  "百度", "京东", "天猫", "美团", "汽车之家", "知乎",
];

export default function DueDiligencePage() {
  const params = useParams<{ id: string }>();
  const oppId = parseInt(params.id || "0");
  const opp = mockOpportunities.find((o) => o.id === oppId);
  const existingDD = mockDueDiligence[oppId];
  const [, navigate] = useLocation();

  const [form, setForm] = useState<Partial<DueDiligenceData>>(
    existingDD?.data || {
      companyFullName: opp?.customer.companyName || "",
      mainAdPlatforms: [],
      hasAgencyPartner: false,
      complianceRisk: "low",
      budgetClarity: "unknown",
    }
  );

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    bizQuery: true,
    basic: true,
    contact: true,
    business: true,
    marketing: true,
    cooperation: true,
    risk: true,
  });

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updateField = (field: keyof DueDiligenceData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const togglePlatform = (platform: string) => {
    setForm((prev) => {
      const current = prev.mainAdPlatforms || [];
      const next = current.includes(platform)
        ? current.filter((p) => p !== platform)
        : [...current, platform];
      return { ...prev, mainAdPlatforms: next };
    });
  };

  // 自动填充回调
  const handleAutoFill = (data: Partial<{ companyFullName: string; registeredCapital: string; foundedYear: string }>) => {
    setForm((prev) => ({
      ...prev,
      ...data,
    }));
  };

  // 完整度计算
  const completeness = useMemo(() => {
    const requiredFields: (keyof DueDiligenceData)[] = [
      "companyFullName", "registeredCapital", "foundedYear", "employeeCount",
      "decisionMaker", "decisionMakerTitle",
      "mainProducts", "targetAudience",
      "currentAdSpend", "cooperationGoal", "expectedBudgetRange",
      "complianceRisk", "budgetClarity",
    ];
    const filled = requiredFields.filter((f) => {
      const val = form[f];
      if (val === undefined || val === null || val === "") return false;
      return true;
    });
    return Math.round((filled.length / requiredFields.length) * 100);
  }, [form]);

  // 风险标签（结合工商风险）
  const riskTags = useMemo(() => {
    const tags: string[] = [];
    if (form.complianceRisk === "high") tags.push("高合规风险");
    if (form.budgetClarity === "unknown") tags.push("预算不清晰");
    if (!form.decisionMaker && !form.decisionMakerTitle) tags.push("决策链不明确");

    // 工商风险标签
    const bizData = mockBusinessIntelligence[oppId];
    if (bizData) {
      const riskAnalysis = calculateBusinessRiskLevel(bizData.risks);
      if (riskAnalysis.level === "high") tags.push("工商高风险");
      else if (riskAnalysis.level === "medium") tags.push("工商风险关注");

      const activeRisks = bizData.risks.filter(r => r.status === "存续" || r.status === "进行中");
      activeRisks.forEach(r => {
        if (r.severity === "danger") tags.push(r.category);
      });
    }
    // 去重
    return Array.from(new Set(tags));
  }, [form, oppId]);

  if (!opp) {
    return (
      <div>
        <PageHeader title="商机不存在" backTo="/opportunities" />
      </div>
    );
  }

  const handleSave = () => {
    toast.success("尽调草稿已保存", { description: "数据已自动保存" });
  };

  const handleSubmit = () => {
    if (completeness < 80) {
      toast.error("尽调完整度不足", {
        description: `当前完整度 ${completeness}%，需达到 80% 才可提交`,
      });
      return;
    }
    toast.success("尽调已提交", { description: "可进入行业诊断阶段" });
    navigate(`/opportunities/${oppId}`);
  };

  // 工商风险摘要（右侧面板）
  const bizData = mockBusinessIntelligence[oppId];
  const bizRiskAnalysis = bizData ? calculateBusinessRiskLevel(bizData.risks) : null;

  return (
    <div>
      <PageHeader
        eyebrow={opp.code}
        title="客户尽调"
        subtitle={`${opp.customer.companyName} · ${opp.name}`}
        backTo={`/opportunities/${oppId}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save size={14} className="mr-1.5" />
              保存草稿
            </Button>
            <Button size="sm" onClick={handleSubmit}>
              <Send size={14} className="mr-1.5" />
              提交尽调
            </Button>
          </div>
        }
      />

      <div className="p-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* 表单主体 */}
          <div className="lg:col-span-3 space-y-4">
            {/* ★ 工商信息自动查询面板 - 新增 */}
            <BusinessIntelligencePanel
              opportunityId={oppId}
              companyName={form.companyFullName || opp.customer.companyName}
              onAutoFill={handleAutoFill}
            />

            {/* 基础信息 */}
            <FormSection
              id="basic"
              title="企业基础信息"
              icon={<Building2 size={16} />}
              expanded={expandedSections.basic}
              onToggle={() => toggleSection("basic")}
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="公司全称" required>
                  <Input value={form.companyFullName || ""} onChange={(e) => updateField("companyFullName", e.target.value)} placeholder="请输入公司全称" />
                </FormField>
                <FormField label="注册资本" required>
                  <Input value={form.registeredCapital || ""} onChange={(e) => updateField("registeredCapital", e.target.value)} placeholder="如：5000万" />
                </FormField>
                <FormField label="成立年份" required>
                  <Input value={form.foundedYear || ""} onChange={(e) => updateField("foundedYear", e.target.value)} placeholder="如：2019" />
                </FormField>
                <FormField label="员工规模" required>
                  <Select value={form.employeeCount || ""} onValueChange={(v) => updateField("employeeCount", v)}>
                    <SelectTrigger><SelectValue placeholder="选择规模" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-50">1-50人</SelectItem>
                      <SelectItem value="50-200">50-200人</SelectItem>
                      <SelectItem value="200-500">200-500人</SelectItem>
                      <SelectItem value="500-1000">500-1000人</SelectItem>
                      <SelectItem value="1000+">1000人以上</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="年营收">
                  <Input value={form.annualRevenue || ""} onChange={(e) => updateField("annualRevenue", e.target.value)} placeholder="如：2亿" />
                </FormField>
              </div>
            </FormSection>

            {/* 联系人与决策链 */}
            <FormSection
              id="contact"
              title="联系人与决策链"
              icon={<Users size={16} />}
              expanded={expandedSections.contact}
              onToggle={() => toggleSection("contact")}
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="决策人" required>
                  <Input value={form.decisionMaker || ""} onChange={(e) => updateField("decisionMaker", e.target.value)} placeholder="决策人姓名" />
                </FormField>
                <FormField label="决策人职位" required>
                  <Input value={form.decisionMakerTitle || ""} onChange={(e) => updateField("decisionMakerTitle", e.target.value)} placeholder="如：CMO" />
                </FormField>
                <FormField label="预算审批人">
                  <Input value={form.budgetApprover || ""} onChange={(e) => updateField("budgetApprover", e.target.value)} placeholder="预算审批人" />
                </FormField>
                <FormField label="技术对接人">
                  <Input value={form.technicalContact || ""} onChange={(e) => updateField("technicalContact", e.target.value)} placeholder="技术对接人" />
                </FormField>
              </div>
            </FormSection>

            {/* 业务现状 */}
            <FormSection
              id="business"
              title="业务现状"
              icon={<TrendingUp size={16} />}
              expanded={expandedSections.business}
              onToggle={() => toggleSection("business")}
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="主要产品/服务" required>
                  <Input value={form.mainProducts || ""} onChange={(e) => updateField("mainProducts", e.target.value)} placeholder="核心产品或服务" />
                </FormField>
                <FormField label="目标受众" required>
                  <Input value={form.targetAudience || ""} onChange={(e) => updateField("targetAudience", e.target.value)} placeholder="如：25-35岁女性" />
                </FormField>
                <FormField label="销售渠道">
                  <Input value={form.salesChannels || ""} onChange={(e) => updateField("salesChannels", e.target.value)} placeholder="如：天猫、抖音、线下" />
                </FormField>
                <FormField label="市场份额">
                  <Input value={form.currentMarketShare || ""} onChange={(e) => updateField("currentMarketShare", e.target.value)} placeholder="如：细分品类Top10" />
                </FormField>
              </div>
            </FormSection>

            {/* 营销现状 */}
            <FormSection
              id="marketing"
              title="营销现状"
              icon={<TrendingUp size={16} />}
              expanded={expandedSections.marketing}
              onToggle={() => toggleSection("marketing")}
            >
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField label="当前月度投放" required>
                    <Input value={form.currentAdSpend || ""} onChange={(e) => updateField("currentAdSpend", e.target.value)} placeholder="如：200万/月" />
                  </FormField>
                  <FormField label="内容团队规模">
                    <Input value={form.contentTeamSize || ""} onChange={(e) => updateField("contentTeamSize", e.target.value)} placeholder="如：15" />
                  </FormField>
                </div>
                <FormField label="主要投放平台">
                  <div className="flex flex-wrap gap-2">
                    {adPlatformOptions.map((p) => (
                      <label key={p} className="flex items-center gap-1.5 cursor-pointer">
                        <Checkbox
                          checked={form.mainAdPlatforms?.includes(p) || false}
                          onCheckedChange={() => togglePlatform(p)}
                        />
                        <span className="text-sm">{p}</span>
                      </label>
                    ))}
                  </div>
                </FormField>
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField label="是否有代理商">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={form.hasAgencyPartner || false}
                        onCheckedChange={(v) => updateField("hasAgencyPartner", v)}
                      />
                      <span className="text-sm">{form.hasAgencyPartner ? "是" : "否"}</span>
                    </div>
                  </FormField>
                  {form.hasAgencyPartner && (
                    <FormField label="代理商名称">
                      <Input value={form.currentAgencyName || ""} onChange={(e) => updateField("currentAgencyName", e.target.value)} placeholder="代理商名称" />
                    </FormField>
                  )}
                </div>
              </div>
            </FormSection>

            {/* 合作诉求 */}
            <FormSection
              id="cooperation"
              title="合作诉求"
              icon={<Handshake size={16} />}
              expanded={expandedSections.cooperation}
              onToggle={() => toggleSection("cooperation")}
            >
              <div className="space-y-4">
                <FormField label="合作目标" required>
                  <Textarea value={form.cooperationGoal || ""} onChange={(e) => updateField("cooperationGoal", e.target.value)} placeholder="客户期望通过合作达成的目标" rows={3} />
                </FormField>
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField label="预算区间" required>
                    <Input value={form.expectedBudgetRange || ""} onChange={(e) => updateField("expectedBudgetRange", e.target.value)} placeholder="如：40-60万/月" />
                  </FormField>
                  <FormField label="期望启动时间">
                    <Input value={form.expectedStartDate || ""} onChange={(e) => updateField("expectedStartDate", e.target.value)} placeholder="如：2024-04" />
                  </FormField>
                </div>
                <FormField label="核心考核指标">
                  <Textarea value={form.keyMetrics || ""} onChange={(e) => updateField("keyMetrics", e.target.value)} placeholder="如：GMV增长30%，品牌搜索指数提升50%" rows={2} />
                </FormField>
              </div>
            </FormSection>

            {/* 风险评估 */}
            <FormSection
              id="risk"
              title="风险评估"
              icon={<AlertTriangle size={16} />}
              expanded={expandedSections.risk}
              onToggle={() => toggleSection("risk")}
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="合规风险" required>
                  <Select value={form.complianceRisk || "low"} onValueChange={(v: any) => updateField("complianceRisk", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">低风险</SelectItem>
                      <SelectItem value="medium">中风险</SelectItem>
                      <SelectItem value="high">高风险</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="预算清晰度" required>
                  <Select value={form.budgetClarity || "unknown"} onValueChange={(v: any) => updateField("budgetClarity", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clear">清晰</SelectItem>
                      <SelectItem value="vague">模糊</SelectItem>
                      <SelectItem value="unknown">未知</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="决策周期">
                  <Input value={form.decisionCycle || ""} onChange={(e) => updateField("decisionCycle", e.target.value)} placeholder="如：2周" />
                </FormField>
                <FormField label="竞品威胁">
                  <Input value={form.competitorThreat || ""} onChange={(e) => updateField("competitorThreat", e.target.value)} placeholder="主要竞品" />
                </FormField>
              </div>
              {form.complianceRisk === "high" && (
                <div className="mt-4">
                  <StatusNote type="danger">
                    <strong>高合规风险：</strong>提交尽调后将自动触发法务预审流程
                  </StatusNote>
                </div>
              )}
            </FormSection>
          </div>

          {/* 右侧面板 */}
          <div className="space-y-4">
            <Card className="shadow-sm sticky top-20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">尽调进度</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CompletenessIndicator value={completeness} />

                {/* ★ 工商风险摘要 - 新增 */}
                {bizRiskAnalysis && (
                  <div className={`p-2.5 rounded-lg border ${
                    bizRiskAnalysis.level === "high"
                      ? "bg-red-50 border-red-200"
                      : bizRiskAnalysis.level === "medium"
                        ? "bg-amber-50 border-amber-200"
                        : "bg-emerald-50 border-emerald-200"
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      {bizRiskAnalysis.level === "high" ? (
                        <ShieldX size={14} className="text-red-500" />
                      ) : bizRiskAnalysis.level === "medium" ? (
                        <ShieldAlert size={14} className="text-amber-500" />
                      ) : (
                        <ShieldCheck size={14} className="text-emerald-500" />
                      )}
                      <span className={`text-xs font-semibold ${
                        bizRiskAnalysis.level === "high"
                          ? "text-red-700"
                          : bizRiskAnalysis.level === "medium"
                            ? "text-amber-700"
                            : "text-emerald-700"
                      }`}>
                        工商信用评分：{bizRiskAnalysis.score}
                      </span>
                    </div>
                    <p className={`text-[10px] ${
                      bizRiskAnalysis.level === "high"
                        ? "text-red-600"
                        : bizRiskAnalysis.level === "medium"
                          ? "text-amber-600"
                          : "text-emerald-600"
                    }`}>
                      {bizRiskAnalysis.summary}
                    </p>
                    {bizData && bizData.risks.filter(r => r.status === "存续" || r.status === "进行中").length > 0 && (
                      <div className="mt-1.5 pt-1.5 border-t border-current/10">
                        {bizData.risks
                          .filter(r => r.status === "存续" || r.status === "进行中")
                          .slice(0, 3)
                          .map(r => (
                            <p key={r.id} className="text-[10px] text-foreground/70 truncate">
                              · {r.category}：{r.title}
                            </p>
                          ))}
                      </div>
                    )}
                  </div>
                )}

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
                {completeness >= 80 ? (
                  <StatusNote type="success">
                    尽调完整度已满足准入条件，可提交进入诊断阶段
                  </StatusNote>
                ) : (
                  <StatusNote type="info">
                    请继续填写必填信息，完整度达到 80% 后可提交
                  </StatusNote>
                )}
                <div className="space-y-2 pt-2">
                  <Button className="w-full" size="sm" onClick={handleSubmit}>
                    <Send size={14} className="mr-1.5" />
                    提交尽调
                  </Button>
                  <Button variant="outline" className="w-full" size="sm" onClick={handleSave}>
                    <Save size={14} className="mr-1.5" />
                    保存草稿
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== 子组件 ====================

function FormSection({
  id,
  title,
  icon,
  expanded,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  icon: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <Card className="shadow-sm">
      <CardHeader
        className="pb-0 cursor-pointer select-none"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
          {expanded ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
        </div>
      </CardHeader>
      {expanded && <CardContent className="pt-4">{children}</CardContent>}
    </Card>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">
        {label}
        {required && <span className="text-danger ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}
