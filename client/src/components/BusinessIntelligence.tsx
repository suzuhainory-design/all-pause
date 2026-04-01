/*
 * 工商信息查询面板 & 关联风险识别组件
 * Design: Soft Industrial — 暖灰底色 + 深青主色调
 * 包含：一键查询、工商信息展示、股东穿透、关联企业、风险识别
 */
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { StatusNote } from "@/components/shared";
import {
  Search,
  Building2,
  Users,
  Network,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ExternalLink,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Info,
  Loader2,
  Landmark,
  MapPin,
  CalendarDays,
  FileText,
  Hash,
  Scale,
  ArrowUpRight,
  CircleDot,
  Zap,
  Eye,
  FileDown,
} from "lucide-react";
import {
  type BusinessIntelligence as BizIntel,
  type BusinessRegistration,
  type Shareholder,
  type AssociatedCompany,
  type RiskItem,
  type Risk,
  mockBusinessIntelligence,
  mockOpportunities,
  calculateBusinessRiskLevel,
} from "@/lib/data";
import { exportBusinessIntelligencePdf } from "@/lib/exportPdf";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// ==================== 主组件：工商信息查询面板 ====================

export function BusinessIntelligencePanel({
  opportunityId,
  companyName,
  onAutoFill,
}: {
  opportunityId: number;
  companyName: string;
  onAutoFill?: (data: Partial<{
    companyFullName: string;
    registeredCapital: string;
    foundedYear: string;
  }>) => void;
}) {
  const [queryState, setQueryState] = useState<"idle" | "querying" | "done" | "error">("idle");
  const [bizData, setBizData] = useState<BizIntel | null>(null);
  const [searchInput, setSearchInput] = useState(companyName || "");
  const [activeTab, setActiveTab] = useState("registration");

  // 检查是否已有缓存数据
  useEffect(() => {
    const cached = mockBusinessIntelligence[opportunityId];
    if (cached) {
      setBizData(cached);
      setQueryState("done");
    }
  }, [opportunityId]);

  const handleQuery = useCallback(() => {
    if (!searchInput.trim()) {
      toast.error("请输入企业名称");
      return;
    }
    setQueryState("querying");
    // 模拟 API 查询延迟
    setTimeout(() => {
      const data = mockBusinessIntelligence[opportunityId];
      if (data) {
        setBizData(data);
        setQueryState("done");
        toast.success("工商信息查询完成", {
          description: `已获取 ${searchInput} 的工商登记、股东、关联企业及风险信息`,
        });
      } else {
        setQueryState("error");
        toast.error("未找到匹配的企业信息", {
          description: "请检查企业名称是否正确",
        });
      }
    }, 2000);
  }, [searchInput, opportunityId]);

  const handleAutoFill = useCallback(() => {
    if (!bizData || !onAutoFill) return;
    const reg = bizData.registration;
    onAutoFill({
      companyFullName: reg.companyName,
      registeredCapital: reg.registeredCapital,
      foundedYear: reg.establishDate.split("-")[0],
    });
    toast.success("已自动填充工商信息到尽调表单");
  }, [bizData, onAutoFill]);

  const riskAnalysis = bizData ? calculateBusinessRiskLevel(bizData.risks) : null;

  return (
    <Card className="shadow-sm border-l-4 border-l-primary/60">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Building2 size={16} className="text-primary" />
            工商信息自动查询
          </CardTitle>
          {queryState === "done" && bizData && (
            <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              数据更新于 {bizData.queryTime}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 搜索栏 */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="输入企业名称、统一社会信用代码..."
              className="pl-9 h-9 text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleQuery()}
            />
          </div>
          <Button
            size="sm"
            className="h-9 px-4"
            onClick={handleQuery}
            disabled={queryState === "querying"}
          >
            {queryState === "querying" ? (
              <>
                <Loader2 size={14} className="mr-1.5 animate-spin" />
                查询中
              </>
            ) : queryState === "done" ? (
              <>
                <RefreshCw size={14} className="mr-1.5" />
                刷新
              </>
            ) : (
              <>
                <Zap size={14} className="mr-1.5" />
                一键查询
              </>
            )}
          </Button>
        </div>

        {/* 查询中状态 */}
        <AnimatePresence>
          {queryState === "querying" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <QueryingAnimation />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 查询结果 */}
        {queryState === "done" && bizData && riskAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* 风险概览条 */}
            <RiskOverviewBar
              riskAnalysis={riskAnalysis}
              totalRisks={bizData.risks.length}
              activeRisks={bizData.risks.filter(r => r.status === "存续" || r.status === "进行中").length}
            />

            {/* 操作按钮 */}
            {onAutoFill && (
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs border-dashed border-primary/40 text-primary hover:bg-primary/5"
                onClick={handleAutoFill}
              >
                <ArrowUpRight size={12} className="mr-1.5" />
                将工商信息自动填充到尽调表单
              </Button>
            )}

            {/* Tab 切换 */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-4 h-9">
                <TabsTrigger value="registration" className="text-xs gap-1">
                  <Landmark size={12} />
                  工商登记
                </TabsTrigger>
                <TabsTrigger value="shareholders" className="text-xs gap-1">
                  <Users size={12} />
                  股东
                  <span className="text-[10px] bg-muted-foreground/10 px-1 rounded">
                    {bizData.shareholders.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="associated" className="text-xs gap-1">
                  <Network size={12} />
                  关联
                  <span className="text-[10px] bg-muted-foreground/10 px-1 rounded">
                    {bizData.associatedCompanies.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="risks" className="text-xs gap-1">
                  <ShieldAlert size={12} />
                  风险
                  <span className={`text-[10px] px-1 rounded ${
                    bizData.risks.filter(r => r.status === "存续" || r.status === "进行中").length > 0
                      ? "bg-danger/10 text-danger"
                      : "bg-muted-foreground/10"
                  }`}>
                    {bizData.risks.filter(r => r.status === "存续" || r.status === "进行中").length}
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="registration" className="mt-3">
                <RegistrationPanel registration={bizData.registration} />
              </TabsContent>

              <TabsContent value="shareholders" className="mt-3">
                <ShareholdersPanel shareholders={bizData.shareholders} />
              </TabsContent>

              <TabsContent value="associated" className="mt-3">
                <AssociatedCompaniesPanel companies={bizData.associatedCompanies} />
              </TabsContent>

              <TabsContent value="risks" className="mt-3">
                <RiskIdentificationPanel risks={bizData.risks} riskAnalysis={riskAnalysis} />
              </TabsContent>
            </Tabs>

            {/* 数据来源 */}
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <span className="text-[10px] text-muted-foreground">
                数据来源：{bizData.dataSource}
              </span>
              <Button variant="ghost" size="sm" className="h-6 text-[10px] text-muted-foreground hover:text-primary">
                <ExternalLink size={10} className="mr-1" />
                查看完整企业报告
              </Button>
            </div>
          </motion.div>
        )}

        {/* 错误状态 */}
        {queryState === "error" && (
          <StatusNote type="warning">
            未找到匹配的企业信息，请检查企业名称是否正确，或尝试使用统一社会信用代码查询。
          </StatusNote>
        )}

        {/* 初始状态提示 */}
        {queryState === "idle" && (
          <StatusNote type="info">
            输入企业名称后点击"一键查询"，系统将自动获取工商登记信息、股东结构、关联企业及风险预警数据。
          </StatusNote>
        )}
      </CardContent>
    </Card>
  );
}

// ==================== 查询动画 ====================

function QueryingAnimation() {
  const steps = [
    { label: "连接工商数据库...", delay: 0 },
    { label: "获取企业登记信息...", delay: 400 },
    { label: "查询股东与关联企业...", delay: 800 },
    { label: "扫描风险预警数据...", delay: 1200 },
    { label: "生成综合分析报告...", delay: 1600 },
  ];
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timers = steps.map((_, i) =>
      setTimeout(() => setActiveStep(i), steps[i].delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <Card className="bg-muted/30 border-dashed">
      <CardContent className="py-4">
        <div className="space-y-2.5">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: i <= activeStep ? 1 : 0.3, x: 0 }}
              transition={{ delay: step.delay / 1000, duration: 0.2 }}
              className="flex items-center gap-2.5"
            >
              {i < activeStep ? (
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
              ) : i === activeStep ? (
                <Loader2 size={14} className="text-primary animate-spin shrink-0" />
              ) : (
                <CircleDot size={14} className="text-muted-foreground/40 shrink-0" />
              )}
              <span className={`text-xs ${i <= activeStep ? "text-foreground" : "text-muted-foreground/50"}`}>
                {step.label}
              </span>
            </motion.div>
          ))}
        </div>
        <Progress value={(activeStep + 1) / steps.length * 100} className="mt-3 h-1" />
      </CardContent>
    </Card>
  );
}

