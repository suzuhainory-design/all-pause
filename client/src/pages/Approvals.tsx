/*
 * 审批中心页面
 * Design: Soft Industrial - 审批列表 + 审批详情 + 操作面板
 */
import { useState, useMemo } from "react";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { PageHeader, StatusNote } from "@/components/shared";
import { mockApprovals, mockOpportunities, type ApprovalRecord } from "@/lib/data";
import { toast } from "sonner";
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  MessageSquare,
  ChevronRight,
  User,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "待审批", color: "bg-terracotta/10 text-terracotta border-terracotta/20", icon: Clock },
  approved: { label: "已通过", color: "bg-success/10 text-success border-success/20", icon: CheckCircle2 },
  rejected: { label: "已驳回", color: "bg-danger/10 text-danger border-danger/20", icon: XCircle },
  withdrawn: { label: "已撤回", color: "bg-muted text-muted-foreground border-border", icon: XCircle },
};

export default function ApprovalsPage() {
  const [activeTab, setActiveTab] = useState("pending");

  const pendingApprovals = mockApprovals.filter((a) => a.status === "pending");
  const completedApprovals = mockApprovals.filter((a) => a.status !== "pending");

  return (
    <div>
      <PageHeader
        eyebrow="Approval Center"
        title="审批中心"
        subtitle="管理报价审批流程，确保合规与风控"
      />
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="pending" className="text-xs">
              <Clock size={13} className="mr-1" />
              待审批
              {pendingApprovals.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-terracotta/20 text-terracotta text-[10px] font-bold">
                  {pendingApprovals.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs">
              <CheckCircle2 size={13} className="mr-1" />
              已处理 ({completedApprovals.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {pendingApprovals.length === 0 ? (
              <Card className="shadow-sm">
                <CardContent className="py-12 text-center">
                  <CheckCircle2 size={40} className="mx-auto text-success/40 mb-3" />
                  <p className="text-muted-foreground">暂无待审批事项</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {pendingApprovals.map((approval) => (
                  <ApprovalCard key={approval.id} approval={approval} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {completedApprovals.length === 0 ? (
              <Card className="shadow-sm">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">暂无已处理的审批记录</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {completedApprovals.map((approval) => (
                  <ApprovalCard key={approval.id} approval={approval} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ApprovalCard({ approval }: { approval: ApprovalRecord }) {
  const [expanded, setExpanded] = useState(false);
  const [comment, setComment] = useState("");
  const opp = mockOpportunities.find((o) => o.id === approval.opportunityId);
  const st = statusConfig[approval.status] || statusConfig.pending;
  const Icon = st.icon;

  const handleApprove = () => {
    toast.success("审批已通过", { description: `${approval.quotationCode} 报价已批准` });
  };

  const handleReject = () => {
    if (!comment.trim()) {
      toast.error("请填写驳回原因");
      return;
    }
    toast.success("审批已驳回", { description: `已驳回 ${approval.quotationCode}` });
  };

  return (
    <Card className={cn("shadow-sm transition-all", expanded && "ring-1 ring-primary/20")}>
      <CardContent className="p-0">
        {/* 头部 */}
        <div
          className="flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/20 transition-colors"
          onClick={() => setExpanded(!expanded)}
        >
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", st.color)}>
            <Icon size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold truncate">{opp?.name || "未知商机"}</p>
              <span className={cn("px-2 py-0.5 rounded-md text-[10px] border shrink-0", st.color)}>
                {st.label}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {approval.quotationCode} · {opp?.customer.companyName} · {approval.approvalType}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-bold font-mono text-primary">
              ¥{approval.finalPrice.toLocaleString()}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              折扣 {approval.discountRate}% · 毛利 {approval.grossMarginRate}%
            </p>
          </div>
          <ChevronRight size={16} className={cn("text-muted-foreground transition-transform shrink-0", expanded && "rotate-90")} />
        </div>

        {/* 展开详情 */}
        {expanded && (
          <div className="border-t border-border/60">
            <div className="p-4 space-y-4">
              {/* 触发规则 */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  触发的审批规则
                </p>
                <div className="space-y-1.5">
                  {approval.triggerReasons.map((reason, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <AlertTriangle size={12} className="text-terracotta shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 报价摘要 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-2.5 rounded-lg bg-muted/50 text-center">
                  <p className="text-xs text-muted-foreground">原价</p>
                  <p className="text-sm font-bold font-mono mt-0.5">¥{approval.originalPrice.toLocaleString()}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/50 text-center">
                  <p className="text-xs text-muted-foreground">折扣率</p>
                  <p className={cn("text-sm font-bold font-mono mt-0.5", approval.discountRate < 80 && "text-danger")}>
                    {approval.discountRate}%
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-primary/5 text-center border border-primary/10">
                  <p className="text-xs text-muted-foreground">最终报价</p>
                  <p className="text-sm font-bold font-mono text-primary mt-0.5">¥{approval.finalPrice.toLocaleString()}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/50 text-center">
                  <p className="text-xs text-muted-foreground">毛利率</p>
                  <p className={cn("text-sm font-bold font-mono mt-0.5", approval.grossMarginRate < 30 ? "text-danger" : "text-success")}>
                    {approval.grossMarginRate}%
                  </p>
                </div>
              </div>

              {/* 审批链 */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  审批链
                </p>
                <div className="space-y-2">
                  {approval.approvalChain.map((node, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                        node.status === "approved" ? "bg-success/10 text-success" :
                        node.status === "rejected" ? "bg-danger/10 text-danger" :
                        node.status === "pending" ? "bg-terracotta/10 text-terracotta" :
                        "bg-muted text-muted-foreground"
                      )}>
                        {node.status === "approved" ? <CheckCircle2 size={14} /> :
                         node.status === "rejected" ? <XCircle size={14} /> :
                         <Clock size={14} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{node.approverName}</span>
                          <span className="text-[10px] text-muted-foreground">{node.role}</span>
                        </div>
                        {node.comment && (
                          <p className="text-xs text-muted-foreground mt-0.5">{node.comment}</p>
                        )}
                      </div>
                      {node.timestamp && (
                        <span className="text-[10px] text-muted-foreground shrink-0">{node.timestamp}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 审批操作 */}
              {approval.status === "pending" && (
                <div className="space-y-3 pt-2 border-t border-border/60">
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-muted-foreground">审批意见</p>
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="请输入审批意见（驳回时必填）..."
                      rows={2}
                      className="text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-success hover:bg-success/90" onClick={handleApprove}>
                      <CheckCircle2 size={14} className="mr-1.5" /> 通过
                    </Button>
                    <Button size="sm" variant="destructive" onClick={handleReject}>
                      <XCircle size={14} className="mr-1.5" /> 驳回
                    </Button>
                  </div>
                </div>
              )}

              {/* 已处理的审批结果 */}
              {approval.status !== "pending" && approval.finalComment && (
                <div className="p-3 rounded-lg bg-muted/30 border border-border/60">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare size={12} className="text-muted-foreground" />
                    <span className="text-xs font-semibold text-muted-foreground">审批意见</span>
                  </div>
                  <p className="text-sm">{approval.finalComment}</p>
                </div>
              )}

              {/* 快捷链接 */}
              <div className="flex gap-2 pt-2">
                <Link href={`/opportunities/${approval.opportunityId}`}>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    <FileText size={12} className="mr-1" /> 查看商机
                  </Button>
                </Link>
                <Link href={`/opportunities/${approval.opportunityId}/quotation`}>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    <FileText size={12} className="mr-1" /> 查看报价
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
