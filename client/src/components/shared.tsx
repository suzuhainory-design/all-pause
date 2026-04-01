/*
 * 共享组件库
 * Design: Soft Industrial - 圆角卡片 + 细边框 + 微妙内阴影
 */
import { cn } from "@/lib/utils";
import {
  type Stage,
  type Risk,
  stageLabel,
  stageOrder,
  riskLabel,
  getStageIndex,
} from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, AlertTriangle, CheckCircle2, XCircle, Info } from "lucide-react";
import { Link } from "wouter";

// ==================== 阶段进度条 ====================

export function StagePipeline({
  currentStage,
  compact = false,
}: {
  currentStage: Stage;
  compact?: boolean;
}) {
  const currentIdx = getStageIndex(currentStage);
  const displayStages = compact
    ? stageOrder.filter((_, i) => i % 2 === 0 || i === currentIdx)
    : stageOrder;

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1">
      {displayStages.map((stage, i) => {
        const stageIdx = getStageIndex(stage);
        const isCurrent = stage === currentStage;
        const isPast = stageIdx < currentIdx;
        const isFuture = stageIdx > currentIdx;

        return (
          <div key={stage} className="flex items-center gap-1">
            <div
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap",
                isCurrent && "bg-primary text-primary-foreground shadow-sm",
                isPast && "bg-teal/10 text-teal",
                isFuture && "bg-muted text-muted-foreground"
              )}
            >
              {isPast && <CheckCircle2 size={12} />}
              <span>{stageLabel[stage]}</span>
            </div>
            {i < displayStages.length - 1 && (
              <div
                className={cn(
                  "w-4 h-px",
                  isPast ? "bg-teal/40" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ==================== 风险标签 ====================

export function RiskBadge({ level }: { level: Risk }) {
  const variants: Record<Risk, string> = {
    low: "bg-success/10 text-success border-success/20",
    medium: "bg-warning/10 text-warning border-warning/20",
    high: "bg-danger/10 text-danger border-danger/20",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border",
        variants[level]
      )}
    >
      {level === "high" && <AlertTriangle size={11} />}
      {riskLabel[level]}
    </span>
  );
}

// ==================== 阶段标签 ====================

export function StageBadge({ stage }: { stage: Stage }) {
  const colorMap: Record<string, string> = {
    new: "bg-muted text-muted-foreground",
    dd_in_progress: "bg-info/10 text-info border-info/20",
    dd_done: "bg-teal/10 text-teal border-teal/20",
    diag_in_progress: "bg-info/10 text-info border-info/20",
    diag_done: "bg-teal/10 text-teal border-teal/20",
    proposal_in_progress: "bg-gold/10 text-gold-light border-gold/20",
    proposal_done: "bg-teal/10 text-teal border-teal/20",
    quote_in_progress: "bg-gold/10 text-gold-light border-gold/20",
    approval_in_progress: "bg-terracotta/10 text-terracotta border-terracotta/20",
    waiting_sign: "bg-success/10 text-success border-success/20",
    signed: "bg-primary text-primary-foreground",
    lost: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border",
        colorMap[stage] || "bg-muted text-muted-foreground"
      )}
    >
      {stageLabel[stage]}
    </span>
  );
}

// ==================== 统计卡片 ====================

export function StatCard({
  label,
  value,
  sub,
  icon,
  trend,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
}) {
  return (
    <Card className="shadow-sm border-border/60">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {label}
            </p>
            <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
            {sub && (
              <p className="text-xs text-muted-foreground mt-1">{sub}</p>
            )}
          </div>
          {icon && (
            <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ==================== 完整度指示器 ====================

export function CompletenessIndicator({
  value,
  threshold = 80,
  label = "完整度",
}: {
  value: number;
  threshold?: number;
  label?: string;
}) {
  const isPass = value >= threshold;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span
          className={cn(
            "font-semibold",
            isPass ? "text-success" : "text-terracotta"
          )}
        >
          {value}%
        </span>
      </div>
      <Progress
        value={value}
        className={cn("h-2", isPass ? "[&>div]:bg-success" : "[&>div]:bg-terracotta")}
      />
      <p className="text-xs text-muted-foreground">
        {isPass
          ? "已满足准入条件（≥ " + threshold + "%）"
          : `需达到 ${threshold}% 才可进入下一阶段（差 ${threshold - value}%）`}
      </p>
    </div>
  );
}

// ==================== 页面头部 ====================

export function PageHeader({
  title,
  subtitle,
  eyebrow,
  backTo,
  actions,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  backTo?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="border-b border-border/60 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            {backTo && (
              <Link
                href={backTo}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-1"
              >
                <ArrowLeft size={14} />
                返回
              </Link>
            )}
            {eyebrow && (
              <p className="text-[11px] font-semibold text-primary uppercase tracking-widest">
                {eyebrow}
              </p>
            )}
            <h1 className="text-xl font-bold text-foreground">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
      </div>
    </div>
  );
}

// ==================== 空状态 ====================

export function EmptyState({
  title,
  description,
  action,
  imageUrl,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  imageUrl?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {imageUrl && (
        <img
          src={imageUrl}
          alt=""
          className="w-48 h-36 object-contain mb-6 opacity-80"
        />
      )}
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mt-1 text-center max-w-md">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ==================== 提示条 ====================

export function StatusNote({
  type,
  children,
}: {
  type: "info" | "success" | "warning" | "danger";
  children: React.ReactNode;
}) {
  const styles = {
    info: "bg-info/5 border-info/20 text-info",
    success: "bg-success/5 border-success/20 text-success",
    warning: "bg-warning/5 border-warning/20 text-warning",
    danger: "bg-danger/5 border-danger/20 text-danger",
  };
  const icons = {
    info: <Info size={16} />,
    success: <CheckCircle2 size={16} />,
    warning: <AlertTriangle size={16} />,
    danger: <XCircle size={16} />,
  };
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 px-4 py-3 rounded-lg border text-sm",
        styles[type]
      )}
    >
      <span className="shrink-0 mt-0.5">{icons[type]}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}