// ==================== 风险概览条 ====================

function RiskOverviewBar({
  riskAnalysis,
  totalRisks,
  activeRisks,
}: {
  riskAnalysis: { level: Risk; score: number; summary: string };
  totalRisks: number;
  activeRisks: number;
}) {
  const colorMap: Record<Risk, { bg: string; border: string; text: string; icon: React.ReactNode }> = {
    low: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
      icon: <ShieldCheck size={18} className="text-emerald-500" />,
    },
    medium: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
      icon: <ShieldAlert size={18} className="text-amber-500" />,
    },
    high: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      icon: <ShieldX size={18} className="text-red-500" />,
    },
  };
  const style = colorMap[riskAnalysis.level];

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border ${style.bg} ${style.border}`}>
      {style.icon}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${style.text}`}>
            企业信用评分：{riskAnalysis.score}
          </span>
          <Badge
            variant="outline"
            className={`text-[10px] h-5 ${style.text} ${style.border}`}
          >
            {riskAnalysis.level === "low" ? "低风险" : riskAnalysis.level === "medium" ? "中风险" : "高风险"}
          </Badge>
        </div>
        <p className={`text-xs mt-0.5 ${style.text} opacity-80`}>{riskAnalysis.summary}</p>
      </div>
      <div className="text-right shrink-0">
        <div className="text-xs text-muted-foreground">
          风险项 <span className="font-semibold text-foreground">{totalRisks}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          存续 <span className={`font-semibold ${activeRisks > 0 ? "text-danger" : "text-foreground"}`}>{activeRisks}</span>
        </div>
      </div>
    </div>
  );
}

