/*
 * 合同签约模块
 * Design: Soft Industrial
 * 🔌 API 需求：
 *   - 电子签章 API（e签宝/法大大，实现在线签署）
 *   - 合同模板管理 API（后端存储合同模板）
 *   - PDF 生成 API（后端生成正式合同 PDF）
 */
import { useState, useMemo } from "react";
import { useParams, useLocation, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { PageHeader, StageBadge, EmptyState } from "@/components/shared";
import {
  mockOpportunities,
  mockContracts,
  mockQuotations,
  contractStatusLabel,
  defaultClauses,
  checkQuotationGate,
  type Contract,
  type ContractClause,
  type ContractStatus,
} from "@/lib/data";
import { exportContractPdf } from "@/lib/exportPdf";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Search,
  ArrowRight,
  FileSignature,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  DollarSign,
  Calendar,
  Plus,
  Trash2,
  Download,
  Send,
  Save,
  Pen,
  Shield,
  XCircle,
} from "lucide-react";

const EMPTY_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663030768548/caknB78rP4AmfUA5GjZSaU/empty-state-illustration-Ft6XUiG9ZzmVNDhw7zHbCw.webp";

const statusColors: Record<ContractStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  reviewing: "bg-blue-50 text-blue-700",
  pending_sign: "bg-amber-50 text-amber-700",
  signed: "bg-emerald-50 text-emerald-700",
  terminated: "bg-red-50 text-red-700",
};

// ==================== 合同列表页 ====================

