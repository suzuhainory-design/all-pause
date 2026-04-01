/*
 * Allpause 全案营销系统 - PDF 导出工具集
 * 使用浏览器原生 print-to-PDF 方式，通过新窗口渲染 HTML 并调用 window.print()
 * 优点：完美支持中文、oklch 颜色、复杂布局，无第三方依赖兼容性问题
 */
import type {
  BusinessIntelligence,
  Risk,
  DiagnosisScore,
  Competitor,
  ProposalModule,
  Contract,
} from "@/lib/data";
import { calculateBusinessRiskLevel } from "@/lib/data";

// ==================== 通用样式与工具 ====================

const RISK_LABEL: Record<Risk, string> = {
  low: "低风险",
  medium: "中风险",
  high: "高风险",
};

const BRAND_COLOR = "#0f766e";
const BRAND_LIGHT = "#f0fdf4";

/** 通用页面外壳 */
function wrapPage(title: string, bodyContent: string): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    @page { size: A4; margin: 18mm 15mm; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif;
      color: #1a1a1a; line-height: 1.6; font-size: 13px;
      -webkit-print-color-adjust: exact; print-color-adjust: exact;
    }
    .page { max-width: 700px; margin: 0 auto; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    td, th { border-bottom: 1px solid #e5e7eb; }
    h2 { font-size: 15px; font-weight: 600; color: ${BRAND_COLOR}; border-left: 3px solid ${BRAND_COLOR}; padding-left: 10px; margin: 0 0 14px 0; }
    h3 { font-size: 13px; font-weight: 600; color: #374151; margin: 16px 0 8px 0; }
    .section { margin-bottom: 28px; break-inside: avoid; }
    .info-row { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 6px; }
    .info-item { font-size: 12px; }
    .info-label { color: #6b7280; }
    .info-value { font-weight: 500; }
    .summary-box { background: ${BRAND_LIGHT}; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px 18px; margin: 12px 0; }
    .tag { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 500; margin-right: 6px; margin-bottom: 4px; }
    .tag-green { background: #ecfdf5; color: #059669; }
    .tag-amber { background: #fffbeb; color: #d97706; }
    .tag-red { background: #fef2f2; color: #dc2626; }
    .tag-gray { background: #f3f4f6; color: #374151; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="no-print" style="background: ${BRAND_LIGHT}; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: center;">
      <p style="font-size: 14px; color: #166534; font-weight: 500; margin-bottom: 8px;">请使用浏览器的打印功能保存为 PDF</p>
      <p style="font-size: 12px; color: #6b7280;">快捷键：Ctrl+P (Windows) / Cmd+P (Mac)，目标选择"另存为 PDF"</p>
      <button onclick="window.print()" style="margin-top: 12px; padding: 8px 24px; background: ${BRAND_COLOR}; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px;">打印 / 保存为 PDF</button>
    </div>
    ${bodyContent}
  </div>
</body>
</html>`;
}

/** 报告头部 */
function reportHeader(eyebrow: string, title: string, subtitle: string, meta: string): string {
  return `<div style="border-bottom: 3px solid ${BRAND_COLOR}; padding-bottom: 16px; margin-bottom: 24px;">
  <div style="font-size: 10px; color: #6b7280; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 4px;">Allpause Marketing Platform</div>
  <div style="font-size: 11px; color: ${BRAND_COLOR}; font-weight: 500; margin-bottom: 2px;">${eyebrow}</div>
  <h1 style="font-size: 22px; font-weight: 700; color: ${BRAND_COLOR}; margin: 0 0 6px 0;">${title}</h1>
  <div style="font-size: 13px; color: #374151;">${subtitle}</div>
  <div style="font-size: 11px; color: #9ca3af; margin-top: 4px;">${meta}</div>
</div>`;
}

/** 报告页脚 */
function reportFooter(extra?: string): string {
  return `<div style="border-top: 2px solid #e5e7eb; padding-top: 14px; margin-top: 32px; display: flex; justify-content: space-between; align-items: center;">
  <div style="font-size: 10px; color: #9ca3af;">
    ${extra || ""}本报告由 Allpause 全案营销系统自动生成，仅供内部参考
  </div>
  <div style="font-size: 10px; color: #9ca3af; text-align: right;">
    Allpause Marketing Platform<br/>Confidential
  </div>
</div>`;
}

/** 打开新窗口并渲染 */
function openPrintWindow(html: string): void {
  const w = window.open("", "_blank");
  if (!w) {
    throw new Error("无法打开新窗口，请检查浏览器是否阻止了弹出窗口");
  }
  w.document.write(html);
  w.document.close();
  w.onload = () => { setTimeout(() => { w.print(); }, 300); };
}

// ==================== 1. 工商信息报告 ====================

export async function exportBusinessIntelligencePdf(
  bizData: BusinessIntelligence,
  opportunityName?: string,
): Promise<void> {
  const riskAnalysis = calculateBusinessRiskLevel(bizData.risks);
  const activeRisks = bizData.risks.filter(
    (r) => r.status === "存续" || r.status === "进行中",
  );

  const riskColorMap: Record<Risk, string> = { low: "#059669", medium: "#d97706", high: "#dc2626" };
  const riskBgMap: Record<Risk, string> = { low: "#ecfdf5", medium: "#fffbeb", high: "#fef2f2" };
  const riskColor = riskColorMap[riskAnalysis.level];
  const riskBg = riskBgMap[riskAnalysis.level];

  const shareholdersRows = bizData.shareholders
    .map((sh, i) => `
    <tr style="${i % 2 === 1 ? "background: #f9fafb;" : ""}">
      <td style="padding: 8px 12px; font-weight: 500;">${sh.name}</td>
      <td style="padding: 8px 12px; color: #6b7280;">${sh.type}</td>
      <td style="padding: 8px 12px; text-align: right;">${sh.investmentAmount}</td>
      <td style="padding: 8px 12px; text-align: right; font-weight: 600; color: #0f766e;">${sh.investmentRatio}%</td>
      <td style="padding: 8px 12px; color: #6b7280;">${sh.subscriptionDate}</td>
    </tr>`).join("");

  const associatedRows = bizData.associatedCompanies
    .map((ac, i) => `
    <tr style="${i % 2 === 1 ? "background: #f9fafb;" : ""}">
      <td style="padding: 8px 12px; font-weight: 500;">${ac.name}</td>
      <td style="padding: 8px 12px;"><span class="tag tag-gray">${ac.relationship}</span></td>
      <td style="padding: 8px 12px; color: #6b7280;">${ac.legalRepresentative}</td>
      <td style="padding: 8px 12px; text-align: right;">${ac.registeredCapital}</td>
      <td style="padding: 8px 12px;"><span style="color: ${ac.operatingStatus === "存续" ? "#059669" : "#dc2626"};">${ac.operatingStatus}</span></td>
    </tr>`).join("");

  const riskCards = bizData.risks.length === 0
    ? '<div style="padding: 20px; text-align: center; color: #9ca3af; font-size: 12px; background: #f9fafb; border-radius: 8px;">暂无风险记录，企业信用状况良好</div>'
    : bizData.risks.map((risk) => `
    <div style="border: 1px solid ${risk.severity === "danger" ? "#fecaca" : risk.severity === "warning" ? "#fde68a" : "#e5e7eb"}; border-radius: 8px; padding: 12px 16px; margin-bottom: 10px; background: ${risk.severity === "danger" ? "#fef2f2" : risk.severity === "warning" ? "#fffbeb" : "#f9fafb"}; break-inside: avoid;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <span style="font-size: 13px; font-weight: 600; color: #1a1a1a;">${risk.title}</span>
        <span style="font-size: 11px; padding: 2px 8px; border-radius: 10px; background: ${risk.status === "存续" || risk.status === "进行中" ? "#fecaca" : "#d1fae5"}; color: ${risk.status === "存续" || risk.status === "进行中" ? "#dc2626" : "#059669"};">${risk.status}</span>
      </div>
      <div style="font-size: 11px; color: #6b7280; margin-bottom: 4px;">${risk.category} · ${risk.date} · 来源：${risk.source}</div>
      <div style="font-size: 12px; color: #374151; line-height: 1.5;">${risk.detail}</div>
    </div>`).join("");

  const body = `
    ${reportHeader("工商尽调报告", `工商信息尽调报告`, opportunityName ? `商机：${opportunityName}` : bizData.registration.companyName, `报告生成时间：${new Date().toLocaleString("zh-CN")} | 数据更新于：${bizData.queryTime}`)}
    <div style="background: ${riskBg}; border: 1px solid ${riskColor}30; border-radius: 8px; padding: 14px 18px; margin-bottom: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div><span style="font-size: 14px; font-weight: 600; color: ${riskColor};">企业信用评分：${riskAnalysis.score}</span>
        <span class="tag" style="background: ${riskColor}18; color: ${riskColor};">${RISK_LABEL[riskAnalysis.level]}</span></div>
        <div style="font-size: 11px; color: #6b7280;">风险项 ${bizData.risks.length} | 存续 ${activeRisks.length}</div>
      </div>
    </div>
    <div class="section"><h2>工商登记信息</h2>
      <table>
        ${[
          ["企业名称", bizData.registration.companyName],
          ["法定代表人", bizData.registration.legalRepresentative],
          ["统一社会信用代码", `<span style="font-family:monospace">${bizData.registration.unifiedSocialCreditCode}</span>`],
          ["注册资本", bizData.registration.registeredCapital],
          ["实缴资本", bizData.registration.paidInCapital],
          ["成立日期", bizData.registration.establishDate],
          ["经营状态", `<span style="color:#059669;font-weight:500">${bizData.registration.operatingStatus}</span>`],
          ["企业类型", bizData.registration.companyType],
          ["行业分类", bizData.registration.industryCategory],
          ["注册地址", bizData.registration.registeredAddress],
          ["登记机关", bizData.registration.registrationAuthority],
          ["营业期限", bizData.registration.operatingPeriod],
          ["经营范围", bizData.registration.businessScope],
        ].map(([label, value], i) => `<tr style="${i % 2 === 0 ? "background:#f9fafb;" : ""}"><td style="padding:8px 12px;color:#6b7280;width:130px">${label}</td><td style="padding:8px 12px;font-weight:500">${value}</td></tr>`).join("")}
      </table>
    </div>
    <div class="section"><h2>股东信息（${bizData.shareholders.length}人）</h2>
      <table><thead><tr style="background:#f3f4f6">
        <th style="padding:8px 12px;text-align:left;font-weight:600;color:#374151">股东名称</th>
        <th style="padding:8px 12px;text-align:left;font-weight:600;color:#374151">类型</th>
        <th style="padding:8px 12px;text-align:right;font-weight:600;color:#374151">认缴金额</th>
        <th style="padding:8px 12px;text-align:right;font-weight:600;color:#374151">持股比例</th>
        <th style="padding:8px 12px;text-align:left;font-weight:600;color:#374151">入股日期</th>
      </tr></thead><tbody>${shareholdersRows}</tbody></table>
    </div>
    <div class="section"><h2>关联企业（${bizData.associatedCompanies.length}家）</h2>
      <table><thead><tr style="background:#f3f4f6">
        <th style="padding:8px 12px;text-align:left;font-weight:600;color:#374151">企业名称</th>
        <th style="padding:8px 12px;text-align:left;font-weight:600;color:#374151">关系</th>
        <th style="padding:8px 12px;text-align:left;font-weight:600;color:#374151">法人</th>
        <th style="padding:8px 12px;text-align:right;font-weight:600;color:#374151">注册资本</th>
        <th style="padding:8px 12px;text-align:left;font-weight:600;color:#374151">状态</th>
      </tr></thead><tbody>${associatedRows}</tbody></table>
    </div>
    <div class="section"><h2>风险识别记录（${bizData.risks.length}项）</h2>${riskCards}</div>
    ${reportFooter(`数据来源：${bizData.dataSource}<br/>`)}`;

  openPrintWindow(wrapPage(`工商信息报告 - ${bizData.registration.companyName}`, body));
}

// ==================== 2. 行业诊断报告 ====================

export interface DiagnosisExportData {
  opportunityName: string;
  opportunityCode: string;
  customerName: string;
  industryLevel1: string;
  industryLevel2: string;
  scores: DiagnosisScore[];
  competitors: Competitor[];
  opportunityScore: number;
  difficultyScore: number;
  riskLevel: Risk;
  recommendedModel: string;
  suggestedBudgetMin: number;
  suggestedBudgetMax: number;
  summary: string;
}

export function exportDiagnosisReportPdf(data: DiagnosisExportData): void {
  const riskColorMap: Record<Risk, string> = { low: "#059669", medium: "#d97706", high: "#dc2626" };
  const riskBgMap: Record<Risk, string> = { low: "#ecfdf5", medium: "#fffbeb", high: "#fef2f2" };

  // 评分表格
  const scoreRows = data.scores.map((s, i) => {
    const pct = (s.score / 5) * 100;
    return `<tr style="${i % 2 === 1 ? "background:#f9fafb;" : ""}">
      <td style="padding:8px 12px;font-weight:500;width:140px">${s.dimension}</td>
      <td style="padding:8px 12px;width:120px">
        <div style="display:flex;align-items:center;gap:8px">
          <div style="flex:1;height:8px;background:#e5e7eb;border-radius:4px;overflow:hidden">
            <div style="width:${pct}%;height:100%;background:${BRAND_COLOR};border-radius:4px"></div>
          </div>
          <span style="font-weight:600;color:${BRAND_COLOR};min-width:28px;text-align:right">${s.score}/5</span>
        </div>
      </td>
      <td style="padding:8px 12px;font-size:11px;color:#374151">${s.basis}</td>
      <td style="padding:8px 12px;font-size:11px;color:#6b7280">${s.dataSource}</td>
    </tr>`;
  }).join("");

  // 竞品表格
  const competitorRows = data.competitors.length > 0
    ? data.competitors.map((c, i) => `<tr style="${i % 2 === 1 ? "background:#f9fafb;" : ""}">
      <td style="padding:8px 12px;font-weight:500">${c.name}</td>
      <td style="padding:8px 12px"><span class="tag tag-gray">${c.platform}</span></td>
      <td style="padding:8px 12px;font-size:11px">${c.sellingPoint}</td>
      <td style="padding:8px 12px;font-size:11px">${c.approach}</td>
      <td style="padding:8px 12px;font-size:11px">${c.priceRange}</td>
      <td style="padding:8px 12px;font-size:11px;color:${BRAND_COLOR};font-weight:500">${c.differentiator}</td>
    </tr>`).join("")
    : "";

  const avgScore = data.scores.length > 0
    ? (data.scores.reduce((sum, s) => sum + s.score, 0) / data.scores.length).toFixed(1)
    : "0";

  const body = `
    ${reportHeader("行业诊断报告", data.opportunityName, `${data.customerName} · ${data.industryLevel1} - ${data.industryLevel2}`, `报告生成时间：${new Date().toLocaleString("zh-CN")} | 商机编号：${data.opportunityCode}`)}

    <!-- 综合概览 -->
    <div style="display:flex;gap:12px;margin-bottom:24px;flex-wrap:wrap">
      <div style="flex:1;min-width:140px;background:#f9fafb;border-radius:8px;padding:14px 18px;border:1px solid #e5e7eb">
        <div style="font-size:11px;color:#6b7280;margin-bottom:4px">综合均分</div>
        <div style="font-size:24px;font-weight:700;color:${BRAND_COLOR}">${avgScore}<span style="font-size:13px;color:#6b7280">/5</span></div>
      </div>
      <div style="flex:1;min-width:140px;background:#f9fafb;border-radius:8px;padding:14px 18px;border:1px solid #e5e7eb">
        <div style="font-size:11px;color:#6b7280;margin-bottom:4px">机会评分</div>
        <div style="font-size:24px;font-weight:700;color:${BRAND_COLOR}">${data.opportunityScore}</div>
      </div>
      <div style="flex:1;min-width:140px;background:#f9fafb;border-radius:8px;padding:14px 18px;border:1px solid #e5e7eb">
        <div style="font-size:11px;color:#6b7280;margin-bottom:4px">难度评分</div>
        <div style="font-size:24px;font-weight:700;color:#d97706">${data.difficultyScore}</div>
      </div>
      <div style="flex:1;min-width:140px;background:${riskBgMap[data.riskLevel]};border-radius:8px;padding:14px 18px;border:1px solid ${riskColorMap[data.riskLevel]}30">
        <div style="font-size:11px;color:#6b7280;margin-bottom:4px">风险等级</div>
        <div style="font-size:18px;font-weight:700;color:${riskColorMap[data.riskLevel]}">${RISK_LABEL[data.riskLevel]}</div>
      </div>
    </div>

    <!-- 八维评分 -->
    <div class="section">
      <h2>一、八维诊断评分</h2>
      <table>
        <thead><tr style="background:#f3f4f6">
          <th style="padding:8px 12px;text-align:left;font-weight:600;color:#374151">评分维度</th>
          <th style="padding:8px 12px;text-align:left;font-weight:600;color:#374151;width:160px">得分</th>
          <th style="padding:8px 12px;text-align:left;font-weight:600;color:#374151">评分依据</th>
          <th style="padding:8px 12px;text-align:left;font-weight:600;color:#374151">数据来源</th>
        </tr></thead>
        <tbody>${scoreRows}</tbody>
      </table>
    </div>

    <!-- 竞品分析 -->
    <div class="section">
      <h2>二、竞品分析（${data.competitors.length}家）</h2>
      ${data.competitors.length > 0 ? `<table>
        <thead><tr style="background:#f3f4f6">
          <th style="padding:8px 12px;text-align:left;font-weight:600;color:#374151">竞品名称</th>
          <th style="padding:8px 12px;text-align:left;font-weight:600;color:#374151">平台</th>
          <th style="padding:8px 12px;text-align:left;font-weight:600;color:#374151">核心卖点</th>
          <th style="padding:8px 12px;text-align:left;font-weight:600;color:#374151">打法</th>
          <th style="padding:8px 12px;text-align:left;font-weight:600;color:#374151">价格带</th>
          <th style="padding:8px 12px;text-align:left;font-weight:600;color:#374151">差异化</th>
        </tr></thead>
        <tbody>${competitorRows}</tbody>
      </table>` : '<div style="padding:20px;text-align:center;color:#9ca3af;font-size:12px;background:#f9fafb;border-radius:8px">暂无竞品数据</div>'}
    </div>

    <!-- 诊断结论 -->
    <div class="section">
      <h2>三、诊断结论与建议</h2>
      <div class="summary-box">
        <div style="display:flex;gap:24px;margin-bottom:12px;flex-wrap:wrap">
          <div><span class="info-label">推荐合作模式：</span><span style="font-weight:600;color:${BRAND_COLOR}">${data.recommendedModel}</span></div>
          <div><span class="info-label">建议预算范围：</span><span style="font-weight:600;color:${BRAND_COLOR}">${(data.suggestedBudgetMin / 10000).toFixed(0)} - ${(data.suggestedBudgetMax / 10000).toFixed(0)} 万元</span></div>
        </div>
        <div style="font-size:13px;color:#374151;line-height:1.8">${data.summary}</div>
      </div>
    </div>

    ${reportFooter("数据来源：行业公开数据 + 内部诊断模型<br/>")}`;

  openPrintWindow(wrapPage(`行业诊断报告 - ${data.opportunityName}`, body));
}

// ==================== 3. 全案方案导出 ====================

export interface ProposalExportData {
  opportunityName: string;
  opportunityCode: string;
  customerName: string;
  industryLevel1: string;
  industryLevel2: string;
  proposalName: string;
  proposalType: string;
  serviceCycleMonths: number;
  coreGoals: string[];
  majorPlatforms: string[];
  strategyPath: string;
  serviceBoundary: string;
  suggestedAdBudget: number;
  includesAgencyOperation: boolean;
  modules: ProposalModule[];
  feasibilityStatus: "pass" | "warning" | "fail";
  feasibilityNotes: string[];
  versionNote: string;
}

export function exportProposalPdf(data: ProposalExportData): void {
  const feasibilityColor = data.feasibilityStatus === "pass" ? "#059669" : data.feasibilityStatus === "warning" ? "#d97706" : "#dc2626";
  const feasibilityBg = data.feasibilityStatus === "pass" ? "#ecfdf5" : data.feasibilityStatus === "warning" ? "#fffbeb" : "#fef2f2";
  const feasibilityLabel = data.feasibilityStatus === "pass" ? "通过" : data.feasibilityStatus === "warning" ? "警告" : "未通过";

  // 方案模块内容
  const filledModules = data.modules.filter(m => m.content.trim().length > 0);
  const moduleContent = filledModules.map((m, i) => `
    <div style="margin-bottom:20px;break-inside:avoid">
      <h3 style="font-size:14px;font-weight:600;color:${BRAND_COLOR};margin:0 0 8px 0;padding-bottom:6px;border-bottom:1px solid #e5e7eb">
        ${i + 1}. ${m.title}
      </h3>
      <div style="font-size:12px;color:#374151;line-height:1.8;white-space:pre-wrap;padding-left:4px">${m.content}</div>
    </div>`).join("");

  const body = `
    ${reportHeader("全案营销方案", data.proposalName, `${data.customerName} · ${data.industryLevel1} - ${data.industryLevel2}`, `报告生成时间：${new Date().toLocaleString("zh-CN")} | 商机编号：${data.opportunityCode}`)}

    <!-- 方案概览 -->
    <div style="display:flex;gap:12px;margin-bottom:24px;flex-wrap:wrap">
      <div style="flex:1;min-width:130px;background:#f9fafb;border-radius:8px;padding:14px 18px;border:1px solid #e5e7eb">
        <div style="font-size:11px;color:#6b7280;margin-bottom:4px">方案类型</div>
        <div style="font-size:18px;font-weight:700;color:${BRAND_COLOR}">${data.proposalType}</div>
      </div>
      <div style="flex:1;min-width:130px;background:#f9fafb;border-radius:8px;padding:14px 18px;border:1px solid #e5e7eb">
        <div style="font-size:11px;color:#6b7280;margin-bottom:4px">服务周期</div>
        <div style="font-size:18px;font-weight:700;color:#374151">${data.serviceCycleMonths}<span style="font-size:12px;color:#6b7280"> 个月</span></div>
      </div>
      <div style="flex:1;min-width:130px;background:#f9fafb;border-radius:8px;padding:14px 18px;border:1px solid #e5e7eb">
        <div style="font-size:11px;color:#6b7280;margin-bottom:4px">建议投放预算</div>
        <div style="font-size:18px;font-weight:700;color:#374151">¥${(data.suggestedAdBudget / 10000).toFixed(1)}<span style="font-size:12px;color:#6b7280"> 万</span></div>
      </div>
      <div style="flex:1;min-width:130px;background:${feasibilityBg};border-radius:8px;padding:14px 18px;border:1px solid ${feasibilityColor}30">
        <div style="font-size:11px;color:#6b7280;margin-bottom:4px">可行性校验</div>
        <div style="font-size:18px;font-weight:700;color:${feasibilityColor}">${feasibilityLabel}</div>
      </div>
    </div>

    <!-- 基本信息 -->
    <div class="section">
      <h2>一、方案基本信息</h2>
      <table>
        <tr style="background:#f9fafb"><td style="padding:8px 12px;color:#6b7280;width:130px">方案名称</td><td style="padding:8px 12px;font-weight:500">${data.proposalName}</td></tr>
        <tr><td style="padding:8px 12px;color:#6b7280">方案类型</td><td style="padding:8px 12px">${data.proposalType}</td></tr>
        <tr style="background:#f9fafb"><td style="padding:8px 12px;color:#6b7280">服务周期</td><td style="padding:8px 12px">${data.serviceCycleMonths} 个月</td></tr>
        <tr><td style="padding:8px 12px;color:#6b7280">核心目标</td><td style="padding:8px 12px">${data.coreGoals.length > 0 ? data.coreGoals.map(g => `<span class="tag tag-green">${g}</span>`).join("") : '<span style="color:#9ca3af">未设置</span>'}</td></tr>
        <tr style="background:#f9fafb"><td style="padding:8px 12px;color:#6b7280">投放平台</td><td style="padding:8px 12px">${data.majorPlatforms.length > 0 ? data.majorPlatforms.map(p => `<span class="tag tag-gray">${p}</span>`).join("") : '<span style="color:#9ca3af">未选择</span>'}</td></tr>
        <tr><td style="padding:8px 12px;color:#6b7280">策略路径</td><td style="padding:8px 12px">${data.strategyPath || '<span style="color:#9ca3af">未填写</span>'}</td></tr>
        <tr style="background:#f9fafb"><td style="padding:8px 12px;color:#6b7280">服务边界</td><td style="padding:8px 12px">${data.serviceBoundary || '<span style="color:#9ca3af">未定义</span>'}</td></tr>
        <tr><td style="padding:8px 12px;color:#6b7280">建议投放预算</td><td style="padding:8px 12px;font-weight:600;color:${BRAND_COLOR}">¥${data.suggestedAdBudget.toLocaleString()}</td></tr>
        <tr style="background:#f9fafb"><td style="padding:8px 12px;color:#6b7280">含代运营</td><td style="padding:8px 12px">${data.includesAgencyOperation ? '<span class="tag tag-green">是</span>' : '<span class="tag tag-gray">否</span>'}</td></tr>
      </table>
    </div>

    <!-- 方案模块 -->
    <div class="section">
      <h2>二、方案详细内容（${filledModules.length}/${data.modules.length} 模块）</h2>
      ${filledModules.length > 0 ? moduleContent : '<div style="padding:20px;text-align:center;color:#9ca3af;font-size:12px;background:#f9fafb;border-radius:8px">方案模块内容尚未填写</div>'}
    </div>

    <!-- 可行性校验 -->
    ${data.feasibilityNotes.length > 0 ? `<div class="section">
      <h2>三、可行性校验结果</h2>
      <div style="background:${feasibilityBg};border:1px solid ${feasibilityColor}30;border-radius:8px;padding:14px 18px">
        <div style="font-weight:600;color:${feasibilityColor};margin-bottom:8px">校验状态：${feasibilityLabel}</div>
        <ul style="margin:0;padding-left:20px;font-size:12px;color:#374151">
          ${data.feasibilityNotes.map(n => `<li style="margin-bottom:4px">${n}</li>`).join("")}
        </ul>
      </div>
    </div>` : ""}

    ${data.versionNote ? `<div class="section">
      <h2>${data.feasibilityNotes.length > 0 ? "四" : "三"}、版本说明</h2>
      <div style="font-size:12px;color:#374151;line-height:1.8;padding:12px 16px;background:#f9fafb;border-radius:8px">${data.versionNote}</div>
    </div>` : ""}

    ${reportFooter("")}`;

  openPrintWindow(wrapPage(`全案方案 - ${data.proposalName}`, body));
}

// ==================== 4. 合同导出 ====================

export interface ContractExportData {
  contract: Contract;
  customerName: string;
  opportunityName: string;
  opportunityCode: string;
}

export function exportContractPdf(data: ContractExportData): void {
  const { contract, customerName, opportunityName, opportunityCode } = data;

  const statusLabel: Record<string, string> = {
    draft: "草稿", reviewing: "审核中", pending_sign: "待签署", signed: "已签署", terminated: "已终止",
  };

  // 合同条款
  const clauseContent = (contract.clauses || []).map((c, i) => `
    <div style="margin-bottom:16px;break-inside:avoid">
      <div style="font-size:13px;font-weight:600;color:#1a1a1a;margin-bottom:4px">第${i + 1}条 ${c.title}</div>
      <div style="font-size:12px;color:#374151;line-height:1.8;padding-left:8px">${c.content}</div>
    </div>`).join("");

  // 付款计划表
  const paymentRows = (contract.paymentSchedule || []).map((p, i) => `
    <tr style="${i % 2 === 1 ? "background:#f9fafb;" : ""}">
      <td style="padding:8px 12px;font-weight:500">${p.milestone}</td>
      <td style="padding:8px 12px;text-align:center">${p.percentage}%</td>
      <td style="padding:8px 12px;text-align:right;font-weight:600;color:${BRAND_COLOR}">¥${p.amount.toLocaleString()}</td>
      <td style="padding:8px 12px;text-align:center;color:#6b7280">${p.dueDate || "待定"}</td>
    </tr>`).join("");

  const body = `
    <!-- 合同标题区 -->
    <div style="text-align:center;margin-bottom:32px;padding-bottom:20px;border-bottom:3px double #374151">
      <div style="font-size:10px;color:#6b7280;letter-spacing:3px;margin-bottom:8px">ALLPAUSE MARKETING PLATFORM</div>
      <div style="font-size:11px;color:#6b7280;margin-bottom:6px">合同编号：${contract.contractCode}</div>
      <h1 style="font-size:24px;font-weight:700;color:#1a1a1a;margin:0;letter-spacing:2px">${contract.contractName}</h1>
      <div style="margin-top:8px"><span class="tag" style="background:${contract.status === "signed" ? "#ecfdf5" : "#f3f4f6"};color:${contract.status === "signed" ? "#059669" : "#374151"}">${statusLabel[contract.status] || contract.status}</span></div>
    </div>

    <!-- 甲乙方信息 -->
    <div class="section">
      <div style="display:flex;gap:24px;margin-bottom:16px">
        <div style="flex:1;background:#f9fafb;border-radius:8px;padding:16px;border:1px solid #e5e7eb">
          <div style="font-size:11px;color:#6b7280;margin-bottom:6px">甲方（服务方）</div>
          <div style="font-size:15px;font-weight:600;color:#1a1a1a">${contract.partyA}</div>
        </div>
        <div style="flex:1;background:#f9fafb;border-radius:8px;padding:16px;border:1px solid #e5e7eb">
          <div style="font-size:11px;color:#6b7280;margin-bottom:6px">乙方（客户方）</div>
          <div style="font-size:15px;font-weight:600;color:#1a1a1a">${contract.partyB}</div>
          <div style="font-size:11px;color:#6b7280;margin-top:4px">联系人：${contract.partyBContact || customerName}</div>
        </div>
      </div>
    </div>

    <!-- 合同概要 -->
    <div class="section">
      <h2>合同概要</h2>
      <table>
        <tr style="background:#f9fafb"><td style="padding:8px 12px;color:#6b7280;width:130px">关联商机</td><td style="padding:8px 12px;font-weight:500">${opportunityName}（${opportunityCode}）</td></tr>
        <tr><td style="padding:8px 12px;color:#6b7280">服务周期</td><td style="padding:8px 12px">${contract.serviceCycleMonths} 个月（${contract.startDate} 至 ${contract.endDate}）</td></tr>
        <tr style="background:#f9fafb"><td style="padding:8px 12px;color:#6b7280">合同总金额</td><td style="padding:8px 12px;font-weight:700;font-size:16px;color:${BRAND_COLOR}">¥${contract.totalAmount?.toLocaleString()}</td></tr>
        <tr><td style="padding:8px 12px;color:#6b7280">付款节点</td><td style="padding:8px 12px">${(contract.paymentSchedule || []).length} 期</td></tr>
        <tr style="background:#f9fafb"><td style="padding:8px 12px;color:#6b7280">合同条款</td><td style="padding:8px 12px">${(contract.clauses || []).length} 条</td></tr>
      </table>
    </div>

    <!-- 合同条款 -->
    <div class="section">
      <h2>合同条款</h2>
      ${clauseContent || '<div style="padding:20px;text-align:center;color:#9ca3af;font-size:12px;background:#f9fafb;border-radius:8px">暂无合同条款</div>'}
    </div>

    <!-- 付款计划 -->
    <div class="section">
      <h2>付款计划</h2>
      ${(contract.paymentSchedule || []).length > 0 ? `<table>
        <thead><tr style="background:#f3f4f6">
          <th style="padding:8px 12px;text-align:left;font-weight:600;color:#374151">付款节点</th>
          <th style="padding:8px 12px;text-align:center;font-weight:600;color:#374151">比例</th>
          <th style="padding:8px 12px;text-align:right;font-weight:600;color:#374151">金额</th>
          <th style="padding:8px 12px;text-align:center;font-weight:600;color:#374151">到期日</th>
        </tr></thead>
        <tbody>${paymentRows}</tbody>
        <tfoot><tr style="background:#f3f4f6;font-weight:700">
          <td style="padding:8px 12px" colspan="2">合计</td>
          <td style="padding:8px 12px;text-align:right;color:${BRAND_COLOR}">¥${contract.totalAmount?.toLocaleString()}</td>
          <td style="padding:8px 12px"></td>
        </tr></tfoot>
      </table>` : '<div style="padding:20px;text-align:center;color:#9ca3af;font-size:12px;background:#f9fafb;border-radius:8px">暂无付款计划</div>'}
    </div>

    <!-- 签署区域 -->
    <div style="margin-top:48px;page-break-inside:avoid">
      <div style="display:flex;gap:48px">
        <div style="flex:1">
          <div style="font-size:13px;font-weight:600;margin-bottom:24px">甲方（盖章）：</div>
          <div style="border-bottom:1px solid #374151;height:60px;margin-bottom:12px"></div>
          <div style="font-size:12px;color:#6b7280">授权代表签字：${contract.signedByA || "________________"}</div>
          <div style="font-size:12px;color:#6b7280;margin-top:8px">日期：${contract.signedAtA || "____年____月____日"}</div>
        </div>
        <div style="flex:1">
          <div style="font-size:13px;font-weight:600;margin-bottom:24px">乙方（盖章）：</div>
          <div style="border-bottom:1px solid #374151;height:60px;margin-bottom:12px"></div>
          <div style="font-size:12px;color:#6b7280">授权代表签字：${contract.signedByB || "________________"}</div>
          <div style="font-size:12px;color:#6b7280;margin-top:8px">日期：${contract.signedAtB || "____年____月____日"}</div>
        </div>
      </div>
    </div>

    ${reportFooter("")}`;

  openPrintWindow(wrapPage(`${contract.contractName}`, body));
}
