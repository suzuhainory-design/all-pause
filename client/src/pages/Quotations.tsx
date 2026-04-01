/*
 * 报价管理页面
 * Design: Soft Industrial - 费用明细表 + 价格摘要面板 + 审批规则提示
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
import { Separator } from "@/components/ui/separator";
import { PageHeader, StatusNote, StageBadge } from "@/components/shared";
import {
  mockOpportunities,
  mockQuotations,
  mockProposals,
  calculateQuotation,
  checkApprovalTriggers,
  type QuotationItem,
  type Quotation,
} from "@/lib/data";
import { toast } from "sonner";
import {
  Save,
  Send,
  Plus,
  Trash2,
  Receipt,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const defaultItems: QuotationItem[] = [
  { label: "基础服务费", amount: 0 },
  { label: "内容生产费", amount: 0 },
  { label: "投放管理费", amount: 0 },
  { label: "技术服务费", amount: 0 },
  { label: "项目管理费", amount: 0 },
];

// ==================== 报价列表页 ====================

export function QuotationListPage() {
  const quotations = Object.values(mockQuotations);
  const statusMap: Record<string, { label: string; color: string }> = {
    draft: { label: "草稿", color: "bg-muted text-muted-foreground" },
    pending_approval: { label: "审批中", color: "bg-terracotta/10 text-terracotta border-terracotta/20" },
    approved: { label: "已通过", color: "bg-success/10 text-success border-success/20" },
    rejected: { label: "已驳回", color: "bg-danger/10 text-danger border-danger/20" },
    sent: { label: "已发送", color: "bg-primary/10 text-primary border-primary/20" },
    expired: { label: "已过期", color: "bg-muted text-muted-foreground" },
  };

  return (
    <div>
      <PageHeader
        eyebrow="Quotation Center"
        title="报价管理"
        subtitle="管理所有报价单的创建、审批和发送"
      />
      <div className="p-6 space-y-4">
        {quotations.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">暂无报价记录</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/30">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">报价编号</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">商机</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">套餐</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">原价</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">折扣</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">最终报价</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">毛利率</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">状态</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotations.map((q) => {
                      const opp = mockOpportunities.find((o) => o.id === q.opportunityId);
                      const st = statusMap[q.status] || statusMap.draft;
                      return (
                        <tr key={q.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                          <td className="py-3 px-4 font-mono text-xs font-medium">{q.quotationCode}</td>
                          <td className="py-3 px-4">
                            <Link href={`/opportunities/${q.opportunityId}`} className="text-primary hover:underline text-sm">
                              {opp?.name || "—"}
                            </Link>
                          </td>
                          <td className="py-3 px-4 text-sm">{q.packageType}</td>
                          <td className="py-3 px-4 text-right font-mono text-sm">¥{q.originalPrice.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right font-mono text-sm">{q.discountRate}%</td>
                          <td className="py-3 px-4 text-right font-mono text-sm font-semibold text-primary">¥{q.finalPrice.toLocaleString()}</td>
                          <td className={cn("py-3 px-4 text-right font-mono text-sm font-semibold", q.grossMarginRate < 30 ? "text-danger" : "text-success")}>
                            {q.grossMarginRate}%
                          </td>
                          <td className="py-3 px-4">
                            <span className={cn("px-2 py-0.5 rounded-md text-xs border", st.color)}>{st.label}</span>
                          </td>
                          <td className="py-3 px-4">
                            <Link href={`/opportunities/${q.opportunityId}/quotation`}>
                              <Button variant="ghost" size="sm" className="h-7 text-xs">
                                详情 <ChevronRight size={12} className="ml-0.5" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// ==================== 报价编辑页 ====================

export function QuotationEditPage() {
  const params = useParams<{ id: string }>();
  const oppId = parseInt(params.id || "0");
  const opp = mockOpportunities.find((o) => o.id === oppId);
  const existing = mockQuotations[oppId];
  const proposal = mockProposals[oppId];
  const [, navigate] = useLocation();

  const [items, setItems] = useState<QuotationItem[]>(
    existing?.items || defaultItems
  );
  const [discountRate, setDiscountRate] = useState(existing?.discountRate || 100);
  const [grossMarginRate, setGrossMarginRate] = useState(existing?.grossMarginRate || 40);
  const [paymentTerm, setPaymentTerm] = useState(existing?.paymentTerm || "季付");
  const [accountPeriodDays, setAccountPeriodDays] = useState(existing?.accountPeriodDays || 30);
  const [specialTerms, setSpecialTerms] = useState(existing?.specialTerms || "");
  const [validUntil, setValidUntil] = useState(existing?.validUntil || "");
  const [packageType, setPackageType] = useState(existing?.packageType || proposal?.proposalType || "增长版");
  const [serviceCycleMonths, setServiceCycleMonths] = useState(existing?.serviceCycleMonths || proposal?.serviceCycleMonths || 6);

  // 自动计算
  const { originalPrice, finalPrice } = useMemo(
    () => calculateQuotation(items, discountRate),
    [items, discountRate]
  );

  // 审批触发规则
  const approvalTriggers = useMemo(
    () => checkApprovalTriggers(discountRate, grossMarginRate, accountPeriodDays, specialTerms),
    [discountRate, grossMarginRate, accountPeriodDays, specialTerms]
  );

  const needsApproval = approvalTriggers.length > 0;

  const updateItem = (index: number, field: keyof QuotationItem, value: any) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: field === "amount" ? parseInt(value) || 0 : value };
      return next;
    });
  };

  const addItem = () => {
    setItems((prev) => [...prev, { label: "", amount: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  if (!opp) {
    return <div><PageHeader title="商机不存在" backTo="/opportunities" /></div>;
  }

  // 准入检查：方案可行性
  if (proposal && proposal.feasibilityStatus === "fail") {
    return (
      <div>
        <PageHeader eyebrow={opp.code} title="报价管理" backTo={`/opportunities/${oppId}`} />
        <div className="p-6">
          <StatusNote type="danger">
            <strong>准入条件未满足：</strong>方案可行性校验未通过，不可进入报价阶段。
            <Button variant="link" size="sm" className="ml-2 h-auto p-0 text-xs" onClick={() => navigate(`/opportunities/${oppId}/proposal`)}>
              去完善方案
            </Button>
          </StatusNote>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    if (originalPrice <= 0) {
      toast.error("请填写费用明细", { description: "至少需要一项费用" });
      return;
    }
    if (needsApproval) {
      toast.success("报价已提交审批", {
        description: `触发 ${approvalTriggers.length} 条审批规则，已进入审批流程`,
      });
    } else {
      toast.success("报价已提交", { description: "无需审批，可直接发送" });
    }
    navigate(`/opportunities/${oppId}`);
  };

  const handleSendQuote = () => {
    if (needsApproval) {
      toast.error("报价需先通过审批", { description: "请先提交审批" });
      return;
    }
    toast.success("报价已发送至客户", { description: "等待客户确认" });
  };

  return (
    <div>
      <PageHeader
        eyebrow={opp.code}
        title="报价管理"
        subtitle={`${opp.customer.companyName} · ${opp.name}`}
        backTo={`/opportunities/${oppId}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.success("草稿已保存")}>
              <Save size={14} className="mr-1.5" /> 保存
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast("功能开发中")}>
              <FileDown size={14} className="mr-1.5" /> 导出PDF
            </Button>
            <Button size="sm" onClick={handleSubmit}>
              <Send size={14} className="mr-1.5" />
              {needsApproval ? "提交审批" : "提交报价"}
            </Button>
          </div>
        }
      />

      <div className="p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* 左侧：费用明细 */}
          <div className="lg:col-span-2 space-y-4">
            {/* 基本信息 */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">报价基本信息</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">套餐类型</Label>
                    <Select value={packageType} onValueChange={setPackageType}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="基础版">基础版</SelectItem>
                        <SelectItem value="增长版">增长版</SelectItem>
                        <SelectItem value="全域版">全域版</SelectItem>
                        <SelectItem value="定制版">定制版</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">服务周期（月）</Label>
                    <Input type="number" value={serviceCycleMonths} onChange={(e) => setServiceCycleMonths(parseInt(e.target.value) || 0)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">有效期至</Label>
                    <Input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 费用明细 */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">费用明细</CardTitle>
                  <Button variant="outline" size="sm" className="h-7 text-xs" onClick={addItem}>
                    <Plus size={12} className="mr-1" /> 添加费用项
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-6 shrink-0">{i + 1}.</span>
                      <Input
                        value={item.label}
                        onChange={(e) => updateItem(i, "label", e.target.value)}
                        placeholder="费用项名称"
                        className="flex-1 text-sm"
                      />
                      <div className="relative w-40">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">¥</span>
                        <Input
                          type="number"
                          value={item.amount || ""}
                          onChange={(e) => updateItem(i, "amount", e.target.value)}
                          placeholder="金额"
                          className="pl-7 text-sm font-mono text-right"
                        />
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive" onClick={() => removeItem(i)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">原价合计</span>
                  <span className="text-lg font-bold font-mono">¥{originalPrice.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* 折扣与付款 */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">折扣与付款条件</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">折扣率</Label>
                    <span className={cn(
                      "text-sm font-bold font-mono",
                      discountRate < 80 ? "text-danger" : "text-foreground"
                    )}>
                      {discountRate}%
                    </span>
                  </div>
                  <Slider
                    value={[discountRate]}
                    onValueChange={([v]) => setDiscountRate(v)}
                    min={50}
                    max={100}
                    step={1}
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>50%</span>
                    <span className="text-danger">80% 审批线</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">预估毛利率</Label>
                    <span className={cn(
                      "text-sm font-bold font-mono",
                      grossMarginRate < 30 ? "text-danger" : "text-success"
                    )}>
                      {grossMarginRate}%
                    </span>
                  </div>
                  <Slider
                    value={[grossMarginRate]}
                    onValueChange={([v]) => setGrossMarginRate(v)}
                    min={0}
                    max={80}
                    step={1}
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>0%</span>
                    <span className="text-danger">30% 审批线</span>
                    <span>80%</span>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">付款方式</Label>
                    <Select value={paymentTerm} onValueChange={setPaymentTerm}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="预付">预付</SelectItem>
                        <SelectItem value="月付">月付</SelectItem>
                        <SelectItem value="季付">季付</SelectItem>
                        <SelectItem value="半年付">半年付</SelectItem>
                        <SelectItem value="年付">年付</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      账期（天）
                      {accountPeriodDays > 30 && (
                        <span className="text-danger ml-1">超过审批线</span>
                      )}
                    </Label>
                    <Input
                      type="number"
                      value={accountPeriodDays}
                      onChange={(e) => setAccountPeriodDays(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">特殊条款</Label>
                  <Textarea
                    value={specialTerms}
                    onChange={(e) => setSpecialTerms(e.target.value)}
                    placeholder="如有特殊条款请在此填写（将触发审批）..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：价格摘要 + 审批规则 */}
          <div className="space-y-4">
            <Card className="shadow-sm sticky top-20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">价格摘要</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">原价</span>
                    <span className="font-mono">¥{originalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">折扣率</span>
                    <span className={cn("font-mono font-semibold", discountRate < 80 ? "text-danger" : "")}>
                      {discountRate}%
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">最终报价</span>
                    <span className="text-xl font-bold font-mono text-primary">
                      ¥{finalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">毛利率</span>
                    <span className={cn("font-mono font-semibold", grossMarginRate < 30 ? "text-danger" : "text-success")}>
                      {grossMarginRate}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">服务周期</span>
                    <span>{serviceCycleMonths}个月</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">月均费用</span>
                    <span className="font-mono">
                      ¥{serviceCycleMonths > 0 ? Math.round(finalPrice / serviceCycleMonths).toLocaleString() : "—"}
                    </span>
                  </div>
                </div>

                <Separator />

                {/* 审批规则 */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    审批规则检测
                  </p>
                  {needsApproval ? (
                    <div className="space-y-2">
                      <StatusNote type="warning">
                        <strong>已触发 {approvalTriggers.length} 条审批规则</strong>
                      </StatusNote>
                      <ul className="space-y-1.5">
                        {approvalTriggers.map((t, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-xs text-terracotta">
                            <AlertTriangle size={12} className="shrink-0 mt-0.5" />
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <StatusNote type="success">
                      未触发审批规则，可直接发送报价
                    </StatusNote>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button className="w-full" size="sm" onClick={handleSubmit}>
                    <Send size={14} className="mr-1.5" />
                    {needsApproval ? "提交审批" : "提交报价"}
                  </Button>
                  {!needsApproval && (
                    <Button variant="outline" className="w-full" size="sm" onClick={handleSendQuote}>
                      发送给客户
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 绑定方案 */}
            {proposal && (
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">绑定方案版本</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">方案名称</span>
                    <span className="font-medium text-xs truncate max-w-[140px]">{proposal.proposalName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">版本</span>
                    <span className="font-mono text-xs">v{proposal.version}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">状态</span>
                    {proposal.isActive ? (
                      <span className="px-2 py-0.5 rounded-md bg-success/10 text-success text-[10px] border border-success/20">
                        生效版本
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-danger/10 text-danger text-[10px] border border-danger/20">
                        非生效版本
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