export function ContractListPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const items = useMemo(() => {
    return mockOpportunities.map((opp) => {
      const contract = mockContracts[opp.id];
      const quotGate = checkQuotationGate(opp.id);
      return { opp, contract, quotGate };
    }).filter((item) => {
      if (search) {
        const q = search.toLowerCase();
        if (!item.opp.customer.companyName.toLowerCase().includes(q) && !item.opp.name.toLowerCase().includes(q)) return false;
      }
      if (statusFilter !== "all") {
        if (!item.contract) return statusFilter === "none";
        if (item.contract.status !== statusFilter) return false;
      }
      return true;
    });
  }, [search, statusFilter]);

  const stats = useMemo(() => {
    const contracts = Object.values(mockContracts);
    return {
      total: mockOpportunities.length,
      draft: contracts.filter(c => c.status === "draft").length,
      pendingSign: contracts.filter(c => c.status === "pending_sign" || c.status === "reviewing").length,
      signed: contracts.filter(c => c.status === "signed").length,
      totalAmount: contracts.filter(c => c.status === "signed" || c.status === "pending_sign").reduce((sum, c) => sum + c.totalAmount, 0),
    };
  }, []);

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <PageHeader
        title="合同签约"
        subtitle="管理合同起草、审核、签署的完整流程"
      />

      {/* 统计 */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileSignature className="text-primary" size={20} />
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
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <Clock className="text-amber-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pendingSign}</p>
                <p className="text-xs text-muted-foreground">待签署</p>
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
                <p className="text-2xl font-bold">{stats.signed}</p>
                <p className="text-xs text-muted-foreground">已签署</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <DollarSign className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">¥{(stats.totalAmount / 10000).toFixed(1)}万</p>
                <p className="text-xs text-muted-foreground">签约总额</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 筛选 */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input placeholder="搜索客户名称..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="合同状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="none">未创建</SelectItem>
            <SelectItem value="draft">草稿</SelectItem>
            <SelectItem value="reviewing">审核中</SelectItem>
            <SelectItem value="pending_sign">待签署</SelectItem>
            <SelectItem value="signed">已签署</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 列表 */}
      <div className="space-y-3">
        {items.map(({ opp, contract, quotGate }) => (
          <Card key={opp.id} className="border-border/50 hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start gap-5">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                  contract?.status === "signed" ? "bg-emerald-50" :
                  contract ? "bg-amber-50" : "bg-muted"
                )}>
                  {contract?.status === "signed" ? <CheckCircle2 size={22} className="text-emerald-600" /> :
                   contract ? <FileSignature size={22} className="text-amber-600" /> :
                   <FileText size={22} className="text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{opp.customer.companyName}</h3>
                    {contract && (
                      <span className={cn("text-xs px-2 py-0.5 rounded-full", statusColors[contract.status])}>
                        {contractStatusLabel[contract.status]}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{opp.code} · {opp.name}</p>
                  {contract ? (
                    <div className="grid grid-cols-4 gap-3">
                      <div className="text-center p-2 rounded-lg bg-muted/50">
                        <p className="text-sm font-bold">¥{(contract.totalAmount / 10000).toFixed(1)}万</p>
                        <p className="text-[10px] text-muted-foreground">合同金额</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-muted/50">
                        <p className="text-sm font-bold">{contract.serviceCycleMonths}个月</p>
                        <p className="text-[10px] text-muted-foreground">服务周期</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-muted/50">
                        <p className="text-sm font-bold">{contract.paymentSchedule.length}期</p>
                        <p className="text-[10px] text-muted-foreground">付款节点</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-muted/50">
                        <p className="text-sm font-bold">{contract.clauses.length}条</p>
                        <p className="text-[10px] text-muted-foreground">合同条款</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm">
                      {!quotGate.canProceed ? (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-700">
                          <AlertTriangle size={12} />
                          前置条件未满足：{quotGate.reasons[0]}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">报价已通过审批，可创建合同</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Link href={`/opportunities/${opp.id}/contract`}>
                    <Button variant="outline" size="sm" className="gap-1.5" disabled={!quotGate.canProceed && !contract}>
                      {contract ? "查看合同" : "创建合同"}
                      <ArrowRight size={14} />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ==================== 合同编辑页 ====================

export function ContractEditPage() {
  const params = useParams<{ id: string }>();
  const oppId = parseInt(params.id || "0");
  const opp = mockOpportunities.find((o) => o.id === oppId);
  const existing = mockContracts[oppId];
  const quotation = mockQuotations[oppId];
  const [, navigate] = useLocation();

  const [contract, setContract] = useState<Partial<Contract>>(
    existing || {
      contractCode: `CON-${new Date().getFullYear()}-${String(oppId).padStart(3, "0")}`,
      contractName: `${opp?.customer.companyName || ""} 全案营销服务合同`,
      partyA: "Allpause 全案营销有限公司",
      partyB: opp?.customer.companyName || "",
      partyBContact: opp?.customer.contactName || "",
      serviceCycleMonths: quotation?.serviceCycleMonths || 6,
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      totalAmount: quotation?.finalPrice || 0,
      paymentSchedule: [
        { milestone: "合同签署", percentage: 30, amount: Math.round((quotation?.finalPrice || 0) * 0.3), dueDate: "" },
        { milestone: "中期验收", percentage: 40, amount: Math.round((quotation?.finalPrice || 0) * 0.4), dueDate: "" },
        { milestone: "项目结项", percentage: 30, amount: Math.round((quotation?.finalPrice || 0) * 0.3), dueDate: "" },
      ],
      clauses: [...defaultClauses],
      status: "draft" as ContractStatus,
    }
  );

  const [activeTab, setActiveTab] = useState("basic");
  const [newClauseTitle, setNewClauseTitle] = useState("");
  const [newClauseContent, setNewClauseContent] = useState("");

  const quotGate = checkQuotationGate(oppId);

  if (!opp) {
    return (
      <div className="p-6">
        <EmptyState title="商机不存在" description="请返回合同列表" imageUrl={EMPTY_IMG} />
      </div>
    );
  }

  if (!quotGate.canProceed && !existing) {
    return (
      <div className="p-6 max-w-[800px] mx-auto">
        <PageHeader title="合同签约" backTo="/contracts" />
        <Card className="mt-6 border-orange-200 bg-orange-50/50">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="mx-auto mb-3 text-orange-500" size={40} />
            <h3 className="font-semibold text-lg mb-2">前置条件未满足</h3>
            <p className="text-sm text-muted-foreground mb-4">需要报价审批通过后才能创建合同</p>
            <ul className="text-sm text-orange-700 space-y-1 mb-4">
              {quotGate.reasons.map((r, i) => <li key={i}>• {r}</li>)}
            </ul>
            <Link href={`/opportunities/${oppId}`}>
              <Button>返回商机详情</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const updateField = (field: string, value: any) => {
    setContract((prev) => ({ ...prev, [field]: value }));
  };

  const updatePayment = (index: number, field: string, value: any) => {
    setContract((prev) => ({
      ...prev,
      paymentSchedule: prev.paymentSchedule?.map((p, i) =>
        i === index ? { ...p, [field]: value } : p
      ),
    }));
  };

  const addPayment = () => {
    setContract((prev) => ({
      ...prev,
      paymentSchedule: [
        ...(prev.paymentSchedule || []),
        { milestone: "", percentage: 0, amount: 0, dueDate: "" },
      ],
    }));
  };

  const removePayment = (index: number) => {
    setContract((prev) => ({
      ...prev,
      paymentSchedule: prev.paymentSchedule?.filter((_, i) => i !== index),
    }));
  };

  const addClause = () => {
    if (!newClauseTitle.trim() || !newClauseContent.trim()) {
      toast.error("请填写条款标题和内容");
      return;
    }
    setContract((prev) => ({
      ...prev,
      clauses: [
        ...(prev.clauses || []),
        { id: `custom-${Date.now()}`, title: newClauseTitle, content: newClauseContent, isCustom: true },
      ],
    }));
    setNewClauseTitle("");
    setNewClauseContent("");
    toast.success("自定义条款已添加");
  };

  const removeClause = (id: string) => {
    setContract((prev) => ({
      ...prev,
      clauses: prev.clauses?.filter((c) => c.id !== id),
    }));
  };

  const handleSave = () => {
    toast.success("合同已保存为草稿");
  };

  const handleSubmitReview = () => {
    updateField("status", "reviewing");
    toast.success("合同已提交审核");
  };

  const handleSign = () => {
    updateField("status", "signed");
    updateField("signedByA", "张总");
    updateField("signedAtA", new Date().toISOString());
    toast.success("合同已签署完成！商机阶段推进至「已签约」", {
      description: "前期流程全部完成，可进入执行阶段",
    });
  };

  const handleExportContract = () => {
    exportContractPdf({
      contract: contract as Contract,
      customerName: opp.customer.contactName,
      opportunityName: opp.name,
      opportunityCode: opp.code,
    });
    toast.success("合同已生成，请在新窗口中保存为 PDF");
  };

  const isSigned = contract.status === "signed";
  const isReviewing = contract.status === "reviewing";
  const isPendingSign = contract.status === "pending_sign";

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <PageHeader
        title={contract.contractName || "新建合同"}
        subtitle={`${opp.customer.companyName} · ${contract.contractCode}`}
        backTo="/contracts"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportContract} className="gap-1.5">
              <Download size={14} />
              导出合同
            </Button>
            {!isSigned && !isReviewing && (
              <>
                <Button variant="outline" size="sm" onClick={handleSave} className="gap-1.5">
                  <Save size={14} />
                  保存草稿
                </Button>
                <Button variant="outline" size="sm" onClick={handleSubmitReview} className="gap-1.5">
                  <Send size={14} />
                  提交审核
                </Button>
              </>
            )}
            {isPendingSign && (
              <Button size="sm" onClick={handleSign} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700">
                <Pen size={14} />
                确认签署
              </Button>
            )}
          </div>
        }
      />

      {/* 状态提示 */}
      {isSigned && (
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle2 className="text-emerald-600" size={20} />
            <div>
              <p className="font-semibold text-emerald-800">合同已签署</p>
              <p className="text-sm text-emerald-600">
                甲方签署人：{contract.signedByA} · 签署时间：{contract.signedAtA?.split("T")[0]}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic" className="gap-1.5">
            <FileText size={14} />
            基本信息
          </TabsTrigger>
          <TabsTrigger value="clauses" className="gap-1.5">
            <Shield size={14} />
            合同条款
          </TabsTrigger>
          <TabsTrigger value="payment" className="gap-1.5">
            <DollarSign size={14} />
            付款计划
          </TabsTrigger>
        </TabsList>

        {/* 基本信息 */}
        <TabsContent value="basic" className="mt-4">
          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>合同编号</Label>
                  <Input value={contract.contractCode} disabled className="mt-1 bg-muted/50" />
                </div>
                <div>
                  <Label>合同名称</Label>
                  <Input value={contract.contractName} onChange={(e) => updateField("contractName", e.target.value)} className="mt-1" disabled={isSigned} />
                </div>
                <div>
                  <Label>甲方（我方）</Label>
                  <Input value={contract.partyA} onChange={(e) => updateField("partyA", e.target.value)} className="mt-1" disabled={isSigned} />
                </div>
                <div>
                  <Label>乙方（客户）</Label>
                  <Input value={contract.partyB} onChange={(e) => updateField("partyB", e.target.value)} className="mt-1" disabled={isSigned} />
                </div>
                <div>
                  <Label>乙方联系人</Label>
                  <Input value={contract.partyBContact} onChange={(e) => updateField("partyBContact", e.target.value)} className="mt-1" disabled={isSigned} />
                </div>
                <div>
                  <Label>服务周期（月）</Label>
                  <Input type="number" value={contract.serviceCycleMonths} onChange={(e) => updateField("serviceCycleMonths", parseInt(e.target.value) || 0)} className="mt-1" disabled={isSigned} />
                </div>
                <div>
                  <Label>开始日期</Label>
                  <Input type="date" value={contract.startDate} onChange={(e) => updateField("startDate", e.target.value)} className="mt-1" disabled={isSigned} />
                </div>
                <div>
                  <Label>结束日期</Label>
                  <Input type="date" value={contract.endDate} onChange={(e) => updateField("endDate", e.target.value)} className="mt-1" disabled={isSigned} />
                </div>
              </div>
              <Separator />
              <div>
                <Label>合同总金额（元）</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input type="number" value={contract.totalAmount} onChange={(e) => updateField("totalAmount", parseInt(e.target.value) || 0)} disabled={isSigned} />
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    ¥{((contract.totalAmount || 0) / 10000).toFixed(2)} 万
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 合同条款 */}
        <TabsContent value="clauses" className="mt-4 space-y-4">
          {contract.clauses?.map((clause, index) => (
            <Card key={clause.id} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">第{index + 1}条</span>
                    <h4 className="font-semibold text-sm">{clause.title}</h4>
                    {clause.isCustom && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">自定义</span>
                    )}
                  </div>
                  {clause.isCustom && !isSigned && (
                    <Button variant="ghost" size="sm" onClick={() => removeClause(clause.id)}>
                      <Trash2 size={14} className="text-destructive" />
                    </Button>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{clause.content}</p>
              </CardContent>
            </Card>
          ))}

          {!isSigned && (
            <Card className="border-dashed border-2 border-border/50">
              <CardContent className="p-4 space-y-3">
                <h4 className="font-semibold text-sm">添加自定义条款</h4>
                <Input
                  placeholder="条款标题"
                  value={newClauseTitle}
                  onChange={(e) => setNewClauseTitle(e.target.value)}
                />
                <Textarea
                  placeholder="条款内容..."
                  value={newClauseContent}
                  onChange={(e) => setNewClauseContent(e.target.value)}
                  rows={3}
                />
                <Button variant="outline" size="sm" onClick={addClause} className="gap-1.5">
                  <Plus size={14} />
                  添加条款
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* 付款计划 */}
        <TabsContent value="payment" className="mt-4">
          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">付款节点</h3>
                {!isSigned && (
                  <Button variant="outline" size="sm" onClick={addPayment} className="gap-1.5">
                    <Plus size={14} />
                    添加节点
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                {contract.paymentSchedule?.map((p, i) => (
                  <div key={i} className="grid grid-cols-5 gap-3 items-end p-3 rounded-lg bg-muted/30">
                    <div>
                      <Label className="text-xs text-muted-foreground">里程碑</Label>
                      <Input value={p.milestone} onChange={(e) => updatePayment(i, "milestone", e.target.value)} className="mt-1" disabled={isSigned} />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">比例 (%)</Label>
                      <Input type="number" value={p.percentage} onChange={(e) => updatePayment(i, "percentage", parseInt(e.target.value) || 0)} className="mt-1" disabled={isSigned} />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">金额 (元)</Label>
                      <Input type="number" value={p.amount} onChange={(e) => updatePayment(i, "amount", parseInt(e.target.value) || 0)} className="mt-1" disabled={isSigned} />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">到期日</Label>
                      <Input type="date" value={p.dueDate} onChange={(e) => updatePayment(i, "dueDate", e.target.value)} className="mt-1" disabled={isSigned} />
                    </div>
                    <div className="flex justify-end">
                      {!isSigned && contract.paymentSchedule && contract.paymentSchedule.length > 1 && (
                        <Button variant="ghost" size="sm" onClick={() => removePayment(i)}>
                          <Trash2 size={14} className="text-destructive" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* 付款汇总 */}
              <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-muted/30">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {contract.paymentSchedule?.reduce((s, p) => s + p.percentage, 0)}%
                  </p>
                  <p className="text-xs text-muted-foreground">比例合计</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    ¥{((contract.paymentSchedule?.reduce((s, p) => s + p.amount, 0) || 0) / 10000).toFixed(1)}万
                  </p>
                  <p className="text-xs text-muted-foreground">金额合计</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{contract.paymentSchedule?.length || 0}</p>
                  <p className="text-xs text-muted-foreground">付款节点数</p>
                </div>
              </div>

              {contract.paymentSchedule && contract.paymentSchedule.reduce((s, p) => s + p.percentage, 0) !== 100 && (
                <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
                  <AlertTriangle size={16} />
                  付款比例合计不等于 100%，请检查
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
