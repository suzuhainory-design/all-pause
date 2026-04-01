/*
 * Allpause 全案营销系统 - 数据层
 * Design: Soft Industrial（柔性工业风）
 * 包含所有类型定义、模拟数据和业务逻辑
 */

// ==================== 类型定义 ====================

export type Stage =
  | "new"
  | "dd_in_progress"
  | "dd_done"
  | "diag_in_progress"
  | "diag_done"
  | "proposal_in_progress"
  | "proposal_done"
  | "quote_in_progress"
  | "approval_in_progress"
  | "waiting_sign"
  | "signed"
  | "lost";

export type Risk = "low" | "medium" | "high";

export type UserRole =
  | "sales"
  | "strategy"
  | "proposal_manager"
  | "department_head"
  | "finance"
  | "legal"
  | "management"
  | "super_admin";

export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface Customer {
  id: number;
  companyName: string;
  industryLevel1: string;
  industryLevel2: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  remark?: string;
}

export interface Opportunity {
  id: number;
  code: string;
  name: string;
  customer: Customer;
  currentStage: Stage;
  riskLevel: Risk;
  ownerName: string;
  ownerRole: UserRole;
  estimatedBudget: number;
  estimatedSignProbability: number;
  blockers: string[];
  nextActions: string[];
  createdAt: string;
  updatedAt: string;
  lastFollowUp?: string;
}

export interface DueDiligenceData {
  // 客户基础信息
  companyFullName: string;
  registeredCapital: string;
  foundedYear: string;
  employeeCount: string;
  annualRevenue: string;
  // 联系人与决策链
  decisionMaker: string;
  decisionMakerTitle: string;
  budgetApprover: string;
  technicalContact: string;
  // 业务现状
  mainProducts: string;
  targetAudience: string;
  salesChannels: string;
  currentMarketShare: string;
  // 营销现状
  currentAdSpend: string;
  mainAdPlatforms: string[];
  hasAgencyPartner: boolean;
  currentAgencyName: string;
  contentTeamSize: string;
  // 合作诉求
  cooperationGoal: string;
  expectedBudgetRange: string;
  expectedStartDate: string;
  keyMetrics: string;
  // 风险项
  complianceRisk: "low" | "medium" | "high";
  budgetClarity: "clear" | "vague" | "unknown";
  decisionCycle: string;
  competitorThreat: string;
}

export interface DiagnosisScore {
  dimension: string;
  score: number;
  basis: string;
  dataSource: string;
  note: string;
}

export interface Competitor {
  id: number;
  name: string;
  platform: string;
  sellingPoint: string;
  approach: string;
  priceRange: string;
  referencePoint: string;
  differentiator: string;
}

export interface IndustryDiagnosis {
  id: number;
  opportunityId: number;
  templateName: string;
  version: number;
  scores: DiagnosisScore[];
  competitors: Competitor[];
  opportunityScore: number;
  difficultyScore: number;
  riskLevel: Risk;
  recommendedModel: string;
  suggestedBudgetMin: number;
  suggestedBudgetMax: number;
  summary: string;
  status: "draft" | "submitted";
  createdAt: string;
}