// ==================== 工商登记面板 ====================

function RegistrationPanel({ registration }: { registration: BusinessRegistration }) {
  const [expanded, setExpanded] = useState(false);

  const mainFields = [
    { label: "企业名称", value: registration.companyName, icon: <Building2 size={12} /> },
    { label: "法定代表人", value: registration.legalRepresentative, icon: <Users size={12} /> },
    { label: "注册资本", value: registration.registeredCapital, icon: <Scale size={12} /> },
    { label: "实缴资本", value: registration.paidInCapital, icon: <Scale size={12} /> },
    { label: "成立日期", value: registration.establishDate, icon: <CalendarDays size={12} /> },
    { label: "经营状态", value: registration.operatingStatus, icon: <CheckCircle2 size={12} /> },
    { label: "统一社会信用代码", value: registration.unifiedSocialCreditCode, icon: <Hash size={12} /> },
    { label: "行业分类", value: registration.industryCategory, icon: <FileText size={12} /> },
  ];

  const extraFields = [
    { label: "公司类型", value: registration.companyType },
    { label: "登记机关", value: registration.registrationAuthority },
    { label: "注册地址", value: registration.registeredAddress },
    { label: "核准日期", value: registration.approvalDate },
    { label: "营业期限", value: registration.operatingPeriod },
    { label: "纳税人识别号", value: registration.taxNumber },
    { label: "经营范围", value: registration.businessScope },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
        {mainFields.map((f) => (
          <div key={f.label} className="flex items-start gap-2">
            <span className="text-muted-foreground mt-0.5 shrink-0">{f.icon}</span>
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground">{f.label}</p>
              <p className="text-xs font-medium text-foreground truncate">{f.value}</p>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2.5 pt-2 border-t border-border/50"
          >
            {extraFields.map((f) => (
              <div key={f.label}>
                <p className="text-[10px] text-muted-foreground">{f.label}</p>
                <p className="text-xs text-foreground">{f.value}</p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        variant="ghost"
        size="sm"
        className="w-full h-7 text-xs text-muted-foreground"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? (
          <>收起详情 <ChevronUp size={12} className="ml-1" /></>
        ) : (
          <>展开全部工商信息 <ChevronDown size={12} className="ml-1" /></>
        )}
      </Button>
    </div>
  );
}

// ==================== 股东穿透面板 ====================

function ShareholdersPanel({ shareholders }: { shareholders: Shareholder[] }) {
  return (
    <div className="space-y-3">
      {/* 股权结构可视化 */}
      <div className="space-y-2">
        {shareholders.map((sh, i) => (
          <motion.div
            key={sh.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="group"
          >
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                sh.type === "自然人"
                  ? "bg-primary/10 text-primary"
                  : sh.type === "企业法人"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-slate-100 text-slate-600"
              }`}>
                {sh.type === "自然人" ? sh.name[0] : "企"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground truncate">{sh.name}</span>
                  <Badge variant="outline" className="text-[10px] h-4 shrink-0">
                    {sh.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-[10px] text-muted-foreground">
                    认缴 {sh.investmentAmount}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {sh.subscriptionDate}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-lg font-bold text-primary">{sh.investmentRatio}%</div>
                <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden mt-1">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${sh.investmentRatio}%` }}
                    transition={{ delay: i * 0.08 + 0.2, duration: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 股权占比汇总 */}
      <div className="flex items-center gap-2 pt-2 border-t border-border/50">
        <span className="text-[10px] text-muted-foreground">股权占比分布：</span>
        <div className="flex-1 h-3 rounded-full overflow-hidden flex">
          {shareholders.map((sh, i) => {
            const colors = ["bg-primary", "bg-amber-500", "bg-emerald-500", "bg-violet-500", "bg-rose-500"];
            return (
              <Tooltip key={sh.name}>
                <TooltipTrigger asChild>
                  <div
                    className={`h-full ${colors[i % colors.length]} transition-all hover:opacity-80`}
                    style={{ width: `${sh.investmentRatio}%` }}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{sh.name}：{sh.investmentRatio}%</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ==================== 关联企业面板 ====================

function AssociatedCompaniesPanel({ companies }: { companies: AssociatedCompany[] }) {
  const riskColorMap: Record<Risk, string> = {
    low: "border-l-emerald-400",
    medium: "border-l-amber-400",
    high: "border-l-red-400",
  };

  return (
    <div className="space-y-2.5">
      {companies.map((company, i) => (
        <motion.div
          key={company.name}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
        >
          <div className={`p-3 rounded-lg bg-muted/20 border-l-3 ${riskColorMap[company.riskLevel]} hover:bg-muted/40 transition-colors`}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground truncate">{company.name}</span>
                  <Badge variant="outline" className="text-[10px] h-4 shrink-0">
                    {company.relationship}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Users size={10} />
                    法人：{company.legalRepresentative}
                  </span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Scale size={10} />
                    注册资本：{company.registeredCapital}
                  </span>
                  <span className={`text-[10px] flex items-center gap-1 ${
                    company.operatingStatus === "注销" ? "text-danger" : "text-muted-foreground"
                  }`}>
                    <CircleDot size={10} />
                    {company.operatingStatus}
                  </span>
                </div>
              </div>
              {company.riskLevel !== "low" && (
                <Badge
                  variant="outline"
                  className={`text-[10px] h-5 shrink-0 ${
                    company.riskLevel === "high"
                      ? "text-danger border-danger/30 bg-danger/5"
                      : "text-amber-600 border-amber-300 bg-amber-50"
                  }`}
                >
                  {company.riskLevel === "high" ? "高风险" : "关注"}
                </Badge>
              )}
            </div>
          </div>
        </motion.div>
      ))}

      {companies.length === 0 && (
        <div className="text-center py-6 text-sm text-muted-foreground">
          未发现关联企业
        </div>
      )}
    </div>
  );
}

// ==================== 风险识别面板 ====================

function RiskIdentificationPanel({
  risks,
  riskAnalysis,
}: {
  risks: RiskItem[];
  riskAnalysis: { level: Risk; score: number; summary: string };
}) {
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = risks.filter((r) => {
    if (filter === "active") return r.status === "存续" || r.status === "进行中";
    if (filter === "resolved") return r.status === "已消除" || r.status === "已结案";
    return true;
  });

  const severityIcon: Record<string, React.ReactNode> = {
    danger: <XCircle size={14} className="text-red-500" />,
    warning: <AlertTriangle size={14} className="text-amber-500" />,
    info: <Info size={14} className="text-blue-500" />,
  };

  const statusBadge: Record<string, { className: string }> = {
    "存续": { className: "bg-red-50 text-red-600 border-red-200" },
    "进行中": { className: "bg-amber-50 text-amber-600 border-amber-200" },
    "已消除": { className: "bg-emerald-50 text-emerald-600 border-emerald-200" },
    "已结案": { className: "bg-slate-50 text-slate-600 border-slate-200" },
  };

  const categoryIcon: Record<string, string> = {
    "经营异常": "📋",
    "行政处罚": "⚖️",
    "失信被执行": "🚫",
    "司法诉讼": "🔍",
    "股权质押": "🔒",
    "动产抵押": "📦",
    "税务违规": "💰",
    "环保处罚": "🌿",
  };

  return (
    <div className="space-y-3">
      {/* 风险分类统计 */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "全部", value: risks.length, key: "all" as const },
          { label: "存续风险", value: risks.filter(r => r.status === "存续" || r.status === "进行中").length, key: "active" as const },
          { label: "已消除", value: risks.filter(r => r.status === "已消除" || r.status === "已结案").length, key: "resolved" as const },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key)}
            className={`p-2 rounded-lg text-center transition-all ${
              filter === item.key
                ? "bg-primary/10 border border-primary/30 ring-1 ring-primary/20"
                : "bg-muted/30 border border-transparent hover:bg-muted/50"
            }`}
          >
            <div className={`text-lg font-bold ${filter === item.key ? "text-primary" : "text-foreground"}`}>
              {item.value}
            </div>
            <div className="text-[10px] text-muted-foreground">{item.label}</div>
          </button>
        ))}
        <div className="p-2 rounded-lg bg-muted/30 border border-transparent text-center">
          <div className={`text-lg font-bold ${
            riskAnalysis.level === "high" ? "text-danger" : riskAnalysis.level === "medium" ? "text-amber-600" : "text-emerald-600"
          }`}>
            {riskAnalysis.score}
          </div>
          <div className="text-[10px] text-muted-foreground">信用评分</div>
        </div>
      </div>

      {/* 风险列表 */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-8">
            <ShieldCheck size={32} className="mx-auto text-emerald-400 mb-2" />
            <p className="text-sm text-muted-foreground">
              {filter === "active" ? "无存续风险项" : filter === "resolved" ? "无已消除风险项" : "未发现风险项"}
            </p>
          </div>
        ) : (
          filtered.map((risk, i) => (
            <motion.div
              key={risk.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div
                className={`rounded-lg border transition-all cursor-pointer ${
                  expandedId === risk.id ? "bg-muted/40 shadow-sm" : "bg-muted/10 hover:bg-muted/30"
                } ${
                  risk.severity === "danger" ? "border-red-200/60" :
                  risk.severity === "warning" ? "border-amber-200/60" : "border-border/60"
                }`}
                onClick={() => setExpandedId(expandedId === risk.id ? null : risk.id)}
              >
                <div className="flex items-center gap-2.5 p-3">
                  {severityIcon[risk.severity]}
                  <span className="text-sm mr-1">{categoryIcon[risk.category]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-foreground truncate">{risk.title}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-muted-foreground">{risk.category}</span>
                      <span className="text-[10px] text-muted-foreground">·</span>
                      <span className="text-[10px] text-muted-foreground">{risk.date}</span>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[10px] h-5 shrink-0 ${statusBadge[risk.status]?.className || ""}`}
                  >
                    {risk.status}
                  </Badge>
                  {expandedId === risk.id ? (
                    <ChevronUp size={14} className="text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown size={14} className="text-muted-foreground shrink-0" />
                  )}
                </div>

                <AnimatePresence>
                  {expandedId === risk.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 pb-3 pt-0 border-t border-border/30 mt-0">
                        <div className="pt-2.5 space-y-2">
                          <p className="text-xs text-foreground leading-relaxed">{risk.detail}</p>
                          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <FileText size={10} />
                              来源：{risk.source}
                            </span>
                            <span className="flex items-center gap-1">
                              <CalendarDays size={10} />
                              {risk.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

// ==================== 商机详情页内的工商信息摘要卡片 ====================

export function BusinessIntelligenceSummaryCard({
  opportunityId,
}: {
  opportunityId: number;
}) {
  const [exporting, setExporting] = useState(false);
  const bizData = mockBusinessIntelligence[opportunityId];
  if (!bizData) return null;

  const riskAnalysis = calculateBusinessRiskLevel(bizData.risks);
  const activeRisks = bizData.risks.filter(r => r.status === "存续" || r.status === "进行中");
  const opp = mockOpportunities.find(o => o.id === opportunityId);

  const handleExportPdf = async () => {
    setExporting(true);
    try {
      await exportBusinessIntelligencePdf(bizData, opp?.name);
      toast.success("PDF 导出成功", {
        description: `已生成 ${bizData.registration.companyName} 的工商信息报告`,
      });
    } catch (err) {
      console.error("PDF export error:", err);
      toast.error("PDF 导出失败", {
        description: "请稍后重试",
      });
    } finally {
      setExporting(false);
    }
  };

  const colorMap: Record<Risk, { bg: string; text: string }> = {
    low: { bg: "bg-emerald-50", text: "text-emerald-700" },
    medium: { bg: "bg-amber-50", text: "text-amber-700" },
    high: { bg: "bg-red-50", text: "text-red-700" },
  };
  const style = colorMap[riskAnalysis.level];

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Eye size={14} className="text-primary" />
          工商信息概览
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* 基本信息 */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-[10px] text-muted-foreground">法定代表人</p>
            <p className="text-xs font-medium">{bizData.registration.legalRepresentative}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">注册资本</p>
            <p className="text-xs font-medium">{bizData.registration.registeredCapital}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">成立日期</p>
            <p className="text-xs font-medium">{bizData.registration.establishDate}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">经营状态</p>
            <p className="text-xs font-medium text-emerald-600">
              {bizData.registration.operatingStatus.includes("存续") ? "存续" : bizData.registration.operatingStatus}
            </p>
          </div>
        </div>

        {/* 风险摘要 */}
        <div className={`p-2 rounded-md ${style.bg}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium ${style.text}`}>
              信用评分 {riskAnalysis.score}
            </span>
            <Badge variant="outline" className={`text-[10px] h-4 ${style.text}`}>
              {riskAnalysis.level === "low" ? "低风险" : riskAnalysis.level === "medium" ? "中风险" : "高风险"}
            </Badge>
          </div>
          {activeRisks.length > 0 && (
            <div className="mt-1.5 space-y-0.5">
              {activeRisks.slice(0, 2).map((r) => (
                <p key={r.id} className={`text-[10px] ${style.text} opacity-80 truncate`}>
                  · {r.title}
                </p>
              ))}
              {activeRisks.length > 2 && (
                <p className={`text-[10px] ${style.text} opacity-60`}>
                  还有 {activeRisks.length - 2} 项...
                </p>
              )}
            </div>
          )}
        </div>

        {/* 股东 */}
        <div>
          <p className="text-[10px] text-muted-foreground mb-1">主要股东</p>
          <div className="flex flex-wrap gap-1">
            {bizData.shareholders.slice(0, 3).map((sh) => (
              <span key={sh.name} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-foreground">
                {sh.name} {sh.investmentRatio}%
              </span>
            ))}
          </div>
        </div>

        {/* 导出 PDF 按钮 */}
        <Button
          variant="outline"
          size="sm"
          className="w-full h-8 text-xs border-dashed gap-1.5"
          onClick={handleExportPdf}
          disabled={exporting}
        >
          {exporting ? (
            <>
              <Loader2 size={12} className="animate-spin" />
              正在生成...
            </>
          ) : (
            <>
              <FileDown size={12} />
              导出为 PDF
            </>
          )}
        </Button>

        <div className="text-[10px] text-muted-foreground pt-1 border-t border-border/50">
          数据更新于 {bizData.queryTime}
        </div>
      </CardContent>
    </Card>
  );
}