export interface ProposalModule {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface ProposalVersion {
  id: number;
  opportunityId: number;
  proposalName: string;
  proposalType: "基础版" | "增长版" | "全域版" | "定制版";
  version: number;
  isActive: boolean;
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
  createdAt: string;
  updatedAt: string;
}

export interface QuotationItem {
  label: string;
  amount: number;
}

export interface Quotation {
  id: number;
  opportunityId: number;
  proposalVersionId: number;
  quotationCode: string;
  packageType: string;
  serviceCycleMonths: number;
  items: QuotationItem[];
  originalPrice: number;
  discountRate: number;
  finalPrice: number;
  grossMarginRate: number;
  paymentTerm: string;
  accountPeriodDays: number;
  specialTerms: string;
  validUntil: string;
  status: "draft" | "pending_approval" | "approved" | "rejected" | "sent" | "expired";
  approvalTriggers: string[];
  createdAt: string;
}

export interface ApprovalChainNode {
  approverName: string;
  role: string;
  status: "approved" | "rejected" | "pending" | "skipped";
  comment?: string;
  timestamp?: string;
}

export interface ApprovalRecord {
  id: number;
  type: string;
  approvalType: string;
  sourceType: "quotation" | "proposal" | "due_diligence";
  sourceId: number;
  sourceName: string;
  opportunityId: number;
  opportunityName: string;
  quotationCode: string;
  applicant: string;
  currentNode: string;
  triggerReasons: string[];
  triggerRules: string[];
  originalPrice: number;
  discountRate: number;
  finalPrice: number;
  grossMarginRate: number;
  status: ApprovalStatus;
  approvalChain: ApprovalChainNode[];
  finalComment?: string;
  opinions: { approver: string; role: string; action: string; comment: string; time: string }[];
  createdAt: string;
}

// ==================== 工商信息与风险识别 ====================

export interface BusinessRegistration {
  companyName: string;
  legalRepresentative: string;
  registeredCapital: string;
  paidInCapital: string;
  establishDate: string;
  operatingStatus: string;
  unifiedSocialCreditCode: string;
  registrationAuthority: string;
  businessScope: string;
  companyType: string;
  registeredAddress: string;
  approvalDate: string;
  operatingPeriod: string;
  taxNumber: string;
  industryCategory: string;
}

export interface Shareholder {
  name: string;
  type: "自然人" | "企业法人" | "其他";
  investmentAmount: string;
  investmentRatio: number;
  subscriptionDate: string;
}

export interface AssociatedCompany {
  name: string;
  relationship: string;
  registeredCapital: string;
  operatingStatus: string;
  legalRepresentative: string;
  riskLevel: Risk;
}

export interface RiskItem {
  id: number;
  category: "经营异常" | "行政处罚" | "失信被执行" | "司法诉讼" | "股权质押" | "动产抵押" | "税务违规" | "环保处罚";
  severity: "info" | "warning" | "danger";
  title: string;
  detail: string;
  source: string;
  date: string;
  status: "存续" | "已消除" | "已结案" | "进行中";
}

export interface BusinessIntelligence {
  registration: BusinessRegistration;
  shareholders: Shareholder[];
  associatedCompanies: AssociatedCompany[];
  risks: RiskItem[];
  queryTime: string;
  dataSource: string;
}

export interface FollowUpRecord {
  id: number;
  opportunityId: number;
  type: string;
  content: string;
  objection: string;
  nextAction: string;
  createdBy: string;
  createdAt: string;
  nextFollowUpDate?: string;
}

// ==================== 标签映射 ====================

export const stageLabel: Record<Stage, string> = {
  new: "新建",
  dd_in_progress: "尽调中",
  dd_done: "尽调完成",
  diag_in_progress: "诊断中",
  diag_done: "诊断完成",
  proposal_in_progress: "方案中",
  proposal_done: "方案完成",
  quote_in_progress: "报价中",
  approval_in_progress: "审批中",
  waiting_sign: "待签约",
  signed: "已签约",
  lost: "已丢单",
};

export const stageOrder: Stage[] = [
  "new",
  "dd_in_progress",
  "dd_done",
  "diag_in_progress",
  "diag_done",
  "proposal_in_progress",
  "proposal_done",
  "quote_in_progress",
  "approval_in_progress",
  "waiting_sign",
  "signed",
];

export const riskLabel: Record<Risk, string> = {
  low: "低风险",
  medium: "中风险",
  high: "高风险",
};

export const roleLabel: Record<UserRole, string> = {
  sales: "销售顾问",
  strategy: "策略顾问",
  proposal_manager: "方案经理",
  department_head: "部门负责人",
  finance: "财务",
  legal: "法务",
  management: "管理层",
  super_admin: "超级管理员",
};

export const diagnosisDimensions = [
  "行业增长潜力",
  "竞争激烈程度",
  "内容营销成熟度",
  "投放效率空间",
  "品牌认知基础",
  "数据基础设施",
  "合规风险程度",
  "客户配合意愿",
];

export const proposalModuleTemplates: { id: string; title: string }[] = [
  { id: "situation", title: "客户现状" },
  { id: "insight", title: "行业洞察" },
  { id: "problem", title: "核心问题" },
  { id: "goal", title: "营销目标" },
  { id: "strategy", title: "核心策略" },
  { id: "channel", title: "渠道组合" },
  { id: "content", title: "内容策略" },
  { id: "media", title: "投放策略" },
  { id: "rhythm", title: "阶段节奏" },
  { id: "team", title: "团队配置" },
  { id: "kpi", title: "KPI 建议" },
  { id: "boundary", title: "服务边界" },
  { id: "risk", title: "风险提示" },
];

// ==================== 模拟数据 ====================

export const mockCustomers: Customer[] = [
  { id: 1, companyName: "BeautyX 美妆科技", industryLevel1: "美妆", industryLevel2: "护肤品", contactName: "王芳", contactPhone: "138-0001-0001", contactEmail: "wang.fang@beautyx.com", remark: "国内新锐护肤品牌，主打成分党路线" },
  { id: 2, companyName: "鲜味达生鲜", industryLevel1: "食品", industryLevel2: "生鲜电商", contactName: "李明", contactPhone: "139-0002-0002", contactEmail: "liming@xianweida.cn", remark: "区域性生鲜配送平台，计划扩展全国" },
  { id: 3, companyName: "云启教育科技", industryLevel1: "教育", industryLevel2: "在线教育", contactName: "陈雪", contactPhone: "137-0003-0003", contactEmail: "chenxue@yunqi.edu", remark: "K12 在线教育，面临合规转型" },
  { id: 4, companyName: "锐行汽车配件", industryLevel1: "汽车", industryLevel2: "零部件", contactName: "张强", contactPhone: "136-0004-0004", contactEmail: "zhangqiang@ruixing.com" },
  { id: 5, companyName: "绿源健康科技", industryLevel1: "医疗", industryLevel2: "保健品", contactName: "刘丽", contactPhone: "135-0005-0005", contactEmail: "liuli@lvyuan.health", remark: "保健品品牌，需注意广告法合规" },
];

export const mockOpportunities: Opportunity[] = [
  {
    id: 1, code: "OPP-2024-001", name: "BeautyX 2024 全案营销", customer: mockCustomers[0],
    currentStage: "proposal_in_progress", riskLevel: "low", ownerName: "张销售", ownerRole: "sales",
    estimatedBudget: 500000, estimatedSignProbability: 75,
    blockers: [], nextActions: ["完成方案可行性校验", "安排客户方案沟通会"],
    createdAt: "2024-03-01", updatedAt: "2024-03-28", lastFollowUp: "2024-03-28",
  },
  {
    id: 2, code: "OPP-2024-002", name: "鲜味达全域推广", customer: mockCustomers[1],
    currentStage: "diag_in_progress", riskLevel: "medium", ownerName: "李策略", ownerRole: "strategy",
    estimatedBudget: 300000, estimatedSignProbability: 50,
    blockers: ["客户预算尚未最终确认"], nextActions: ["完成行业诊断评分", "输出竞品分析"],
    createdAt: "2024-03-10", updatedAt: "2024-03-27", lastFollowUp: "2024-03-25",
  },
  {
    id: 3, code: "OPP-2024-003", name: "云启教育品牌升级", customer: mockCustomers[2],
    currentStage: "dd_in_progress", riskLevel: "high", ownerName: "张销售", ownerRole: "sales",
    estimatedBudget: 200000, estimatedSignProbability: 30,
    blockers: ["教育行业合规风险需法务预审", "尽调完整度不足"], nextActions: ["补充尽调信息至 80%", "提交法务预审"],
    createdAt: "2024-03-15", updatedAt: "2024-03-26", lastFollowUp: "2024-03-20",
  },
  {
    id: 4, code: "OPP-2024-004", name: "锐行汽配数字化营销", customer: mockCustomers[3],
    currentStage: "quote_in_progress", riskLevel: "low", ownerName: "王方案", ownerRole: "proposal_manager",
    estimatedBudget: 400000, estimatedSignProbability: 80,
    blockers: [], nextActions: ["完成报价单配置", "提交审批"],
    createdAt: "2024-02-20", updatedAt: "2024-03-29", lastFollowUp: "2024-03-29",
  },
  {
    id: 5, code: "OPP-2024-005", name: "绿源健康品牌全案", customer: mockCustomers[4],
    currentStage: "approval_in_progress", riskLevel: "high", ownerName: "李策略", ownerRole: "strategy",
    estimatedBudget: 600000, estimatedSignProbability: 60,
    blockers: ["报价审批中 - 毛利率低于 30%"], nextActions: ["等待财务审批", "准备合同要点"],
    createdAt: "2024-02-15", updatedAt: "2024-03-30", lastFollowUp: "2024-03-30",
  },
  {
    id: 6, code: "OPP-2024-006", name: "BeautyX 抖音专项", customer: mockCustomers[0],
    currentStage: "waiting_sign", riskLevel: "low", ownerName: "张销售", ownerRole: "sales",
    estimatedBudget: 150000, estimatedSignProbability: 90,
    blockers: [], nextActions: ["确认合同要点", "安排签约"],
    createdAt: "2024-01-10", updatedAt: "2024-03-25", lastFollowUp: "2024-03-25",
  },
  {
    id: 7, code: "OPP-2024-007", name: "鲜味达小红书种草", customer: mockCustomers[1],
    currentStage: "signed", riskLevel: "low", ownerName: "李策略", ownerRole: "strategy",
    estimatedBudget: 100000, estimatedSignProbability: 100,
    blockers: [], nextActions: [],
    createdAt: "2024-01-05", updatedAt: "2024-03-01", lastFollowUp: "2024-03-01",
  },
  {
    id: 8, code: "OPP-2024-008", name: "某餐饮品牌探店", customer: { id: 6, companyName: "味道工坊", industryLevel1: "餐饮", industryLevel2: "连锁餐饮", contactName: "赵磊", contactPhone: "134-0006-0006", contactEmail: "zhaolei@weidao.com" },
    currentStage: "lost", riskLevel: "medium", ownerName: "张销售", ownerRole: "sales",
    estimatedBudget: 80000, estimatedSignProbability: 0,
    blockers: ["客户预算不足"], nextActions: [],
    createdAt: "2024-02-01", updatedAt: "2024-03-15", lastFollowUp: "2024-03-10",
  },
];

export const mockDueDiligence: Record<number, { data: Partial<DueDiligenceData>; completeness: number; riskTags: string[] }> = {
  1: {
    data: {
      companyFullName: "BeautyX 美妆科技有限公司", registeredCapital: "5000万", foundedYear: "2019",
      employeeCount: "200-500", annualRevenue: "2亿", decisionMaker: "王芳", decisionMakerTitle: "CMO",
      budgetApprover: "CEO 张总", technicalContact: "技术总监 刘工",
      mainProducts: "护肤精华、面膜、洁面产品", targetAudience: "25-35岁女性，一二线城市",
      salesChannels: "天猫、抖音、小红书、线下专柜", currentMarketShare: "细分品类 Top 10",
      currentAdSpend: "200万/月", mainAdPlatforms: ["抖音", "小红书", "微信"],
      hasAgencyPartner: true, currentAgencyName: "某4A代理", contentTeamSize: "15人",
      cooperationGoal: "提升品牌声量，打造爆品", expectedBudgetRange: "40-60万/月",
      expectedStartDate: "2024-04", keyMetrics: "GMV增长30%，品牌搜索指数提升50%",
      complianceRisk: "low", budgetClarity: "clear", decisionCycle: "2周", competitorThreat: "花西子、珀莱雅",
    },
    completeness: 95,
    riskTags: [],
  },
  2: {
    data: {
      companyFullName: "鲜味达生鲜科技有限公司", registeredCapital: "2000万", foundedYear: "2021",
      employeeCount: "50-200", annualRevenue: "5000万",
      decisionMaker: "李明", decisionMakerTitle: "创始人兼CEO",
      mainProducts: "生鲜水果、蔬菜、海鲜配送", targetAudience: "家庭主妇、年轻白领",
      currentAdSpend: "30万/月", mainAdPlatforms: ["美团", "抖音"],
      cooperationGoal: "从区域扩展至全国", expectedBudgetRange: "20-35万/月",
      complianceRisk: "low", budgetClarity: "vague", decisionCycle: "1个月",
    },
    completeness: 68,
    riskTags: ["预算不清晰"],
  },
  3: {
    data: {
      companyFullName: "云启教育科技有限公司", registeredCapital: "3000万", foundedYear: "2018",
      employeeCount: "200-500",
      decisionMaker: "陈雪", decisionMakerTitle: "VP Marketing",
      mainProducts: "K12在线课程", targetAudience: "中小学生家长",
      complianceRisk: "high", budgetClarity: "unknown",
    },
    completeness: 42,
    riskTags: ["高合规风险", "预算不清晰", "决策链不明确"],
  },
  4: {
    data: {
      companyFullName: "锐行汽车配件股份有限公司", registeredCapital: "1亿", foundedYear: "2010",
      employeeCount: "500-1000", annualRevenue: "8亿",
      decisionMaker: "张强", decisionMakerTitle: "营销总监",
      budgetApprover: "VP 李总", technicalContact: "IT总监 陈工",
      mainProducts: "汽车刹车片、滤清器、轮胎", targetAudience: "B端经销商、C端车主",
      salesChannels: "京东、天猫、线下经销商网络", currentMarketShare: "国内前20",
      currentAdSpend: "100万/月", mainAdPlatforms: ["百度", "抖音", "汽车之家"],
      hasAgencyPartner: false, currentAgencyName: "", contentTeamSize: "5人",
      cooperationGoal: "品牌年轻化，拓展C端市场", expectedBudgetRange: "30-50万/月",
      expectedStartDate: "2024-04", keyMetrics: "C端销售占比提升至30%",
      complianceRisk: "low", budgetClarity: "clear", decisionCycle: "3周", competitorThreat: "博世、曼牌",
    },
    completeness: 92,
    riskTags: [],
  },
  5: {
    data: {
      companyFullName: "绿源健康科技有限公司", registeredCapital: "8000万", foundedYear: "2015",
      employeeCount: "200-500", annualRevenue: "3亿",
      decisionMaker: "刘丽", decisionMakerTitle: "品牌总监",
      budgetApprover: "CEO 周总",
      mainProducts: "维生素、益生菌、胶原蛋白", targetAudience: "25-45岁注重健康的女性",
      salesChannels: "天猫、京东、药房", currentMarketShare: "保健品类 Top 30",
      currentAdSpend: "150万/月", mainAdPlatforms: ["小红书", "抖音", "微信"],
      hasAgencyPartner: true, currentAgencyName: "某MCN机构",
      cooperationGoal: "全案营销升级，提升品牌溢价", expectedBudgetRange: "50-70万/月",
      complianceRisk: "high", budgetClarity: "clear", decisionCycle: "1个月",
      competitorThreat: "汤臣倍健、Swisse",
    },
    completeness: 85,
    riskTags: ["高合规风险 - 保健品广告法限制"],
  },
};

export const mockDiagnoses: Record<number, IndustryDiagnosis> = {
  1: {
    id: 1, opportunityId: 1, templateName: "美妆行业标准模板", version: 1,
    scores: [
      { dimension: "行业增长潜力", score: 5, basis: "国内美妆市场年增长15%+", dataSource: "艾瑞咨询2024报告", note: "" },
      { dimension: "竞争激烈程度", score: 4, basis: "头部品牌集中度高但新锐品牌机会大", dataSource: "天猫行业数据", note: "成分党赛道仍有空间" },
      { dimension: "内容营销成熟度", score: 4, basis: "短视频+种草已成标配", dataSource: "蝉妈妈数据", note: "" },
      { dimension: "投放效率空间", score: 3, basis: "CPM持续上涨，需精细化运营", dataSource: "巨量引擎后台", note: "建议聚焦精准人群" },
      { dimension: "品牌认知基础", score: 3, basis: "有一定知名度但未破圈", dataSource: "百度指数", note: "" },
      { dimension: "数据基础设施", score: 4, basis: "已有CDP和数据中台", dataSource: "客户IT部门确认", note: "" },
      { dimension: "合规风险程度", score: 1, basis: "化妆品行业合规风险低", dataSource: "法务评估", note: "" },
      { dimension: "客户配合意愿", score: 5, basis: "CMO直接对接，决策效率高", dataSource: "销售反馈", note: "" },
    ],
    competitors: [
      { id: 1, name: "花西子", platform: "抖音/小红书", sellingPoint: "东方美学", approach: "达人矩阵+品牌自播", priceRange: "100-300", referencePoint: "国风IP打法", differentiator: "我方成分科技路线更理性" },
      { id: 2, name: "珀莱雅", platform: "全平台", sellingPoint: "大单品策略", approach: "爆品+全域种草", priceRange: "100-250", referencePoint: "大单品打爆模式", differentiator: "我方SKU更聚焦" },
    ],
    opportunityScore: 85, difficultyScore: 35, riskLevel: "low",
    recommendedModel: "全案代运营 + 内容共创", suggestedBudgetMin: 400000, suggestedBudgetMax: 600000,
    summary: "BeautyX 处于高增长赛道，品牌有一定基础但需要专业团队帮助突破瓶颈。建议采用全案代运营模式，聚焦抖音和小红书双平台。",
    status: "submitted", createdAt: "2024-03-15",
  },
  4: {
    id: 4, opportunityId: 4, templateName: "汽车行业标准模板", version: 1,
    scores: [
      { dimension: "行业增长潜力", score: 3, basis: "汽车后市场稳定增长", dataSource: "中汽协数据", note: "" },
      { dimension: "竞争激烈程度", score: 4, basis: "国际品牌占据高端市场", dataSource: "行业报告", note: "" },
      { dimension: "内容营销成熟度", score: 2, basis: "行业内容营销尚在起步", dataSource: "竞品分析", note: "有先发优势" },
      { dimension: "投放效率空间", score: 4, basis: "B端精准投放ROI高", dataSource: "百度推广数据", note: "" },
      { dimension: "品牌认知基础", score: 3, basis: "B端有认知，C端待建设", dataSource: "调研数据", note: "" },
      { dimension: "数据基础设施", score: 3, basis: "有ERP但缺少营销数据", dataSource: "客户IT确认", note: "" },
      { dimension: "合规风险程度", score: 1, basis: "汽配行业合规风险低", dataSource: "法务评估", note: "" },
      { dimension: "客户配合意愿", score: 4, basis: "营销总监全力推动", dataSource: "销售反馈", note: "" },
    ],
    competitors: [
      { id: 1, name: "博世", platform: "全平台", sellingPoint: "德国品质", approach: "品牌广告+经销商体系", priceRange: "高端", referencePoint: "品牌信任背书", differentiator: "我方性价比优势" },
    ],
    opportunityScore: 70, difficultyScore: 45, riskLevel: "low",
    recommendedModel: "内容营销 + 精准投放", suggestedBudgetMin: 300000, suggestedBudgetMax: 500000,
    summary: "锐行在B端有一定基础，C端品牌建设是核心机会。建议以内容营销建立C端认知，配合精准投放获客。",
    status: "submitted", createdAt: "2024-03-10",
  },
};

export const mockProposals: Record<number, ProposalVersion> = {
  1: {
    id: 1, opportunityId: 1, proposalName: "BeautyX 2024 全案营销方案",
    proposalType: "全域版", version: 2, isActive: true,
    serviceCycleMonths: 6, coreGoals: ["GMV增长30%", "品牌搜索指数提升50%", "新客获取成本降低20%"],
    majorPlatforms: ["抖音", "小红书", "微信视频号"],
    strategyPath: "成分科技 → 达人种草 → 品牌自播 → 私域沉淀",
    serviceBoundary: "不含线下活动执行、不含产品研发建议",
    suggestedAdBudget: 500000, includesAgencyOperation: true,
    modules: [
      { id: "situation", title: "客户现状", content: "BeautyX 成立于2019年，主打成分党护肤路线，核心产品为玻尿酸精华液和烟酰胺面霜。目前天猫旗舰店月销约800万，抖音自播月GMV约200万。品牌在小红书有一定种草基础（品牌相关笔记约1.2万篇），但缺乏系统化的内容矩阵和达人合作体系。当前团队配置为3人内容小组+1人投放运营，产能瓶颈明显。主要竞品花西子、珀莱雅在内容营销上投入更大，BeautyX需要专业团队协助突破增长瓶颈。", order: 0 },
      { id: "insight", title: "行业洞察", content: "2024年中国功效护肤市场规模预计突破1200亿元，年增长率15%+。成分党消费者占护肤人群的38%，且呈持续上升趋势。抖音美妆赛道竞争激烈但仍有结构性机会：短视频种草→直播转化的链路效率持续提升，CPM同比上涨12%但精准人群ROI仍可达1:4以上。小红书作为决策前置平台，美妆类笔记互动率高于平台均值40%。视频号作为新兴渠道，美妆品类竞争度低，早期入局可获取低成本流量红利。", order: 1 },
      { id: "problem", title: "核心问题", content: "1. 内容产能不足：现有3人团队月产出短视频约30条，远低于竞品花西子的200+条/月，无法支撑多平台内容矩阵。\n2. 达人合作体系缺失：目前仅与少量KOC合作，缺乏头部和腰部达人的系统化合作机制，种草声量不足。\n3. 投放精细化程度低：抖音投放以通投为主，缺乏人群包精细化运营，导致获客成本偏高（当前约45元/新客）。\n4. 私域沉淀薄弱：公域流量未有效导入私域，复购率仅18%，低于行业平均25%。\n5. 品牌心智模糊：消费者对BeautyX的品牌认知停留在'性价比'层面，未建立'成分科技'的差异化心智。", order: 2 },
      { id: "goal", title: "营销目标", content: "核心目标（6个月周期）：\n\n【GMV目标】整体GMV从月均1000万提升至1300万，增长30%。其中抖音渠道GMV从200万提升至400万，小红书引流贡献GMV从100万提升至200万。\n\n【品牌目标】品牌百度搜索指数从当前500提升至750（+50%），小红书品牌相关笔记从1.2万篇增长至3万篇。\n\n【效率目标】新客获取成本从45元降至36元（-20%），私域用户从5万增长至12万，复购率从18%提升至25%。\n\n【里程碑】第1-2月完成团队搭建和内容体系建设；第3-4月启动达人矩阵和投放优化；第5-6月冲刺GMV目标并沉淀方法论。", order: 3 },
      { id: "strategy", title: "核心策略", content: "采用'成分科技 → 达人种草 → 品牌自播 → 私域沉淀'四步走策略：\n\n【第一步：成分科技内容体系】打造'BeautyX实验室'IP，以成分解析、配方故事、功效实测为核心内容方向，建立品牌专业形象。每月产出100+条短视频内容，覆盖科普、测评、教程三大类型。\n\n【第二步：达人种草矩阵】构建金字塔型达人合作体系——头部达人（2-3位/月）负责破圈引爆，腰部达人（20-30位/月）负责口碑扩散，素人KOC（100+位/月）负责真实种草。重点布局小红书和抖音双平台。\n\n【第三步：品牌自播升级】将抖音自播从单一直播间升级为矩阵直播（主号+成分号+福利号），日播时长从8小时提升至16小时。引入专业主播团队，优化话术和货盘结构。\n\n【第四步：私域沉淀运营】通过包裹卡、直播间引导、小红书私信等多触点将公域用户导入企业微信私域，搭建会员分层运营体系，提升复购率和客单价。", order: 4 },
      { id: "channel", title: "渠道组合", content: "【抖音（占比50%）】\n- 短视频：日更3-5条，以成分科普和产品测评为主\n- 直播：矩阵3个直播间，日播16小时\n- 投放：千川信息流+搜索广告，月预算25万\n\n【小红书（占比30%）】\n- 笔记：月产出200+篇（含达人合作笔记）\n- 类型：成分解析、使用教程、对比测评、好物分享\n- 投放：薯条+聚光，月预算10万\n\n【微信视频号（占比20%）】\n- 短视频：日更1-2条，侧重品牌故事和用户证言\n- 直播：每周3场，以品牌专场和新品首发为主\n- 私域联动：视频号直播间直接导流企微\n\n各渠道之间形成协同：小红书种草→抖音搜索转化→视频号复购→私域沉淀的完整闭环。", order: 5 },
      { id: "content", title: "内容策略", content: "内容矩阵规划：\n\n【科普类（30%）】成分解析、护肤知识、配方故事，建立专业信任。代表栏目：'成分实验室'系列、'配方师说'系列。\n\n【测评类（25%）】产品实测、对比评测、28天打卡，提供购买决策依据。代表栏目：'真实测评'系列、'成分党挑战'系列。\n\n【教程类（20%）】护肤步骤、搭配方案、季节护肤，增加使用场景。代表栏目：'早晚护肤routine'、'换季急救指南'。\n\n【种草类（15%）】好物推荐、开箱分享、合集推荐，直接促进转化。由达人和KOC产出为主。\n\n【品牌类（10%）】品牌故事、用户证言、幕后花絮，增强品牌情感连接。\n\n月度内容产出目标：短视频150条+、图文笔记200篇+、直播场次90场+。", order: 6 },
      { id: "media", title: "投放策略", content: "月度投放预算50万，分配如下：\n\n【抖音千川（25万/月）】\n- 短视频引流：60%预算，以成分科普类素材为主，定向25-40岁女性，兴趣标签：护肤、成分党、美妆\n- 直播间投流：30%预算，直投直播间+短视频引流直播间组合\n- 搜索广告：10%预算，锁定品牌词+品类词+竞品词\n- 目标ROI：整体1:3.5以上\n\n【小红书聚光（10万/月）】\n- 信息流：70%预算，推广高互动笔记\n- 搜索：30%预算，锁定'玻尿酸精华''烟酰胺面霜'等品类词\n- 目标：笔记互动成本<5元，搜索CPC<3元\n\n【视频号投流（5万/月）】\n- 直播间引流为主，配合朋友圈广告\n- 重点利用微信社交裂变特性\n\n投放优化节奏：前2周测试素材和人群，第3周放量优质计划，第4周复盘调整。", order: 7 },
      { id: "rhythm", title: "阶段节奏", content: "【第1个月：基建期】\n- 完成团队组建和培训\n- 搭建内容生产SOP和素材库\n- 开设抖音矩阵账号和视频号\n- 启动首批达人招募（50位KOC）\n\n【第2个月：起量期】\n- 内容产出进入稳定状态（日更5条+）\n- 启动抖音千川投放测试\n- 首批达人内容上线\n- 抖音自播升级为双直播间\n\n【第3个月：爆发期】\n- 头部达人合作首发（2-3位）\n- 投放预算提升至满额\n- 配合618大促节点冲刺\n- 私域用户突破8万\n\n【第4个月：优化期】\n- 复盘618数据，优化投放策略\n- 扩大腰部达人合作规模\n- 视频号直播常态化\n- 启动会员分层运营\n\n【第5个月：冲刺期】\n- 全渠道内容矩阵满负荷运转\n- 新品上市配合全域推广\n- 私域用户突破10万\n\n【第6个月：收官期】\n- GMV冲刺1300万目标\n- 沉淀方法论和SOP文档\n- 输出项目复盘报告\n- 规划下一阶段合作方案", order: 8 },
      { id: "team", title: "团队配置", content: "项目团队配置（我方投入）：\n\n【项目管理】项目总监1人（统筹全局）、项目经理1人（日常执行管理）\n\n【内容团队】内容策划2人（选题策划+脚本撰写）、短视频编导2人（拍摄+剪辑）、平面设计1人（图文笔记+直播物料）\n\n【达人运营】达人BD经理1人（达人招募+关系维护）、达人运营专员1人（brief撰写+内容审核+数据跟踪）\n\n【直播团队】直播运营主管1人、主播2人（轮班制）、直播场控1人\n\n【投放团队】投放优化师2人（抖音+小红书）、数据分析师1人\n\n【私域运营】私域运营专员1人\n\n合计：17人团队，月人力成本约28万元。\n\n客户方需配合：产品经理1人（产品信息对接）、品牌负责人1人（重大决策审批）。", order: 9 },
      { id: "kpi", title: "KPI 建议", content: "核心KPI体系：\n\n| 指标类别 | KPI指标 | 基线值 | 目标值 | 考核周期 |\n|---------|---------|--------|--------|---------|\n| GMV | 月度GMV | 1000万 | 1300万 | 月度 |\n| GMV | 抖音渠道GMV | 200万 | 400万 | 月度 |\n| 品牌 | 百度搜索指数 | 500 | 750 | 季度 |\n| 品牌 | 小红书品牌笔记数 | 1.2万 | 3万 | 季度 |\n| 效率 | 新客获取成本 | 45元 | 36元 | 月度 |\n| 效率 | 投放ROI | 1:2.5 | 1:3.5 | 月度 |\n| 私域 | 私域用户数 | 5万 | 12万 | 季度 |\n| 私域 | 复购率 | 18% | 25% | 季度 |\n\n数据汇报机制：周报（每周一）、月报（每月5日）、季度复盘（每季度末）。", order: 10 },
      { id: "boundary", title: "服务边界", content: "【服务范围内】\n- 全平台内容策划、制作与发布\n- 达人招募、合作管理与效果追踪\n- 抖音/小红书/视频号投放策略制定与执行\n- 直播间运营（含主播、场控、运营）\n- 私域用户运营（企微社群+会员体系）\n- 月度/季度数据分析与策略优化报告\n- 重大营销节点活动策划与执行\n\n【服务范围外】\n- 线下活动策划与执行（如快闪店、路演等）\n- 产品研发建议与配方调整\n- 电商平台店铺装修与日常运营（天猫/京东）\n- PR媒体关系维护与危机公关\n- 品牌VI设计与包装设计\n- 物流仓储与客服体系\n\n【灰色地带约定】\n- 电商大促期间的店铺活动配合：我方提供流量支持，店铺运营由客户方负责\n- 用户舆情监控：我方负责社媒平台舆情，客户方负责电商平台评价管理", order: 11 },
      { id: "risk", title: "风险提示", content: "【执行风险】\n1. 内容审核风险：美妆类内容涉及功效宣称，需严格遵守《化妆品监督管理条例》，所有内容需经法务审核后发布。应对措施：建立内容合规审核SOP，配备专职审核人员。\n2. 达人合作风险：头部达人档期不确定性高，可能影响关键节点的内容排期。应对措施：提前2个月锁定档期，同时储备备选达人名单。\n3. 平台政策风险：抖音/小红书平台算法和政策可能调整，影响内容分发和投放效果。应对措施：保持与平台官方的沟通，及时调整策略。\n\n【商业风险】\n4. ROI波动风险：大促期间流量成本上涨可能导致短期ROI下降。应对措施：提前储备素材，错峰投放，合理分配预算。\n5. 竞品反应风险：竞品可能加大投放力度进行反击。应对措施：持续监控竞品动态，保持内容差异化优势。\n\n【协作风险】\n6. 客户配合度风险：产品信息提供不及时可能影响内容产出节奏。应对措施：建立固定对接机制，每周同步会议。", order: 12 },
    ],
    feasibilityStatus: "pass", feasibilityNotes: [],
    versionNote: "根据客户反馈调整投放策略，增加视频号渠道",
    createdAt: "2024-03-20", updatedAt: "2024-03-28",
  },
  4: {
    id: 4, opportunityId: 4, proposalName: "锐行汽配数字化营销方案",
    proposalType: "增长版", version: 1, isActive: true,
    serviceCycleMonths: 12, coreGoals: ["C端销售占比提升至30%", "品牌百度指数翻倍"],
    majorPlatforms: ["抖音", "百度", "汽车之家"],
    strategyPath: "B端口碑 → C端内容种草 → 精准投放转化",
    serviceBoundary: "不含经销商管理、不含线下展会",
    suggestedAdBudget: 400000, includesAgencyOperation: false,
    modules: [
      { id: "situation", title: "客户现状", content: "锐行汽车配件成立于2008年，是国内领先的汽车零部件制造商，主营刹车片、滤清器、减震器三大品类。目前B端渠道占营收85%，与200+家4S店和修理厂建立合作关系，年营收约2亿元。C端电商渠道（天猫/京东）月销约150万，占比仅15%。品牌在B端有较高认知度，但C端消费者对品牌几乎无感知。现有营销团队仅2人，主要负责B端展会和经销商支持，数字营销能力接近空白。", order: 0 },
      { id: "insight", title: "行业洞察", content: "中国汽车后市场规模2024年预计达1.4万亿元，其中汽车配件市场约4000亿。随着汽车保有量突破3.4亿辆，平均车龄增长至6.2年，售后维保需求持续扩大。C端DIY养车趋势兴起，抖音'汽车养护'话题播放量超200亿次。消费者对国产替代接受度提升，但品牌信任仍是核心障碍。百度搜索是汽配消费者的主要决策入口，汽车之家等垂直平台是重要的口碑阵地。", order: 1 },
      { id: "problem", title: "核心问题", content: "1. C端品牌认知缺失：消费者在选购汽配时倾向于博世、曼牌等国际品牌，锐行在C端几乎没有品牌声量。\n2. 内容营销空白：没有系统化的内容输出，缺乏产品科普、安装教程、对比测评等消费者关心的内容。\n3. 线上获客成本高：百度SEM竞价激烈，单次点击成本高达15-20元，缺乏自然流量来源。\n4. 电商转化率低：天猫店铺转化率仅1.2%，低于行业平均2.5%，主要原因是品牌信任不足和详情页说服力弱。\n5. B端C端割裂：B端积累的专业口碑和技术实力未能有效传递给C端消费者。", order: 2 },
      { id: "goal", title: "营销目标", content: "核心目标（12个月周期）：\n\n【销售目标】C端电商月销从150万提升至450万，占总营收比例从15%提升至30%。\n\n【品牌目标】品牌百度搜索指数翻倍（从当前200提升至400），抖音品牌相关视频播放量突破5000万。\n\n【获客目标】百度SEM获客成本降低30%，自然搜索流量占比从10%提升至30%。\n\n【里程碑】Q1完成内容体系搭建和SEO基础优化；Q2启动抖音内容矩阵和达人合作；Q3配合双11备战冲刺；Q4沉淀方法论并规划下一年度计划。", order: 3 },
      { id: "strategy", title: "核心策略", content: "采用'B端口碑 → C端内容种草 → 精准投放转化'三步走策略：\n\n【第一步：B端口碑资产化】将锐行在B端积累的技术实力、质检标准、OEM合作案例等专业背书，转化为C端消费者可感知的内容资产。打造'锐行品质实验室'IP，展示产品测试过程和技术参数对比。\n\n【第二步：C端内容种草】以抖音为主阵地，产出汽车养护知识、配件更换教程、国产vs进口对比测评等实用内容。联合汽车KOL进行产品体验和推荐，建立C端消费者信任。\n\n【第三步：精准投放转化】百度SEO+SEM双管齐下，锁定'刹车片品牌推荐''滤清器哪个牌子好'等高意向关键词。汽车之家论坛口碑运营+精准广告投放，触达精准车主人群。", order: 4 },
      { id: "channel", title: "渠道组合", content: "【抖音（占比40%）】\n- 短视频：每周5-8条，以汽车养护知识和产品测评为主\n- 达人合作：月合作汽车KOL 5-10位\n- 投放：千川信息流，月预算16万\n\n【百度（占比35%）】\n- SEO：优化品牌官网和百度百科，产出50+篇专业文章\n- SEM：品牌词+品类词+竞品词，月预算14万\n- 知道/经验：布局长尾问答内容\n\n【汽车之家（占比25%）】\n- 论坛口碑：技术帖+用户分享帖，月产出20篇\n- 精准广告：车型定向+保养提醒场景，月预算10万\n- 商城入驻：汽车之家养车商城开店", order: 5 },
      { id: "content", title: "内容策略", content: "内容矩阵规划：\n\n【技术科普类（35%）】刹车片材质解析、滤清器工作原理、减震器选购指南等专业内容，建立技术权威形象。代表栏目：'锐行品质实验室'、'配件知识100问'。\n\n【实操教程类（25%）】DIY更换刹车片教程、空调滤清器自助更换、保养周期提醒等实用内容。代表栏目：'老司机养车课'、'3分钟学会系列'。\n\n【对比测评类（20%）】国产vs进口配件对比、不同品牌横评、耐久性实测等内容，用数据说话。代表栏目：'配件擂台赛'、'万公里实测'。\n\n【用户故事类（10%）】车主真实使用体验、修理厂师傅推荐、长途自驾用车分享。\n\n【品牌故事类（10%）】工厂探访、质检流程、OEM合作案例，展示品牌实力。", order: 6 },
      { id: "media", title: "投放策略", content: "月度投放预算40万，分配如下：\n\n【抖音千川（16万/月）】\n- 短视频引流：70%预算，以教程类和测评类素材为主\n- 定向：25-50岁男性，有车人群，关注汽车养护\n- 目标：视频播放成本<0.05元，转化ROI>1:3\n\n【百度SEM（14万/月）】\n- 品牌词：锐行+产品名，确保品牌词首位\n- 品类词：刹车片/滤清器/减震器+推荐/排名/哪个好\n- 竞品词：博世/曼牌+替代/对比/平替\n- 目标：CPC降至10元以下，转化率>3%\n\n【汽车之家（10万/月）】\n- 开屏+信息流：针对保养提醒场景\n- 车型定向：覆盖主流车型车主\n- 目标：点击率>2%，留资成本<50元", order: 7 },
      { id: "rhythm", title: "阶段节奏", content: "【Q1（第1-3月）：基建期】\n- 搭建内容团队和生产流程\n- 完成品牌官网SEO优化\n- 开设抖音账号并启动内容测试\n- 百度百科和知道布局\n- 汽车之家商城入驻\n\n【Q2（第4-6月）：起量期】\n- 抖音内容进入稳定产出\n- 启动达人合作计划\n- 百度SEM全面投放\n- 618大促配合电商冲量\n\n【Q3（第7-9月）：爆发期】\n- 头部汽车KOL合作\n- 投放预算提升至满额\n- 双11预热期内容储备\n- C端月销突破300万\n\n【Q4（第10-12月）：收官期】\n- 双11/双12大促冲刺\n- C端月销冲刺450万目标\n- 年度复盘与方法论沉淀\n- 下一年度合作方案规划", order: 8 },
      { id: "team", title: "团队配置", content: "项目团队配置（我方投入）：\n\n【项目管理】项目经理1人（统筹执行）\n\n【内容团队】内容策划1人（选题+脚本）、短视频编导1人（拍摄+剪辑）、SEO编辑1人（百度内容优化）\n\n【投放团队】SEM优化师1人（百度投放）、信息流优化师1人（抖音+汽车之家）\n\n【达人运营】达人BD专员1人（兼汽车之家论坛运营）\n\n合计：7人团队，月人力成本约12万元。\n\n客户方需配合：技术工程师1人（产品技术参数支持）、电商运营1人（店铺活动配合）。", order: 9 },
      { id: "kpi", title: "KPI 建议", content: "核心KPI体系：\n\n| 指标类别 | KPI指标 | 基线值 | 目标值 | 考核周期 |\n|---------|---------|--------|--------|---------|\n| 销售 | C端月销 | 150万 | 450万 | 月度 |\n| 销售 | C端占比 | 15% | 30% | 季度 |\n| 品牌 | 百度搜索指数 | 200 | 400 | 季度 |\n| 品牌 | 抖音视频总播放 | 0 | 5000万 | 年度 |\n| 获客 | 百度SEM CPC | 18元 | 10元 | 月度 |\n| 获客 | 自然搜索占比 | 10% | 30% | 季度 |\n| 转化 | 电商转化率 | 1.2% | 2.5% | 月度 |\n\n数据汇报机制：周报（每周一）、月报（每月5日）、季度复盘。", order: 10 },
      { id: "boundary", title: "服务边界", content: "【服务范围内】\n- 抖音/百度/汽车之家三平台内容策划与执行\n- 达人招募与合作管理\n- 百度SEO优化与SEM投放\n- 抖音千川投放与优化\n- 汽车之家广告投放与论坛运营\n- 月度数据分析与策略优化报告\n\n【服务范围外】\n- 经销商渠道管理与支持\n- 线下展会策划与执行\n- 电商平台店铺运营（天猫/京东日常运营）\n- 产品包装设计与工业设计\n- 物流仓储与售后客服\n- 海外市场推广", order: 11 },
      { id: "risk", title: "风险提示", content: "【执行风险】\n1. 内容专业性风险：汽配内容需要较强的技术背景，内容团队需要客户方技术支持。应对措施：前期安排内容团队到工厂实地学习，建立技术顾问机制。\n2. 百度算法风险：SEO排名受算法更新影响较大。应对措施：白帽SEO为主，同时保持SEM投放作为流量保底。\n\n【商业风险】\n3. 价格竞争风险：国际品牌可能通过降价应对国产替代趋势。应对措施：强调性价比和本土化服务优势，避免纯价格竞争。\n4. 行业周期风险：汽车市场景气度波动可能影响配件需求。应对措施：内容策略侧重'省钱养车'等经济型话题，适应市场变化。\n\n【协作风险】\n5. 技术资料获取风险：产品技术参数和测试数据需要客户方及时提供。应对措施：签订信息共享协议，明确响应时效。", order: 12 },
    ],
    feasibilityStatus: "pass", feasibilityNotes: [],
    versionNote: "初版方案",
    createdAt: "2024-03-18", updatedAt: "2024-03-25",
  },
  2: {
    id: 2, opportunityId: 2, proposalName: "鲜味达全域推广方案",
    proposalType: "增长版", version: 1, isActive: true,
    serviceCycleMonths: 6, coreGoals: ["月订单量翻倍", "品牌搜索指数提升80%", "新城市拓展3个"],
    majorPlatforms: ["抖音", "美团", "小红书"],
    strategyPath: "本地生活种草 → 达人探店引爆 → 精准投放获客",
    serviceBoundary: "不含物流配送体系搭建、不含供应链管理",
    suggestedAdBudget: 300000, includesAgencyOperation: true,
    modules: [
      { id: "situation", title: "客户现状", content: "鲜味达生鲜成立于2021年，是华东地区新兴的生鲜电商平台，主营水果、蔬菜、海鲜三大品类。目前覆盖上海、杭州、南京3个城市，注册用户约50万，月活用户12万，月订单量约8万单，客单价65元。平台以'2小时极速达'为核心卖点，在华东区域有一定口碑基础。现有营销团队5人，主要负责美团/饿了么平台运营，社交媒体营销能力较弱。面临叮咚买菜、盒马等巨头的激烈竞争，需要差异化突围。", order: 0 },
      { id: "insight", title: "行业洞察", content: "2024年中国生鲜电商市场规模预计达6500亿元，渗透率从2020年的14.6%提升至2024年的25%+。社区团购退潮后，即时配送模式重新成为主流。抖音本地生活业务爆发式增长，2024年GMV预计突破1万亿，其中餐饮和生鲜是增长最快的品类。小红书'买菜攻略'话题浏览量超5亿次，年轻消费者越来越依赖社交平台做购买决策。美团闪购生鲜品类同比增长60%，即时零售成为新战场。", order: 1 },
      { id: "problem", title: "核心问题", content: "1. 品牌认知度低：在目标城市的品牌提及率不足5%，消费者首选仍是叮咚买菜和盒马。\n2. 获客成本高企：当前新客获取成本约45元，远高于行业平均的25元，主要依赖美团平台流量。\n3. 用户留存差：次月留存率仅28%，低于行业平均35%，缺乏有效的用户运营体系。\n4. 内容营销空白：没有系统化的内容输出，缺乏美食教程、食材科普等能建立信任的内容。\n5. 私域流量为零：完全依赖平台流量，没有建立自有用户池，抗风险能力弱。", order: 2 },
      { id: "goal", title: "营销目标", content: "核心目标（6个月周期）：\n\n【订单目标】月订单量从8万提升至16万，翻倍增长。新城市（苏州、宁波、无锡）月订单量突破1万。\n\n【品牌目标】目标城市品牌提及率从5%提升至15%，抖音品牌相关视频播放量突破3000万。\n\n【效率目标】新客获取成本从45元降至28元（-38%），次月留存率从28%提升至40%。\n\n【私域目标】企微私域用户从0增长至5万，社群复购率达到30%。\n\n【里程碑】第1-2月完成内容体系搭建和私域基建；第3-4月启动达人探店和抖音投放；第5-6月新城市拓展和冲刺目标。", order: 3 },
      { id: "strategy", title: "核心策略", content: "采用'本地生活种草 → 达人探店引爆 → 精准投放获客'三步走策略：\n\n【第一步：本地生活内容种草】以'新鲜看得见'为内容主线，打造产地溯源、食材科普、快手菜教程等系列内容。在抖音和小红书同步布局，建立'新鲜、健康、便捷'的品牌心智。每周产出15-20条短视频内容。\n\n【第二步：达人探店引爆】联合本地美食达人、家庭主妇KOL进行'鲜味达开箱'系列内容合作。重点打造'从下单到收货2小时'的极速体验内容，用真实体验建立信任。每月合作30-50位本地达人。\n\n【第三步：精准投放获客】抖音本地生活广告+美团搜索广告双管齐下，锁定3公里范围内的精准用户。配合新人首单优惠券，降低首次体验门槛。同步搭建企微私域，通过社群运营提升复购。", order: 4 },
      { id: "channel", title: "渠道组合", content: "【抖音本地生活（占比45%）】\n- 短视频：日更3-5条，以食材科普和快手菜教程为主\n- 达人合作：月合作本地美食KOL 30-50位\n- 团购：上线抖音团购套餐，引流到平台下单\n- 投放：本地推+千川，月预算13.5万\n\n【美团/饿了么（占比30%）】\n- 搜索优化：品类关键词排名优化\n- 活动运营：新人专享、满减活动、时令专题\n- 投放：搜索广告+推荐位，月预算9万\n\n【小红书（占比15%）】\n- 笔记：月产出100+篇（含达人合作）\n- 类型：开箱测评、食材对比、省钱攻略\n- 投放：薯条推广，月预算4.5万\n\n【企微私域（占比10%）】\n- 社群运营：按城市建立用户社群\n- 内容：每日特价、食谱分享、新品预告\n- 预算：运营人力+工具，月预算3万", order: 5 },
      { id: "content", title: "内容策略", content: "内容矩阵规划：\n\n【产地溯源类（25%）】深入产地拍摄水果采摘、海鲜捕捞、蔬菜种植过程，展示食材新鲜度和品质把控。代表栏目：'鲜味溯源'、'从田间到餐桌'。\n\n【快手菜教程类（30%）】以鲜味达食材为原料，教用户10分钟做出美味家常菜。代表栏目：'10分钟晚餐'、'懒人食谱'。\n\n【开箱测评类（20%）】达人真实开箱体验，展示配送速度、包装品质、食材新鲜度。代表栏目：'鲜味达开箱'、'生鲜盲测'。\n\n【省钱攻略类（15%）】教用户如何用最少的钱买到最好的食材，结合平台优惠活动。代表栏目：'买菜省钱经'、'时令好物'。\n\n【品牌故事类（10%）】分拣中心探访、配送员故事、品控流程展示。", order: 6 },
      { id: "media", title: "投放策略", content: "月度投放预算30万，分配如下：\n\n【抖音本地推+千川（13.5万/月）】\n- 本地推：60%预算，3公里范围精准投放\n- 千川：40%预算，短视频引流+团购转化\n- 定向：25-45岁，家庭用户，关注美食/生鲜\n- 目标：新客获取成本<25元，团购核销率>60%\n\n【美团搜索广告（9万/月）】\n- 品类词：水果/蔬菜/海鲜+配送/买菜\n- 竞品词：叮咚买菜/盒马+替代/对比\n- 目标：搜索排名前3，点击成本<3元\n\n【小红书薯条（4.5万/月）】\n- 推广高互动笔记，侧重开箱和教程类\n- 目标：笔记互动成本<3元\n\n【私域运营（3万/月）】\n- 企微SCRM工具+社群运营人力\n- 目标：社群用户月复购率>30%", order: 7 },
      { id: "rhythm", title: "阶段节奏", content: "【第1个月：基建期】\n- 搭建内容团队和生产流程\n- 开设抖音账号并启动内容测试\n- 搭建企微私域基础设施\n- 首批达人招募（20位本地KOC）\n\n【第2个月：起量期】\n- 内容产出进入稳定状态\n- 启动抖音本地推投放\n- 美团搜索广告优化\n- 私域社群启动运营\n\n【第3个月：爆发期】\n- 头部本地达人合作（5-10位）\n- 配合618大促冲刺\n- 私域用户突破2万\n\n【第4个月：拓展期】\n- 苏州、宁波新城市启动\n- 复制成功内容模板到新城市\n- 投放预算提升至满额\n\n【第5个月：深耕期】\n- 新城市内容本地化\n- 无锡市场启动\n- 全渠道联动促销\n\n【第6个月：收官期】\n- 冲刺月订单16万目标\n- 沉淀方法论和SOP\n- 输出项目复盘报告", order: 8 },
      { id: "team", title: "团队配置", content: "项目团队配置（我方投入）：\n\n【项目管理】项目经理1人（统筹执行）\n\n【内容团队】内容策划1人（选题+脚本）、短视频编导2人（拍摄+剪辑）\n\n【达人运营】达人BD经理1人（达人招募+关系维护）\n\n【投放团队】投放优化师1人（抖音+美团）、数据分析师1人\n\n【私域运营】社群运营专员1人\n\n合计：8人团队，月人力成本约15万元。\n\n客户方需配合：供应链负责人1人（产地资源对接）、客服主管1人（用户反馈处理）。", order: 9 },
      { id: "kpi", title: "KPI 建议", content: "核心KPI体系：\n\n| 指标类别 | KPI指标 | 基线值 | 目标值 | 考核周期 |\n|---------|---------|--------|--------|---------|\n| 订单 | 月订单量 | 8万 | 16万 | 月度 |\n| 订单 | 新城市月订单 | 0 | 1万 | 月度 |\n| 品牌 | 品牌提及率 | 5% | 15% | 季度 |\n| 品牌 | 抖音视频播放 | 0 | 3000万 | 季度 |\n| 获客 | 新客成本 | 45元 | 28元 | 月度 |\n| 留存 | 次月留存率 | 28% | 40% | 月度 |\n| 私域 | 私域用户数 | 0 | 5万 | 季度 |\n| 私域 | 社群复购率 | 0 | 30% | 月度 |", order: 10 },
      { id: "boundary", title: "服务边界", content: "【服务范围内】\n- 抖音/小红书/美团三平台内容策划与执行\n- 达人招募与合作管理\n- 抖音本地推和千川投放\n- 美团搜索广告投放与优化\n- 企微私域搭建与社群运营\n- 月度数据分析与策略优化报告\n\n【服务范围外】\n- 物流配送体系搭建与管理\n- 供应链管理与采购\n- 平台技术开发与维护\n- 客服体系搭建\n- 线下门店运营\n- 食品安全检测与合规", order: 11 },
      { id: "risk", title: "风险提示", content: "【执行风险】\n1. 食品安全舆情风险：生鲜品类容易出现质量投诉，需建立快速响应机制。应对措施：建立舆情监控系统，制定危机公关预案。\n2. 季节性波动风险：生鲜品类受季节影响大，夏季配送损耗率高。应对措施：根据季节调整品类推广重点和内容策略。\n\n【商业风险】\n3. 巨头竞争风险：叮咚买菜、盒马可能加大补贴力度。应对措施：避免价格战，强调品质和服务差异化。\n4. 新城市拓展风险：新城市用户习惯和竞争格局不同。应对措施：先小规模测试，验证模型后再规模化。\n\n【协作风险】\n5. 供应链配合风险：产地溯源内容需要供应链团队配合拍摄。应对措施：提前1个月规划拍摄计划，预留备选方案。", order: 12 },
    ],
    feasibilityStatus: "warning", feasibilityNotes: ["客户预算尚未最终确认"],
    versionNote: "初版方案，待客户确认预算后调整",
    createdAt: "2024-03-20", updatedAt: "2024-03-27",
  },
  3: {
    id: 3, opportunityId: 3, proposalName: "云启教育品牌升级方案",
    proposalType: "基础版", version: 1, isActive: true,
    serviceCycleMonths: 3, coreGoals: ["品牌形象焕新", "合规转型传播", "家长信任度提升"],
    majorPlatforms: ["微信公众号", "知乎", "小红书"],
    strategyPath: "合规转型叙事 → 教育理念输出 → 家长口碑裂变",
    serviceBoundary: "不含课程研发、不含技术平台开发",
    suggestedAdBudget: 150000, includesAgencyOperation: false,
    modules: [
      { id: "situation", title: "客户现状", content: "云启教育科技成立于2018年，是一家K12在线教育公司，主营数学和英语两大学科的在线辅导课程。2021年双减政策后，公司从学科辅导转型为素质教育方向，目前主营编程思维、科学探索、阅读写作三大素质课程。注册用户约80万（历史积累），但活跃付费用户仅3万，月营收约600万。品牌在家长群体中仍有'学科辅导'的旧印象，转型认知尚未建立。团队从高峰期的500人缩减至120人，营销团队仅3人。", order: 0 },
      { id: "insight", title: "行业洞察", content: "双减政策后，K12学科培训市场大幅萎缩，但素质教育市场迎来爆发，2024年市场规模预计达5600亿元。编程教育年增长率超30%，科学教育和阅读写作也保持20%+的增长。家长对素质教育的付费意愿提升，但选择更加谨慎，口碑和品牌信任成为关键决策因素。微信生态（公众号+视频号+社群）仍是教育行业最重要的获客和运营渠道。知乎和小红书成为家长获取教育信息的重要平台。", order: 1 },
      { id: "problem", title: "核心问题", content: "1. 品牌认知错位：家长仍将云启与学科辅导关联，不知道已转型素质教育，导致新课程推广困难。\n2. 信任危机：双减后教育行业整体信任度下降，家长对教育机构持观望态度。\n3. 内容输出断层：转型后内容团队大幅缩减，公众号从日更变为周更，阅读量下降70%。\n4. 获客渠道单一：主要依赖老用户转介绍和公众号推文，缺乏新的流量入口。\n5. 合规传播限制：教育行业广告投放受到严格限制，传统投放渠道受限。", order: 2 },
      { id: "goal", title: "营销目标", content: "核心目标（3个月周期）：\n\n【品牌目标】完成品牌形象焕新，建立'素质教育专家'的新品牌认知。品牌百度搜索指数中'素质教育'关联度从10%提升至50%。\n\n【获客目标】月新增付费用户从500人提升至1500人，获客成本控制在200元以内。\n\n【内容目标】公众号阅读量恢复至转型前水平（篇均5000+），知乎教育话题回答进入Top10。\n\n【口碑目标】小红书品牌相关笔记从200篇增长至2000篇，好评率保持90%以上。", order: 3 },
      { id: "strategy", title: "核心策略", content: "采用'合规转型叙事 → 教育理念输出 → 家长口碑裂变'三步走策略：\n\n【第一步：合规转型叙事】通过创始人访谈、团队故事、课程研发幕后等内容，讲述云启从学科辅导到素质教育的转型故事。传递'为孩子的长远发展负责'的品牌理念，将政策合规转化为品牌优势。\n\n【第二步：教育理念输出】在知乎、公众号等平台持续输出高质量的教育理念文章，如'编程思维如何培养孩子的逻辑能力'、'科学探索对孩子创造力的影响'等。建立专业权威形象，吸引认同理念的家长。\n\n【第三步：家长口碑裂变】邀请在读学员家长分享真实学习效果和成长故事，在小红书和家长社群中形成口碑传播。设计'老带新'激励机制，实现低成本获客。", order: 4 },
      { id: "channel", title: "渠道组合", content: "【微信生态（占比45%）】\n- 公众号：恢复日更，以教育理念和家长指南为主\n- 视频号：每周3-5条，课堂花絮和学员成果展示\n- 社群：家长交流群运营，每日教育资讯分享\n- 小程序：体验课引流入口\n\n【知乎（占比25%）】\n- 机构号运营：教育话题高质量回答\n- 专栏文章：深度教育理念输出\n- 知乎Live：教育专家在线分享\n\n【小红书（占比30%）】\n- 家长笔记：学员家长真实分享\n- 教育干货：学习方法和育儿经验\n- 课程体验：体验课开箱和效果展示", order: 5 },
      { id: "content", title: "内容策略", content: "内容矩阵规划：\n\n【教育理念类（35%）】编程思维培养、科学探索方法、阅读习惯养成等深度文章，建立专业权威。代表栏目：'云启教育观'、'未来素养'。\n\n【学员故事类（25%）】真实学员的学习历程、成长变化、比赛获奖等，用效果说话。代表栏目：'成长日记'、'小小科学家'。\n\n【家长指南类（20%）】如何选择素质教育课程、不同年龄段的学习规划等实用内容。代表栏目：'家长必读'、'选课指南'。\n\n【品牌故事类（10%）】转型历程、教研团队介绍、课程研发幕后。\n\n【互动活动类（10%）】线上公开课、亲子挑战赛、学习打卡等。", order: 6 },
      { id: "media", title: "投放策略", content: "月度投放预算15万（教育行业投放受限，以内容营销为主）：\n\n【微信广告（6万/月）】\n- 朋友圈广告：体验课引流，定向25-45岁家长\n- 公众号互选广告：与教育类大号合作\n- 目标：体验课报名成本<80元\n\n【知乎推广（4.5万/月）】\n- 知+推广：优质回答加热\n- 品牌提问：教育话题植入\n- 目标：单篇阅读成本<0.5元\n\n【小红书（4.5万/月）】\n- 薯条推广：家长笔记加热\n- 聚光平台：搜索广告\n- 目标：笔记互动成本<5元\n\n注：教育行业广告投放需严格遵守《关于进一步减轻义务教育阶段学生作业负担和校外培训负担的意见》相关规定。", order: 7 },
      { id: "rhythm", title: "阶段节奏", content: "【第1个月：品牌焕新期】\n- 品牌视觉升级（Logo微调+VI更新）\n- 官网和公众号改版\n- 创始人转型故事系列内容上线\n- 知乎机构号启动运营\n- 首批家长口碑笔记产出\n\n【第2个月：内容爆发期】\n- 公众号恢复日更节奏\n- 知乎教育话题回答密集产出\n- 小红书家长笔记规模化\n- 启动线上公开课活动\n- 微信广告投放测试\n\n【第3个月：口碑裂变期】\n- 老带新活动上线\n- 学员成果展示活动\n- 全渠道投放优化\n- 冲刺月新增1500付费用户\n- 输出项目复盘报告", order: 8 },
      { id: "team", title: "团队配置", content: "项目团队配置（我方投入）：\n\n【项目管理】项目经理1人\n\n【内容团队】资深教育编辑1人（公众号+知乎）、新媒体运营1人（小红书+视频号）\n\n【设计】平面设计师1人（品牌物料+内容配图）\n\n【投放】投放优化师1人\n\n合计：5人团队，月人力成本约9万元。\n\n客户方需配合：教研负责人1人（课程内容审核）、学员运营1人（家长口碑素材收集）。", order: 9 },
      { id: "kpi", title: "KPI 建议", content: "核心KPI体系：\n\n| 指标类别 | KPI指标 | 基线值 | 目标值 | 考核周期 |\n|---------|---------|--------|--------|---------|\n| 获客 | 月新增付费用户 | 500 | 1500 | 月度 |\n| 获客 | 获客成本 | 350元 | 200元 | 月度 |\n| 品牌 | 素质教育关联度 | 10% | 50% | 季度 |\n| 内容 | 公众号篇均阅读 | 1500 | 5000 | 月度 |\n| 内容 | 知乎回答Top10 | 0 | 5篇 | 季度 |\n| 口碑 | 小红书品牌笔记 | 200 | 2000 | 季度 |\n| 口碑 | 好评率 | 85% | 90% | 月度 |", order: 10 },
      { id: "boundary", title: "服务边界", content: "【服务范围内】\n- 品牌视觉焕新（Logo微调+VI更新+官网改版）\n- 微信生态内容运营（公众号+视频号+社群）\n- 知乎机构号运营与内容产出\n- 小红书家长口碑运营\n- 微信/知乎/小红书广告投放\n- 月度数据分析与策略优化报告\n\n【服务范围外】\n- 课程研发与教学内容制作\n- 技术平台开发与维护\n- 线下活动策划与执行\n- 客服体系与学员服务\n- 教师招聘与培训", order: 11 },
      { id: "risk", title: "风险提示", content: "【合规风险】\n1. 教育广告合规：需严格遵守双减政策和广告法，所有投放素材需法务审核。应对措施：建立内容合规审核流程，配备法务顾问。\n2. 课程宣传限制：不得进行虚假宣传和过度承诺。应对措施：以真实学员案例和教育理念为主，避免效果承诺。\n\n【执行风险】\n3. 家长口碑管理：负面评价可能被放大传播。应对措施：建立舆情监控和快速响应机制。\n4. 内容质量控制：教育内容需要专业审核。应对措施：所有内容经教研团队审核后发布。\n\n【商业风险】\n5. 政策变动风险：教育行业政策可能进一步收紧。应对措施：保持政策敏感度，预留调整空间。", order: 12 },
    ],
    feasibilityStatus: "warning", feasibilityNotes: ["教育行业合规风险需法务预审", "尽调完整度不足"],
    versionNote: "初版方案，需法务审核后调整",
    createdAt: "2024-03-22", updatedAt: "2024-03-26",
  },
  5: {
    id: 5, opportunityId: 5, proposalName: "绿源健康品牌全案方案",
    proposalType: "全域版", version: 1, isActive: true,
    serviceCycleMonths: 12, coreGoals: ["品牌年销售额突破3亿", "线上渠道占比提升至40%", "建立健康生活方式品牌IP"],
    majorPlatforms: ["抖音", "小红书", "微信视频号", "京东"],
    strategyPath: "健康科普建信任 → KOL矩阵种草 → 全域精准转化",
    serviceBoundary: "不含线下药房渠道管理、不含产品研发",
    suggestedAdBudget: 600000, includesAgencyOperation: true,
    modules: [
      { id: "situation", title: "客户现状", content: "绿源健康科技成立于2015年，是国内知名的保健品品牌，主营维生素、益生菌、鱼油三大品类。年营收约2.5亿元，线下药房渠道占比60%，线上渠道（天猫+京东）占比40%。品牌在35岁以上中老年群体中有一定认知度，但在年轻消费者（25-35岁）中认知度低。现有营销团队8人，以传统广告投放为主，数字营销能力较弱。面临汤臣倍健、Swisse等品牌的激烈竞争。", order: 0 },
      { id: "insight", title: "行业洞察", content: "2024年中国保健品市场规模预计达3200亿元，年增长率12%。年轻化趋势明显，25-35岁消费者占比从2020年的18%提升至2024年的32%。'朋克养生'成为年轻人生活方式，抖音'养生'话题播放量超500亿次。小红书'保健品推荐'笔记超800万篇。消费者对保健品的决策更加理性，成分透明度和科学背书成为关键购买因素。直播电商成为保健品重要销售渠道，抖音保健品GMV年增长超100%。", order: 1 },
      { id: "problem", title: "核心问题", content: "1. 品牌老化：品牌形象偏传统，在年轻消费者中缺乏吸引力，被视为'爸妈吃的品牌'。\n2. 线上渠道薄弱：天猫/京东店铺月销约800万，但缺乏自播能力，完全依赖平台自然流量。\n3. 内容营销缺失：没有系统化的健康科普内容输出，品牌在社交媒体上几乎没有声量。\n4. 广告合规风险：保健品广告受到严格监管，传统广告投放受限，需要找到合规的营销方式。\n5. 竞品压制：汤臣倍健和Swisse在线上投入巨大，绿源在搜索和推荐流量上处于劣势。", order: 2 },
      { id: "goal", title: "营销目标", content: "核心目标（12个月周期）：\n\n【销售目标】年销售额从2.5亿提升至3亿（+20%），线上渠道月销从800万提升至1500万。\n\n【品牌目标】25-35岁消费者品牌认知度从5%提升至20%，抖音品牌相关视频播放量突破1亿。\n\n【渠道目标】线上渠道占比从40%提升至50%，抖音自播月GMV突破500万。\n\n【内容目标】小红书品牌相关笔记从5000篇增长至3万篇，建立'绿源健康生活'品牌IP。", order: 3 },
      { id: "strategy", title: "核心策略", content: "采用'健康科普建信任 → KOL矩阵种草 → 全域精准转化'三步走策略：\n\n【第一步：健康科普建信任】打造'绿源健康研究所'IP，邀请营养师、医学专家参与内容创作，产出维生素知识、肠道健康、心血管保养等科普内容。用专业内容建立品牌信任，规避保健品广告合规风险。\n\n【第二步：KOL矩阵种草】构建健康生活方式KOL合作矩阵——健身博主推荐运动营养补充、美容博主推荐内服美容、育儿博主推荐儿童营养。通过场景化种草，让保健品融入年轻人的日常生活。\n\n【第三步：全域精准转化】抖音自播+千川投放+京东搜索广告三管齐下，将种草流量高效转化为销售。同步搭建私域会员体系，通过健康管理服务提升复购。", order: 4 },
      { id: "channel", title: "渠道组合", content: "【抖音（占比40%）】\n- 短视频：日更3-5条，健康科普+产品种草\n- 自播：矩阵2个直播间，日播12小时\n- 达人合作：月合作健康/美容/健身KOL 20-30位\n- 投放：千川信息流，月预算24万\n\n【小红书（占比25%）】\n- 笔记：月产出300+篇（含达人合作）\n- 类型：成分解析、服用指南、效果分享\n- 投放：聚光平台，月预算15万\n\n【京东（占比20%）】\n- 搜索广告：品类词+品牌词\n- 京东直播：每周2场品牌专场\n- 投放：京准通，月预算12万\n\n【微信视频号（占比15%）】\n- 短视频：健康知识科普\n- 直播：专家健康讲座\n- 私域：企微健康管理社群", order: 5 },
      { id: "content", title: "内容策略", content: "内容矩阵规划：\n\n【健康科普类（30%）】维生素功效解析、肠道健康知识、心血管保养等专业内容。代表栏目：'绿源健康研究所'、'营养师说'。\n\n【场景种草类（25%）】健身后营养补充、加班族养生、换季保养等场景化内容。代表栏目：'健康日常'、'养生新青年'。\n\n【产品测评类（20%）】成分对比、服用体验、效果追踪等真实测评。代表栏目：'成分透明计划'、'30天打卡'。\n\n【专家背书类（15%）】营养师推荐、医学科普、学术研究解读。\n\n【用户故事类（10%）】真实用户的健康改善故事和生活方式分享。", order: 6 },
      { id: "media", title: "投放策略", content: "月度投放预算60万，分配如下：\n\n【抖音千川（24万/月）】\n- 短视频引流：60%，健康科普类素材\n- 直播间投流：30%，自播间引流\n- 搜索广告：10%，品类关键词\n- 目标ROI：1:3以上\n\n【小红书聚光（15万/月）】\n- 信息流：70%，推广高互动笔记\n- 搜索：30%，品类词竞价\n- 目标：笔记互动成本<4元\n\n【京东京准通（12万/月）】\n- 搜索广告：品类词+品牌词\n- 推荐广告：相似商品定向\n- 目标：ROAS>1:4\n\n【微信广告（9万/月）】\n- 朋友圈广告+视频号投流\n- 目标：私域引流成本<15元", order: 7 },
      { id: "rhythm", title: "阶段节奏", content: "【Q1（第1-3月）：基建期】\n- 搭建内容团队和直播团队\n- 打造'绿源健康研究所'IP\n- 启动抖音账号和自播测试\n- 首批KOL合作上线\n\n【Q2（第4-6月）：起量期】\n- 内容矩阵满负荷运转\n- 抖音自播进入稳定期\n- 618大促全域冲刺\n- 私域用户突破3万\n\n【Q3（第7-9月）：深耕期】\n- 头部健康KOL合作\n- 京东渠道重点突破\n- 双11预热内容储备\n- 线上月销突破1200万\n\n【Q4（第10-12月）：收官期】\n- 双11/双12大促冲刺\n- 年度品牌IP活动\n- 冲刺年销3亿目标\n- 沉淀方法论", order: 8 },
      { id: "team", title: "团队配置", content: "项目团队配置（我方投入）：\n\n【项目管理】项目总监1人、项目经理1人\n\n【内容团队】内容策划2人、短视频编导2人、平面设计1人\n\n【达人运营】达人BD经理1人、达人运营专员1人\n\n【直播团队】直播运营主管1人、主播2人、场控1人\n\n【投放团队】投放优化师2人（抖音+京东）、数据分析师1人\n\n【私域运营】私域运营专员1人\n\n合计：17人团队，月人力成本约28万元。", order: 9 },
      { id: "kpi", title: "KPI 建议", content: "核心KPI体系：\n\n| 指标类别 | KPI指标 | 基线值 | 目标值 | 考核周期 |\n|---------|---------|--------|--------|---------|\n| 销售 | 年销售额 | 2.5亿 | 3亿 | 年度 |\n| 销售 | 线上月销 | 800万 | 1500万 | 月度 |\n| 品牌 | 年轻人认知度 | 5% | 20% | 季度 |\n| 品牌 | 抖音视频播放 | 0 | 1亿 | 年度 |\n| 渠道 | 线上占比 | 40% | 50% | 季度 |\n| 渠道 | 抖音自播GMV | 0 | 500万/月 | 月度 |\n| 内容 | 小红书笔记 | 5000 | 3万 | 季度 |", order: 10 },
      { id: "boundary", title: "服务边界", content: "【服务范围内】\n- 全平台内容策划与执行（抖音/小红书/京东/视频号）\n- KOL招募与合作管理\n- 抖音自播运营（含主播团队）\n- 全渠道广告投放与优化\n- 私域会员体系搭建与运营\n- 月度/季度数据分析报告\n\n【服务范围外】\n- 线下药房渠道管理\n- 产品研发与配方调整\n- 药监局注册与备案\n- 电商平台店铺日常运营\n- 物流仓储与客服", order: 11 },
      { id: "risk", title: "风险提示", content: "【合规风险】\n1. 保健品广告合规：严格遵守《保健食品广告审查暂行规定》，不得宣传治疗功效。应对措施：所有内容经法务和医学顾问双重审核。\n2. 功效宣称风险：科普内容需避免暗示产品治疗效果。应对措施：以健康知识科普为主，产品信息以成分和营养价值为切入点。\n\n【执行风险】\n3. 专家合作风险：医学专家参与内容创作需要严格的合规审核。应对措施：建立专家内容审核流程。\n4. 竞品反应风险：汤臣倍健等可能加大线上投入。应对措施：差异化定位，避免正面价格竞争。\n\n【商业风险】\n5. 政策风险：保健品行业监管可能进一步收紧。应对措施：保持政策敏感度，预留合规调整空间。", order: 12 },
    ],
    feasibilityStatus: "pass", feasibilityNotes: [],
    versionNote: "初版全案方案",
    createdAt: "2024-03-10", updatedAt: "2024-03-28",
  },
  6: {
    id: 6, opportunityId: 6, proposalName: "BeautyX 抖音专项推广方案",
    proposalType: "基础版", version: 1, isActive: true,
    serviceCycleMonths: 3, coreGoals: ["抖音月GMV突破500万", "自播占比提升至60%", "爆品打造1-2个"],
    majorPlatforms: ["抖音"],
    strategyPath: "爆品内容打造 → 达人矩阵放大 → 自播承接转化",
    serviceBoundary: "仅限抖音平台，不含其他渠道",
    suggestedAdBudget: 150000, includesAgencyOperation: true,
    modules: [
      { id: "situation", title: "客户现状", content: "BeautyX 在抖音渠道已有一定基础，目前月GMV约200万，其中达人带货占70%、自播占30%。品牌抖音号粉丝12万，日均直播8小时，但自播转化率偏低（1.2%），低于美妆行业平均2.5%。短视频内容以产品展示为主，缺乏创意和差异化，平均播放量仅5000次。千川投放ROI为1:2.3，低于预期的1:3.5。本次专项旨在3个月内实现抖音渠道的突破性增长。", order: 0 },
      { id: "insight", title: "行业洞察", content: "2024年抖音美妆GMV预计突破3000亿元，同比增长35%。美妆品牌自播占比持续提升，头部品牌自播GMV占比已超60%。短视频种草→直播转化的链路效率持续优化，优质短视频可为直播间带来3-5倍的自然流量。千川投放竞争加剧，但精细化运营仍可获得优质ROI。成分党内容在美妆赛道持续走热，科普类视频完播率高于行业均值30%。", order: 1 },
      { id: "problem", title: "核心问题", content: "1. 自播转化率低：直播间场景单一、主播话术缺乏感染力、货盘结构不合理。\n2. 短视频质量差：内容同质化严重，缺乏爆款基因，自然流量获取能力弱。\n3. 达人依赖度高：70%GMV来自达人，一旦达人合作中断，业绩波动大。\n4. 投放效率低：千川投放以通投为主，缺乏人群包精细化运营和素材AB测试。\n5. 缺乏爆品策略：没有针对抖音渠道的专属爆品打造计划。", order: 2 },
      { id: "goal", title: "营销目标", content: "核心目标（3个月周期）：\n\n【GMV目标】抖音月GMV从200万提升至500万（+150%）。\n\n【自播目标】自播GMV占比从30%提升至60%，自播月GMV突破300万。\n\n【内容目标】短视频平均播放量从5000提升至5万，产出3-5条百万播放爆款。\n\n【效率目标】千川投放ROI从1:2.3提升至1:3.5，自播转化率从1.2%提升至2.5%。\n\n【爆品目标】打造1-2个抖音渠道专属爆品，单品月销突破100万。", order: 3 },
      { id: "strategy", title: "核心策略", content: "采用'爆品内容打造 → 达人矩阵放大 → 自播承接转化'三步走策略：\n\n【第一步：爆品内容打造】选定2-3个潜力单品，围绕成分故事、使用场景、效果对比等角度，批量产出差异化短视频内容。每个单品准备20+条不同角度的素材，通过AB测试筛选爆款基因。\n\n【第二步：达人矩阵放大】将爆品内容通过达人矩阵放大声量。头部达人（2-3位）负责引爆话题，腰部达人（15-20位）负责口碑扩散，素人KOC（50+位）负责真实种草。形成'品牌内容→达人二创→用户UGC'的内容裂变链路。\n\n【第三步：自播承接转化】升级直播间场景（从单一展示升级为实验室/化妆台等场景），优化主播话术（从产品介绍升级为护肤顾问式沟通），重构货盘（引流款+利润款+形象款组合）。用千川精准投流将种草用户引入直播间完成转化。", order: 4 },
      { id: "channel", title: "渠道组合", content: "【抖音（100%）】\n\n短视频矩阵：\n- 品牌主号：日更2-3条，成分科普+产品测评\n- 达人合作号：月产出50+条达人内容\n- 素人UGC：月收集30+条用户真实分享\n\n直播矩阵：\n- 主直播间：日播12小时，主推爆品+新品\n- 成分号直播间：日播8小时，以成分科普+福利为主\n\n投放矩阵：\n- 千川信息流：短视频引流+直播间投流\n- 搜索广告：品牌词+品类词+竞品词\n- 星图达人：头部+腰部+KOC组合", order: 5 },
      { id: "content", title: "内容策略", content: "内容矩阵规划（全部聚焦抖音）：\n\n【成分实验类（30%）】显微镜下看成分、实验室对比测试、成分浓度可视化等硬核科普。目标：完播率>40%，互动率>5%。\n\n【效果对比类（25%）】28天使用对比、不同肤质测试、竞品横评等效果导向内容。目标：转化率>3%。\n\n【场景种草类（20%）】早晚护肤routine、约会急救、换季护肤等场景化内容。目标：播放量>5万。\n\n【达人二创类（15%）】达人使用体验、开箱测评、好物分享。\n\n【用户UGC类（10%）】真实用户的使用分享和效果反馈。", order: 6 },
      { id: "media", title: "投放策略", content: "月度投放预算15万，全部用于抖音：\n\n【千川信息流（9万/月）】\n- 短视频引流：50%，爆款素材放量\n- 直播间投流：40%，精准人群定向\n- 搜索广告：10%，品类关键词\n- 人群策略：核心人群（美妆兴趣+竞品粉丝）、扩展人群（护肤兴趣+25-35女性）\n- 目标ROI：1:3.5\n\n【星图达人（6万/月）】\n- 头部达人：2万/位，月合作1-2位\n- 腰部达人：3000-5000/位，月合作8-10位\n- KOC：产品置换+少量佣金，月合作30+位\n- 目标：达人内容CPM<30元", order: 7 },
      { id: "rhythm", title: "阶段节奏", content: "【第1个月：爆品孵化期】\n- 选定2-3个潜力爆品\n- 批量产出短视频素材（每品20+条）\n- AB测试筛选爆款内容\n- 直播间场景升级\n- 主播话术优化和培训\n\n【第2个月：放量冲刺期】\n- 爆款内容千川放量\n- 达人矩阵全面启动\n- 自播双直播间运营\n- 618预热活动\n- 月GMV冲刺350万\n\n【第3个月：收割巩固期】\n- 618大促全力冲刺\n- 爆品单品月销冲刺100万\n- 自播GMV占比提升至60%\n- 月GMV冲刺500万\n- 输出方法论和SOP", order: 8 },
      { id: "team", title: "团队配置", content: "项目团队配置（我方投入）：\n\n【项目管理】项目经理1人\n\n【内容团队】短视频编导2人（拍摄+剪辑）、内容策划1人\n\n【直播团队】直播运营1人、主播2人（轮班）\n\n【投放团队】千川优化师1人\n\n【达人运营】达人BD专员1人\n\n合计：9人团队，月人力成本约16万元。", order: 9 },
      { id: "kpi", title: "KPI 建议", content: "核心KPI体系：\n\n| 指标类别 | KPI指标 | 基线值 | 目标值 | 考核周期 |\n|---------|---------|--------|--------|---------|\n| GMV | 抖音月GMV | 200万 | 500万 | 月度 |\n| GMV | 自播月GMV | 60万 | 300万 | 月度 |\n| 内容 | 短视频均播 | 5000 | 5万 | 月度 |\n| 内容 | 百万播放爆款 | 0 | 3-5条 | 季度 |\n| 效率 | 千川ROI | 1:2.3 | 1:3.5 | 月度 |\n| 效率 | 自播转化率 | 1.2% | 2.5% | 月度 |\n| 爆品 | 单品月销 | 0 | 100万 | 月度 |", order: 10 },
      { id: "boundary", title: "服务边界", content: "【服务范围内】\n- 抖音短视频内容策划、拍摄与发布\n- 抖音直播间运营（含主播、场控）\n- 千川投放策略制定与执行\n- 达人招募与合作管理\n- 爆品策略制定与执行\n- 周度/月度数据分析报告\n\n【服务范围外】\n- 其他平台（小红书/微信/京东等）运营\n- 产品研发与包装设计\n- 电商平台店铺运营\n- 物流仓储与客服", order: 11 },
      { id: "risk", title: "风险提示", content: "【执行风险】\n1. 爆品不确定性：并非所有产品都能成为爆品，需要快速迭代测试。应对措施：准备3个候选品，快速AB测试，2周内确定主推品。\n2. 直播间流量波动：抖音算法调整可能导致直播间流量波动。应对措施：保持千川投放稳定性，同时优化自然流量获取能力。\n\n【商业风险】\n3. 达人违约风险：达人可能临时取消合作或内容质量不达标。应对措施：签订合作协议，储备备选达人名单。\n4. 平台政策风险：抖音美妆类目政策可能调整。应对措施：保持与平台官方沟通，及时调整策略。", order: 12 },
    ],
    feasibilityStatus: "pass", feasibilityNotes: [],
    versionNote: "抖音专项方案",
    createdAt: "2024-01-15", updatedAt: "2024-03-20",
  },
  7: {
    id: 7, opportunityId: 7, proposalName: "鲜味达小红书种草方案",
    proposalType: "基础版", version: 1, isActive: true,
    serviceCycleMonths: 3, coreGoals: ["小红书品牌笔记破万", "引流订单月增3000单", "品牌搜索量翻倍"],
    majorPlatforms: ["小红书"],
    strategyPath: "美食内容种草 → 达人矩阵扩散 → 搜索截流转化",
    serviceBoundary: "仅限小红书平台",
    suggestedAdBudget: 100000, includesAgencyOperation: false,
    modules: [
      { id: "situation", title: "客户现状", content: "鲜味达在小红书的品牌存在感极弱，品牌相关笔记不足100篇，且多为用户自发的简单晒单。没有官方账号运营，缺乏系统化的内容布局。竞品叮咚买菜在小红书有超过10万篇品牌相关笔记，盒马有超过50万篇。鲜味达的核心优势——2小时极速达和产地直采品质——在小红书上完全没有被传播。", order: 0 },
      { id: "insight", title: "行业洞察", content: "小红书月活用户突破3亿，其中70%为女性用户，25-35岁占比超50%，与生鲜电商核心用户高度重合。'买菜攻略'话题浏览量超5亿次，'生鲜测评'话题浏览量超3亿次。小红书用户的购买决策链路短，从种草到下单平均仅需3天。本地生活类内容在小红书增长迅速，探店和美食类笔记互动率高于平台均值50%。", order: 1 },
      { id: "problem", title: "核心问题", content: "1. 品牌存在感为零：小红书品牌笔记不足100篇，搜索品牌名几乎无结果。\n2. 无官方账号：缺乏品牌阵地，无法承接用户搜索和互动。\n3. 内容策略空白：没有针对小红书的内容规划和达人合作体系。\n4. 竞品领先巨大：叮咚买菜和盒马在小红书的内容积累远超鲜味达。\n5. 转化链路缺失：小红书种草后缺乏高效的转化路径引导用户下单。", order: 2 },
      { id: "goal", title: "营销目标", content: "核心目标（3个月周期）：\n\n【内容目标】品牌相关笔记从100篇增长至10000篇，官方账号粉丝突破5万。\n\n【引流目标】通过小红书引流带来月增3000单新订单。\n\n【品牌目标】品牌搜索量翻倍，品牌提及率在目标城市提升至10%。\n\n【互动目标】品牌笔记平均互动率>5%，产出10+篇万赞爆款笔记。", order: 3 },
      { id: "strategy", title: "核心策略", content: "采用'美食内容种草 → 达人矩阵扩散 → 搜索截流转化'三步走策略：\n\n【第一步：美食内容种草】以'鲜味达食材做出的美味'为核心内容方向，产出食谱教程、食材测评、开箱体验等高质量笔记。官方账号定位为'你的私人买菜顾问'，提供实用的买菜攻略和食材知识。\n\n【第二步：达人矩阵扩散】联合美食博主、家庭主妇KOL、探店达人进行内容合作。重点打造'鲜味达开箱挑战'话题，鼓励用户分享收到食材后的烹饪过程和成品。\n\n【第三步：搜索截流转化】布局'买菜app推荐''生鲜配送哪家好'等搜索关键词，通过SEO优化和聚光投放，截获有购买意向的用户。笔记中植入小程序/App下载引导，完成转化闭环。", order: 4 },
      { id: "channel", title: "渠道组合", content: "【小红书（100%）】\n\n官方账号运营：\n- 日更1-2篇，食谱教程+买菜攻略+食材科普\n- 互动运营：评论回复、话题参与、用户互动\n\n达人合作：\n- 美食博主：月合作15-20位，食谱创作\n- 家庭主妇KOL：月合作20-30位，日常分享\n- 探店达人：月合作5-10位，仓库/产地探访\n\n投放：\n- 薯条：优质笔记加热，月预算4万\n- 聚光：搜索广告+信息流，月预算6万", order: 5 },
      { id: "content", title: "内容策略", content: "内容矩阵规划（全部聚焦小红书）：\n\n【食谱教程类（35%）】用鲜味达食材制作美味菜肴的详细教程，图文并茂。代表栏目：'今晚吃什么'、'10分钟快手菜'。\n\n【开箱测评类（25%）】真实开箱体验，展示食材新鲜度、包装品质、配送速度。代表栏目：'鲜味达开箱'、'生鲜盲测'。\n\n【买菜攻略类（20%）】如何挑选水果、海鲜保鲜技巧、时令食材推荐等实用内容。代表栏目：'买菜小课堂'、'时令好物'。\n\n【省钱分享类（10%）】优惠活动汇总、凑单技巧、新人福利攻略。\n\n【产地溯源类（10%）】产地探访、品控流程、供应链故事。", order: 6 },
      { id: "media", title: "投放策略", content: "月度投放预算10万，全部用于小红书：\n\n【聚光平台（6万/月）】\n- 搜索广告：40%，锁定'买菜app''生鲜配送''水果推荐'等关键词\n- 信息流：60%，推广高互动笔记\n- 定向：25-40岁女性，一二线城市，关注美食/生活\n- 目标：搜索CPC<2元，信息流互动成本<3元\n\n【薯条推广（4万/月）】\n- 加热优质笔记，扩大自然流量\n- 优先加热互动率>5%的笔记\n- 目标：笔记曝光量提升3-5倍", order: 7 },
      { id: "rhythm", title: "阶段节奏", content: "【第1个月：建号起量期】\n- 开设官方账号并完成装修\n- 产出首批30篇高质量笔记\n- 启动首批达人合作（20位KOC）\n- 聚光投放测试\n\n【第2个月：爆发增长期】\n- 达人合作规模化（50+位/月）\n- 发起'鲜味达开箱挑战'话题\n- 聚光投放放量\n- 品牌笔记突破5000篇\n\n【第3个月：收割转化期】\n- 搜索广告全面布局\n- 转化链路优化\n- 冲刺月引流3000单\n- 品牌笔记突破10000篇\n- 输出复盘报告", order: 8 },
      { id: "team", title: "团队配置", content: "项目团队配置（我方投入）：\n\n【项目管理】项目经理1人\n\n【内容团队】小红书运营1人（官方账号）、内容策划1人（达人brief）\n\n【达人运营】达人BD专员1人\n\n【投放】投放优化师1人（聚光+薯条）\n\n合计：5人团队，月人力成本约9万元。", order: 9 },
      { id: "kpi", title: "KPI 建议", content: "核心KPI体系：\n\n| 指标类别 | KPI指标 | 基线值 | 目标值 | 考核周期 |\n|---------|---------|--------|--------|---------|\n| 内容 | 品牌笔记数 | 100 | 10000 | 季度 |\n| 内容 | 官方号粉丝 | 0 | 5万 | 季度 |\n| 引流 | 月引流订单 | 0 | 3000 | 月度 |\n| 品牌 | 品牌搜索量 | 基线 | 翻倍 | 月度 |\n| 互动 | 笔记互动率 | - | >5% | 月度 |\n| 互动 | 万赞爆款 | 0 | 10+ | 季度 |", order: 10 },
      { id: "boundary", title: "服务边界", content: "【服务范围内】\n- 小红书官方账号运营\n- 达人招募与合作管理\n- 聚光+薯条投放\n- 内容策划与brief撰写\n- 月度数据分析报告\n\n【服务范围外】\n- 其他平台运营\n- 产品包装设计\n- 物流配送\n- 客服体系", order: 11 },
      { id: "risk", title: "风险提示", content: "【执行风险】\n1. 内容同质化：生鲜类内容容易同质化。应对措施：强调鲜味达的差异化卖点（2小时达、产地直采），打造独特内容风格。\n2. 达人配合度：部分达人可能内容质量不达标。应对措施：严格brief审核，建立达人评级体系。\n\n【商业风险】\n3. 转化链路长：小红书到App下单的链路较长。应对措施：优化引导话术，提供专属优惠码降低决策门槛。\n4. 竞品内容围剿：叮咚买菜等可能加大小红书投入。应对措施：聚焦差异化内容，避免正面竞争。", order: 12 },
    ],
    feasibilityStatus: "pass", feasibilityNotes: [],
    versionNote: "小红书专项方案",
    createdAt: "2024-01-10", updatedAt: "2024-02-28",
  },
};

export const mockQuotations: Record<number, Quotation> = {
  4: {
    id: 1, opportunityId: 4, proposalVersionId: 4, quotationCode: "QUO-2024-004",
    packageType: "增长版", serviceCycleMonths: 12,
    items: [
      { label: "基础服务费", amount: 120000 },
      { label: "内容生产费", amount: 80000 },
      { label: "投放管理费", amount: 60000 },
      { label: "技术服务费", amount: 20000 },
      { label: "项目管理费", amount: 20000 },
    ],
    originalPrice: 300000, discountRate: 90, finalPrice: 270000,
    grossMarginRate: 38, paymentTerm: "季付", accountPeriodDays: 30,
    specialTerms: "", validUntil: "2024-04-30",
    status: "draft", approvalTriggers: [],
    createdAt: "2024-03-29",
  },
  5: {
    id: 2, opportunityId: 5, proposalVersionId: 5, quotationCode: "QUO-2024-005",
    packageType: "全域版", serviceCycleMonths: 6,
    items: [
      { label: "基础服务费", amount: 200000 },
      { label: "内容生产费", amount: 150000 },
      { label: "投放管理费", amount: 100000 },
      { label: "技术服务费", amount: 30000 },
      { label: "项目管理费", amount: 30000 },
      { label: "附加资源费", amount: 40000 },
    ],
    originalPrice: 550000, discountRate: 78, finalPrice: 429000,
    grossMarginRate: 28, paymentTerm: "月付", accountPeriodDays: 45,
    specialTerms: "首月免服务费作为试用期",
    validUntil: "2024-04-15",
    status: "pending_approval",
    approvalTriggers: ["折扣低于80%（当前78%）", "毛利率低于30%（当前28%）", "账期超过30天（当前45天）", "包含特殊条款"],
    createdAt: "2024-03-28",
  },
};

export const mockApprovals: ApprovalRecord[] = [
  {
    id: 1, type: "报价审批", approvalType: "报价审批", sourceType: "quotation", sourceId: 2,
    sourceName: "QUO-2024-005 绿源健康全案报价", opportunityId: 5, opportunityName: "绿源健康品牌全案",
    quotationCode: "QUO-2024-005", applicant: "李策略", currentNode: "财务审核",
    triggerReasons: ["折扣低于80%（当前78%）", "毛利率低于30%（当前28%）", "账期超过30天（当前45天）", "包含特殊条款：首月免服务费"],
    triggerRules: ["折扣低于80%", "毛利率低于30%", "账期超过30天", "包含特殊条款"],
    originalPrice: 550000, discountRate: 78, finalPrice: 429000, grossMarginRate: 28,
    status: "pending",
    approvalChain: [
      { approverName: "王部门", role: "部门负责人", status: "approved", comment: "客户战略价值高，同意特殊折扣", timestamp: "2024-03-29 10:30" },
      { approverName: "赵财务", role: "财务", status: "pending" },
      { approverName: "周总", role: "管理层", status: "pending" },
    ],
    opinions: [
      { approver: "王部门", role: "部门负责人", action: "通过", comment: "客户战略价值高，同意特殊折扣", time: "2024-03-29 10:30" },
    ],
    createdAt: "2024-03-28 15:00",
  },
  {
    id: 2, type: "法务预审", approvalType: "法务预审", sourceType: "due_diligence", sourceId: 3,
    sourceName: "云启教育科技尽调", opportunityId: 3, opportunityName: "云启教育品牌升级",
    quotationCode: "", applicant: "张销售", currentNode: "法务审核",
    triggerReasons: ["高合规风险行业（教育）", "K12行业广告投放受限"],
    triggerRules: ["高合规风险行业（教育）"],
    originalPrice: 0, discountRate: 100, finalPrice: 0, grossMarginRate: 0,
    status: "pending",
    approvalChain: [
      { approverName: "法务部", role: "法务", status: "pending" },
    ],
    opinions: [],
    createdAt: "2024-03-26 09:00",
  },
  {
    id: 3, type: "报价审批", approvalType: "报价审批", sourceType: "quotation", sourceId: 3,
    sourceName: "QUO-2024-006 BeautyX 抖音专项报价", opportunityId: 6, opportunityName: "BeautyX 抖音专项",
    quotationCode: "QUO-2024-006", applicant: "张销售", currentNode: "已完成",
    triggerReasons: ["折扣低于90%（当前85%）"],
    triggerRules: ["折扣低于90%"],
    originalPrice: 180000, discountRate: 85, finalPrice: 153000, grossMarginRate: 42,
    status: "approved",
    approvalChain: [
      { approverName: "王部门", role: "部门负责人", status: "approved", comment: "标准折扣范围内", timestamp: "2024-03-20 14:00" },
      { approverName: "赵财务", role: "财务", status: "approved", comment: "毛利率达标", timestamp: "2024-03-21 09:30" },
    ],
    finalComment: "审批通过，折扣和毛利率均在合理范围内",
    opinions: [
      { approver: "王部门", role: "部门负责人", action: "通过", comment: "标准折扣范围内", time: "2024-03-20 14:00" },
      { approver: "赵财务", role: "财务", action: "通过", comment: "毛利率达标", time: "2024-03-21 09:30" },
    ],
    createdAt: "2024-03-19 16:00",
  },
  {
    id: 4, type: "方案审批", approvalType: "方案审批", sourceType: "proposal", sourceId: 1,
    sourceName: "BeautyX 2024 全案营销方案 v2", opportunityId: 1, opportunityName: "BeautyX 2024 全案营销",
    quotationCode: "", applicant: "王方案", currentNode: "已完成",
    triggerReasons: ["非标方案（全域版）"],
    triggerRules: ["非标方案（全域版）"],
    originalPrice: 0, discountRate: 100, finalPrice: 0, grossMarginRate: 0,
    status: "approved",
    approvalChain: [
      { approverName: "王部门", role: "部门负责人", status: "approved", comment: "方案完整度高，策略清晰", timestamp: "2024-03-22 11:00" },
    ],
    finalComment: "方案完整度高，策略清晰，同意通过",
    opinions: [
      { approver: "王部门", role: "部门负责人", action: "通过", comment: "方案完整度高，策略清晰", time: "2024-03-22 11:00" },
    ],
    createdAt: "2024-03-21 10:00",
  },
];

export const mockFollowUps: Record<number, FollowUpRecord[]> = {
  1: [
    { id: 1, opportunityId: 1, type: "电话沟通", content: "与CMO王芳确认了2024年营销预算和核心KPI", objection: "客户希望能看到更多同行业案例", nextAction: "准备美妆行业案例集", createdBy: "张销售", createdAt: "2024-03-28 14:00", nextFollowUpDate: "2024-04-02" },
    { id: 2, opportunityId: 1, type: "方案沟通", content: "提交方案v2版本，客户对渠道组合基本认可", objection: "对视频号投入产出比有疑虑", nextAction: "补充视频号ROI数据", createdBy: "王方案", createdAt: "2024-03-25 10:00" },
    { id: 3, opportunityId: 1, type: "客户拜访", content: "拜访BeautyX总部，参观产品线和内容团队", objection: "", nextAction: "启动尽调信息采集", createdBy: "张销售", createdAt: "2024-03-05 16:00" },
  ],
  2: [
    { id: 4, opportunityId: 2, type: "线上会议", content: "与创始人李明讨论全国扩张计划", objection: "担心投放成本过高", nextAction: "提供分阶段预算方案", createdBy: "李策略", createdAt: "2024-03-25 15:00", nextFollowUpDate: "2024-04-01" },
  ],
};

// ==================== 工商信息模拟数据 ====================

export const mockBusinessIntelligence: Record<number, BusinessIntelligence> = {
  1: {
    registration: {
      companyName: "BeautyX 美妆科技有限公司",
      legalRepresentative: "张明远",
      registeredCapital: "5000万人民币",
      paidInCapital: "3500万人民币",
      establishDate: "2019-03-15",
      operatingStatus: "存续（在营、开业、在册）",
      unifiedSocialCreditCode: "91310115MA1K4XYZ0A",
      registrationAuthority: "上海市浦东新区市场监督管理局",
      businessScope: "化妆品研发、生产、销售；日用百货销售；电子商务；进出口业务",
      companyType: "有限责任公司（自然人投资或控股）",
      registeredAddress: "上海市浦东新区张江高科技园区碧波路690号",
      approvalDate: "2019-03-15",
      operatingPeriod: "2019-03-15 至 2049-03-14",
      taxNumber: "91310115MA1K4XYZ0A",
      industryCategory: "化妆品制造",
    },
    shareholders: [
      { name: "张明远", type: "自然人", investmentAmount: "2500万", investmentRatio: 50, subscriptionDate: "2019-03-15" },
      { name: "上海星辰创投合伙企业", type: "企业法人", investmentAmount: "1500万", investmentRatio: 30, subscriptionDate: "2020-06-01" },
      { name: "王芳", type: "自然人", investmentAmount: "1000万", investmentRatio: 20, subscriptionDate: "2019-03-15" },
    ],
    associatedCompanies: [
      { name: "上海星辰创投合伙企业", relationship: "股东", registeredCapital: "2亿", operatingStatus: "存续", legalRepresentative: "陈星辰", riskLevel: "low" },
      { name: "BeautyX 香港国际有限公司", relationship: "对外投资", registeredCapital: "100万港币", operatingStatus: "存续", legalRepresentative: "张明远", riskLevel: "low" },
      { name: "杭州美研生物科技有限公司", relationship: "对外投资", registeredCapital: "800万", operatingStatus: "存续", legalRepresentative: "刘研", riskLevel: "low" },
    ],
    risks: [
      { id: 1, category: "司法诉讼", severity: "info", title: "商标侵权纠纷（原告）", detail: "BeautyX 美妆科技有限公司 vs 某仿冒品牌，涉及商标侵权，案件已结案，我方胜诉。", source: "中国裁判文书网", date: "2023-08-15", status: "已结案" },
    ],
    queryTime: "2024-03-28 14:30:00",
    dataSource: "国家企业信用信息公示系统 / 天眼查",
  },
  2: {
    registration: {
      companyName: "鲜味达生鲜科技有限公司",
      legalRepresentative: "李明",
      registeredCapital: "2000万人民币",
      paidInCapital: "1200万人民币",
      establishDate: "2021-05-20",
      operatingStatus: "存续（在营、开业、在册）",
      unifiedSocialCreditCode: "91440300MA5FXYZ123",
      registrationAuthority: "深圳市市场监督管理局",
      businessScope: "食品销售；生鲜配送；冷链物流；电子商务",
      companyType: "有限责任公司（自然人投资或控股）",
      registeredAddress: "深圳市南山区科技园南区数字技术园A座",
      approvalDate: "2021-05-20",
      operatingPeriod: "2021-05-20 至 2051-05-19",
      taxNumber: "91440300MA5FXYZ123",
      industryCategory: "食品零售",
    },
    shareholders: [
      { name: "李明", type: "自然人", investmentAmount: "1000万", investmentRatio: 50, subscriptionDate: "2021-05-20" },
      { name: "深圳前海鲜生投资有限公司", type: "企业法人", investmentAmount: "800万", investmentRatio: 40, subscriptionDate: "2022-01-10" },
      { name: "赵志强", type: "自然人", investmentAmount: "200万", investmentRatio: 10, subscriptionDate: "2021-05-20" },
    ],
    associatedCompanies: [
      { name: "深圳前海鲜生投资有限公司", relationship: "股东", registeredCapital: "5000万", operatingStatus: "存续", legalRepresentative: "黄海", riskLevel: "low" },
      { name: "鲜味达（广州）冷链物流有限公司", relationship: "全资子公司", registeredCapital: "500万", operatingStatus: "存续", legalRepresentative: "李明", riskLevel: "low" },
    ],
    risks: [
      { id: 1, category: "行政处罚", severity: "warning", title: "食品标签不规范", detail: "2023年6月因部分产品标签信息不完整被市场监管局处以警告并罚款5000元，已整改完成。", source: "国家企业信用信息公示系统", date: "2023-06-10", status: "已消除" },
      { id: 2, category: "经营异常", severity: "info", title: "地址变更未及时备案", detail: "2022年12月因办公地址变更未及时备案被列入经营异常名录，已于2023年1月移出。", source: "国家企业信用信息公示系统", date: "2022-12-15", status: "已消除" },
    ],
    queryTime: "2024-03-27 10:15:00",
    dataSource: "国家企业信用信息公示系统 / 天眼查",
  },
  3: {
    registration: {
      companyName: "云启教育科技有限公司",
      legalRepresentative: "陈雪",
      registeredCapital: "3000万人民币",
      paidInCapital: "2000万人民币",
      establishDate: "2018-09-01",
      operatingStatus: "存续（在营、开业、在册）",
      unifiedSocialCreditCode: "91110108MA01XYZ456",
      registrationAuthority: "北京市海淀区市场监督管理局",
      businessScope: "教育咨询；技术开发；在线教育平台运营；出版物零售",
      companyType: "有限责任公司（自然人投资或控股）",
      registeredAddress: "北京市海淀区中关村大街1号",
      approvalDate: "2018-09-01",
      operatingPeriod: "2018-09-01 至 2048-08-31",
      taxNumber: "91110108MA01XYZ456",
      industryCategory: "教育辅助服务",
    },
    shareholders: [
      { name: "陈雪", type: "自然人", investmentAmount: "1200万", investmentRatio: 40, subscriptionDate: "2018-09-01" },
      { name: "北京启明星教育投资有限公司", type: "企业法人", investmentAmount: "1200万", investmentRatio: 40, subscriptionDate: "2019-03-15" },
      { name: "张伟", type: "自然人", investmentAmount: "600万", investmentRatio: 20, subscriptionDate: "2018-09-01" },
    ],
    associatedCompanies: [
      { name: "北京启明星教育投资有限公司", relationship: "股东", registeredCapital: "1亿", operatingStatus: "存续", legalRepresentative: "王启明", riskLevel: "medium" },
      { name: "云启在线（天津）科技有限公司", relationship: "全资子公司", registeredCapital: "500万", operatingStatus: "注销", legalRepresentative: "陈雪", riskLevel: "high" },
      { name: "云启教育咨询（深圳）有限公司", relationship: "控股子公司", registeredCapital: "300万", operatingStatus: "存续", legalRepresentative: "李华", riskLevel: "medium" },
    ],
    risks: [
      { id: 1, category: "行政处罚", severity: "danger", title: "违规开展学科类培训", detail: "2023年3月因违规开展K12学科类线上培训被教育部门处以罚款20万元，责令整改。", source: "教育部门行政处罚公示", date: "2023-03-20", status: "存续" },
      { id: 2, category: "司法诉讼", severity: "warning", title: "劳动仲裁纠纷（被告）", detail: "2023年7月被前员工提起劳动仲裁，涉及未足额支付加班工资，案件进行中。", source: "中国裁判文书网", date: "2023-07-10", status: "进行中" },
      { id: 3, category: "经营异常", severity: "warning", title: "年报信息隐瞒真实情况", detail: "2022年度年报中对外投资信息与实际不符，被列入经营异常名录。", source: "国家企业信用信息公示系统", date: "2023-01-15", status: "存续" },
      { id: 4, category: "税务违规", severity: "danger", title: "欠缴税款", detail: "2023年第三季度存在增值税欠缴情况，税务机关已发出催缴通知。", source: "税务部门公示", date: "2023-10-01", status: "存续" },
      { id: 5, category: "失信被执行", severity: "danger", title: "关联子公司被列为失信被执行人", detail: "全资子公司云启在线（天津）科技有限公司因未履行法院判决被列为失信被执行人。", source: "中国执行信息公开网", date: "2023-11-20", status: "存续" },
    ],
    queryTime: "2024-03-26 09:00:00",
    dataSource: "国家企业信用信息公示系统 / 天眼查",
  },
  4: {
    registration: {
      companyName: "锐行汽车配件股份有限公司",
      legalRepresentative: "张强",
      registeredCapital: "1亿人民币",
      paidInCapital: "8000万人民币",
      establishDate: "2010-01-18",
      operatingStatus: "存续（在营、开业、在册）",
      unifiedSocialCreditCode: "91320500MA1MXYZ789",
      registrationAuthority: "苏州市市场监督管理局",
      businessScope: "汽车零部件研发、制造、销售；进出口业务；汽车维修服务",
      companyType: "股份有限公司（非上市）",
      registeredAddress: "江苏省苏州市工业园区星湖街328号",
      approvalDate: "2010-01-18",
      operatingPeriod: "2010-01-18 至 长期",
      taxNumber: "91320500MA1MXYZ789",
      industryCategory: "汽车零部件及配件制造",
    },
    shareholders: [
      { name: "张强", type: "自然人", investmentAmount: "4000万", investmentRatio: 40, subscriptionDate: "2010-01-18" },
      { name: "苏州工业园区产业基金", type: "企业法人", investmentAmount: "3000万", investmentRatio: 30, subscriptionDate: "2015-06-01" },
      { name: "李建国", type: "自然人", investmentAmount: "2000万", investmentRatio: 20, subscriptionDate: "2010-01-18" },
      { name: "员工持股平台", type: "其他", investmentAmount: "1000万", investmentRatio: 10, subscriptionDate: "2020-01-01" },
    ],
    associatedCompanies: [
      { name: "苏州工业园区产业基金", relationship: "股东", registeredCapital: "50亿", operatingStatus: "存续", legalRepresentative: "周国强", riskLevel: "low" },
      { name: "锐行汽配（德国）GmbH", relationship: "对外投资", registeredCapital: "50万欧元", operatingStatus: "存续", legalRepresentative: "张强", riskLevel: "low" },
      { name: "苏州锐行新能源科技有限公司", relationship: "控股子公司", registeredCapital: "2000万", operatingStatus: "存续", legalRepresentative: "李建国", riskLevel: "low" },
    ],
    risks: [],
    queryTime: "2024-03-29 16:00:00",
    dataSource: "国家企业信用信息公示系统 / 天眼查",
  },
  5: {
    registration: {
      companyName: "绿源健康科技有限公司",
      legalRepresentative: "周伟",
      registeredCapital: "8000万人民币",
      paidInCapital: "6000万人民币",
      establishDate: "2015-06-12",
      operatingStatus: "存续（在营、开业、在册）",
      unifiedSocialCreditCode: "91330100MA27XYZ321",
      registrationAuthority: "杭州市市场监督管理局",
      businessScope: "保健食品研发、生产、销售；食品经营；健康咨询；进出口业务",
      companyType: "有限责任公司（自然人投资或控股）",
      registeredAddress: "浙江省杭州市余杭区未来科技城海创园",
      approvalDate: "2015-06-12",
      operatingPeriod: "2015-06-12 至 2045-06-11",
      taxNumber: "91330100MA27XYZ321",
      industryCategory: "保健食品制造",
    },
    shareholders: [
      { name: "周伟", type: "自然人", investmentAmount: "3200万", investmentRatio: 40, subscriptionDate: "2015-06-12" },
      { name: "杭州绿源投资管理有限公司", type: "企业法人", investmentAmount: "2400万", investmentRatio: 30, subscriptionDate: "2017-01-01" },
      { name: "刘丽", type: "自然人", investmentAmount: "1600万", investmentRatio: 20, subscriptionDate: "2015-06-12" },
      { name: "浙江健康产业基金", type: "企业法人", investmentAmount: "800万", investmentRatio: 10, subscriptionDate: "2021-03-01" },
    ],
    associatedCompanies: [
      { name: "杭州绿源投资管理有限公司", relationship: "股东", registeredCapital: "5000万", operatingStatus: "存续", legalRepresentative: "周伟", riskLevel: "low" },
      { name: "绿源健康（广州）生物科技有限公司", relationship: "全资子公司", registeredCapital: "1000万", operatingStatus: "存续", legalRepresentative: "刘丽", riskLevel: "low" },
    ],
    risks: [
      { id: 1, category: "行政处罚", severity: "warning", title: "保健品广告违规", detail: "2023年5月因保健品广告中含有夸大功效的表述被市场监管局处以罚款10万元。", source: "市场监管总局行政处罚信息公示", date: "2023-05-15", status: "已消除" },
      { id: 2, category: "行政处罚", severity: "danger", title: "产品标签宣称功效不合规", detail: "2024年1月因部分产品标签宣称具有治疗功效被责令整改，罚款15万元。整改进行中。", source: "市场监管总局行政处罚信息公示", date: "2024-01-20", status: "存续" },
    ],
    queryTime: "2024-03-28 11:00:00",
    dataSource: "国家企业信用信息公示系统 / 天眼查",
  },
};

// 工商查询风险等级计算
export function calculateBusinessRiskLevel(risks: RiskItem[]): { level: Risk; score: number; summary: string } {
  const activeRisks = risks.filter(r => r.status === "存续" || r.status === "进行中");
  const dangerCount = activeRisks.filter(r => r.severity === "danger").length;
  const warningCount = activeRisks.filter(r => r.severity === "warning").length;
  
  let score = 100;
  score -= dangerCount * 25;
  score -= warningCount * 10;
  score -= (risks.length - activeRisks.length) * 3; // 历史风险轻微扣分
  score = Math.max(0, Math.min(100, score));
  
  let level: Risk = "low";
  let summary = "企业信用良好，无重大风险";
  
  if (dangerCount >= 2 || score < 40) {
    level = "high";
    summary = `存在 ${dangerCount} 项严重风险，建议谨慎评估合作可行性`;
  } else if (dangerCount >= 1 || warningCount >= 2 || score < 70) {
    level = "medium";
    summary = `存在 ${dangerCount + warningCount} 项需关注的风险，建议深入了解后决策`;
  }
  
  return { level, score, summary };
}

// ==================== 业务逻辑 ====================

export function getStageIndex(stage: Stage): number {
  return stageOrder.indexOf(stage);
}

export function canTransitionTo(current: Stage, target: Stage): boolean {
  const transitions: Record<Stage, Stage[]> = {
    new: ["dd_in_progress", "lost"],
    dd_in_progress: ["dd_done", "lost"],
    dd_done: ["diag_in_progress", "lost"],
    diag_in_progress: ["diag_done", "lost"],
    diag_done: ["proposal_in_progress", "lost"],
    proposal_in_progress: ["proposal_done", "lost"],
    proposal_done: ["quote_in_progress", "lost"],
    quote_in_progress: ["approval_in_progress", "waiting_sign", "lost"],
    approval_in_progress: ["waiting_sign", "quote_in_progress", "lost"],
    waiting_sign: ["signed", "lost"],
    signed: [],
    lost: [],
  };
  return transitions[current]?.includes(target) ?? false;
}

export function calculateQuotation(items: QuotationItem[], discountRate: number) {
  const originalPrice = items.reduce((sum, item) => sum + item.amount, 0);
  const finalPrice = Math.round(originalPrice * discountRate / 100);
  return { originalPrice, finalPrice };
}

export function checkApprovalTriggers(
  discountRate: number,
  grossMarginRate: number,
  accountPeriodDays: number,
  specialTerms: string
): string[] {
  const triggers: string[] = [];
  if (discountRate < 80) triggers.push(`折扣低于80%（当前${discountRate}%）`);
  if (grossMarginRate < 30) triggers.push(`毛利率低于30%（当前${grossMarginRate}%）`);
  if (accountPeriodDays > 30) triggers.push(`账期超过30天（当前${accountPeriodDays}天）`);
  if (specialTerms.trim()) triggers.push("包含特殊条款");
  return triggers;
}

// ==================== 合同签约 ====================

export type ContractStatus = "draft" | "reviewing" | "pending_sign" | "signed" | "terminated";

export interface ContractClause {
  id: string;
  title: string;
  content: string;
  isCustom: boolean;
}

export interface Contract {
  id: number;
  opportunityId: number;
  quotationId: number;
  contractCode: string;
  contractName: string;
  partyA: string; // 甲方（我方）
  partyB: string; // 乙方（客户）
  partyBContact: string;
  serviceCycleMonths: number;
  startDate: string;
  endDate: string;
  totalAmount: number;
  paymentSchedule: { milestone: string; percentage: number; amount: number; dueDate: string }[];
  clauses: ContractClause[];
  status: ContractStatus;
  signedByA?: string;
  signedByB?: string;
  signedAtA?: string;
  signedAtB?: string;
  createdAt: string;
  updatedAt: string;
}

export const contractStatusLabel: Record<ContractStatus, string> = {
  draft: "草稿",
  reviewing: "审核中",
  pending_sign: "待签署",
  signed: "已签署",
  terminated: "已终止",
};

export const defaultClauses: ContractClause[] = [
  { id: "c1", title: "服务范围", content: "甲方为乙方提供全案营销服务，包括但不限于品牌策略、内容创作、媒介投放、数据分析等。具体服务内容以附件《服务明细表》为准。", isCustom: false },
  { id: "c2", title: "服务周期", content: "本合同服务周期自生效之日起计算，具体起止日期以合同首页约定为准。", isCustom: false },
  { id: "c3", title: "费用与支付", content: "乙方按照本合同约定的付款计划向甲方支付服务费用。逾期支付的，每日按应付未付金额的0.05%支付违约金。", isCustom: false },
  { id: "c4", title: "知识产权", content: "甲方为乙方创作的营销内容，其知识产权在乙方付清全部费用后归乙方所有。甲方保留将案例用于自身宣传的权利（脱敏处理）。", isCustom: false },
  { id: "c5", title: "保密条款", content: "双方应对合作过程中知悉的对方商业秘密和技术秘密严格保密，保密期限为合同终止后两年。", isCustom: false },
  { id: "c6", title: "违约责任", content: "任何一方违反本合同约定的，应向守约方支付合同总金额10%的违约金，并赔偿由此造成的实际损失。", isCustom: false },
  { id: "c7", title: "争议解决", content: "因本合同引起的争议，双方应协商解决；协商不成的，提交甲方所在地人民法院诉讼解决。", isCustom: false },
  { id: "c8", title: "合同变更与解除", content: "经双方协商一致，可以变更或解除本合同。任何一方提前解除合同的，应提前30日书面通知对方。", isCustom: false },
];

export const mockContracts: Record<number, Contract> = {
  4: {
    id: 1,
    opportunityId: 4,
    quotationId: 1,
    contractCode: "CON-2024-004",
    contractName: "锐行汽配数字化营销服务合同",
    partyA: "Allpause 全案营销有限公司",
    partyB: "锐行汽车配件股份有限公司",
    partyBContact: "张强",
    serviceCycleMonths: 12,
    startDate: "2024-05-01",
    endDate: "2025-04-30",
    totalAmount: 270000,
    paymentSchedule: [
      { milestone: "合同签署", percentage: 30, amount: 81000, dueDate: "2024-05-01" },
      { milestone: "Q1 服务完成", percentage: 25, amount: 67500, dueDate: "2024-07-31" },
      { milestone: "Q2 服务完成", percentage: 25, amount: 67500, dueDate: "2024-10-31" },
      { milestone: "项目结项", percentage: 20, amount: 54000, dueDate: "2025-04-30" },
    ],
    clauses: defaultClauses,
    status: "pending_sign",
    createdAt: "2024-04-01",
    updatedAt: "2024-04-05",
  },
  5: {
    id: 2,
    opportunityId: 5,
    quotationId: 2,
    contractCode: "CON-2024-005",
    contractName: "绿源健康品牌全案营销服务合同",
    partyA: "Allpause 全案营销有限公司",
    partyB: "绿源健康科技有限公司",
    partyBContact: "刘丽",
    serviceCycleMonths: 6,
    startDate: "2024-05-15",
    endDate: "2024-11-14",
    totalAmount: 429000,
    paymentSchedule: [
      { milestone: "合同签署", percentage: 30, amount: 128700, dueDate: "2024-05-15" },
      { milestone: "第2个月末", percentage: 25, amount: 107250, dueDate: "2024-07-15" },
      { milestone: "第4个月末", percentage: 25, amount: 107250, dueDate: "2024-09-15" },
      { milestone: "项目结项", percentage: 20, amount: 85800, dueDate: "2024-11-14" },
    ],
    clauses: [
      ...defaultClauses,
      { id: "c9", title: "合规特别条款", content: "鉴于乙方属于保健品行业，甲方在提供营销服务时应严格遵守《广告法》《食品安全法》等相关法律法规，所有营销内容须经乙方法务部门审核后方可发布。", isCustom: true },
    ],
    status: "reviewing",
    createdAt: "2024-04-02",
    updatedAt: "2024-04-06",
  },
};

// ==================== 前期流程阶段准入规则 ====================

export interface StageGateResult {
  canProceed: boolean;
  reasons: string[];
}

export function checkDDGate(opportunityId: number): StageGateResult {
  const dd = mockDueDiligence[opportunityId];
  if (!dd) return { canProceed: false, reasons: ["尚未开始尽调"] };
  const reasons: string[] = [];
  if (dd.completeness < 80) reasons.push(`尽调完整度不足80%（当前${dd.completeness}%）`);
  if (dd.data.complianceRisk === "high") reasons.push("存在高合规风险，需法务预审通过");
  if (dd.data.budgetClarity === "unknown") reasons.push("预算情况不明确");
  return { canProceed: reasons.length === 0, reasons };
}

export function checkDiagnosisGate(opportunityId: number): StageGateResult {
  const diag = mockDiagnoses[opportunityId];
  if (!diag) return { canProceed: false, reasons: ["尚未完成行业诊断"] };
  const reasons: string[] = [];
  if (diag.status !== "submitted") reasons.push("诊断报告尚未提交");
  if (diag.riskLevel === "high") reasons.push("诊断风险等级为高，需管理层确认");
  if (diag.scores.some(s => s.score === 0)) reasons.push("存在未评分的维度");
  return { canProceed: reasons.length === 0, reasons };
}

export function checkProposalGate(opportunityId: number): StageGateResult {
  const proposal = mockProposals[opportunityId];
  if (!proposal) return { canProceed: false, reasons: ["尚未创建全案方案"] };
  const reasons: string[] = [];
  if (proposal.feasibilityStatus === "fail") reasons.push("方案可行性校验未通过");
  if (proposal.modules.some(m => !m.content || m.content.includes("...") )) reasons.push("方案模块内容不完整");
  if (proposal.coreGoals.length === 0) reasons.push("未设定核心目标");
  return { canProceed: reasons.length === 0, reasons };
}

export function checkQuotationGate(opportunityId: number): StageGateResult {
  const quotation = mockQuotations[opportunityId];
  if (!quotation) return { canProceed: false, reasons: ["尚未创建报价单"] };
  const reasons: string[] = [];
  if (quotation.status === "draft") reasons.push("报价单尚未提交");
  if (quotation.status === "pending_approval") reasons.push("报价单正在审批中");
  if (quotation.status === "rejected") reasons.push("报价单审批被驳回");
  return { canProceed: reasons.length === 0, reasons };
}
