/**
 * 天眼查 API 代理服务
 * 封装天眼查开放平台 API 调用，通过后端代理避免 Token 暴露在前端
 */
import axios from "axios";
import { ENV } from "./_core/env";

const TYC_BASE_URL = "https://open.api.tianyancha.com";
const TYC_TOKEN = ENV.tianyanchaToken;

const tycClient = axios.create({
  baseURL: TYC_BASE_URL,
  timeout: 15000,
  headers: {
    Authorization: TYC_TOKEN,
  },
});

// ========== 类型定义 ==========

export interface TycBaseInfo {
  name: string;
  legalPersonName: string;
  regCapital: string;
  regStatus: string;
  creditCode: string;
  estiblishTime: string;
  regLocation: string;
  businessScope: string;
  companyOrgType: string;
  actualCapital: string;
  industry: string;
  fromTime: string;
  toTime: string;
  staffNumRange: string;
  socialStaffNum: number;
  city: string;
  district: string;
  bondName: string;
  isMicroEnt: number;
  usedBondName: string;
  regNumber: string;
  percentileScore: number;
  taxNumber: string;
  tags: string;
  logo: string;
  taxAddress: string;
  regInstitute: string;
  phoneNumber: string;
  email: string;
  websiteList: string;
}

export interface TycShareholder {
  name: string;
  type: number; // 1=人 2=公司
  capitalActl: Array<{ amomon: string; paymet: string; time: string }>;
  capital: Array<{ amomon: string; paymet: string; time: string }>;
  percent: string;
}

export interface TycInvestment {
  name: string;
  legalPersonName: string;
  regCapital: string;
  estiblishTime: string;
  percent: string;
  regStatus: string;
  category: string;
}

export interface TycAbnormal {
  putReason: string;
  putDate: string;
  putDepartment: string;
  removeReason: string;
  removeDate: string;
  removeDepartment: string;
}

export interface TycPunishment {
  punishNumber: string;
  type: string;
  content: string;
  decisionDate: string;
  departmentName: string;
  publishDate: string;
}

export interface TycDishonest {
  caseName: string;
  caseCode: string;
  areaName: string;
  courtName: string;
  duty: string;
  performance: string;
  disrupTypeName: string;
  publishDate: string;
  regDate: string;
}

export interface TycLawsuit {
  title: string;
  caseno: string;
  url: string;
  court: string;
  doctype: string;
  uuid: string;
  submittime: string;
  lawsuitUrl: string;
}

export interface TycSearchResult {
  id: number;
  name: string;
  alias: string;
  legalPersonName: string;
  regStatus: string;
  estiblishTime: string;
  regCapital: string;
  type: number;
  matchType: string;
}

// ========== API 调用函数 ==========

/**
 * 企业搜索（模糊匹配）
 */
export async function searchCompany(keyword: string): Promise<TycSearchResult[]> {
  try {
    const res = await tycClient.get("/services/open/search/2.0", {
      params: { word: keyword, pageSize: 10, pageNum: 1 },
    });
    if (res.data?.error_code === 0) {
      return res.data.result?.items ?? [];
    }
    console.error("[TYC] searchCompany error:", res.data);
    return [];
  } catch (err) {
    console.error("[TYC] searchCompany request failed:", err);
    return [];
  }
}

/**
 * 企业基本信息
 */
export async function getBaseInfo(keyword: string): Promise<TycBaseInfo | null> {
  try {
    const res = await tycClient.get("/services/open/ic/baseinfo/normal", {
      params: { keyword },
    });
    if (res.data?.error_code === 0) {
      return res.data.result ?? null;
    }
    console.error("[TYC] getBaseInfo error:", res.data);
    return null;
  } catch (err) {
    console.error("[TYC] getBaseInfo request failed:", err);
    return null;
  }
}

/**
 * 企业股东信息
 */
export async function getShareholders(keyword: string, pageNum = 1): Promise<{ items: TycShareholder[]; total: number }> {
  try {
    const res = await tycClient.get("/services/open/ic/holder/2.0", {
      params: { keyword, pageSize: 20, pageNum },
    });
    if (res.data?.error_code === 0) {
      return {
        items: res.data.result?.items ?? [],
        total: res.data.result?.total ?? 0,
      };
    }
    console.error("[TYC] getShareholders error:", res.data);
    return { items: [], total: 0 };
  } catch (err) {
    console.error("[TYC] getShareholders request failed:", err);
    return { items: [], total: 0 };
  }
}

/**
 * 对外投资
 */
export async function getInvestments(keyword: string, pageNum = 1): Promise<{ items: TycInvestment[]; total: number }> {
  try {
    const res = await tycClient.get("/services/open/ic/inverst/2.0", {
      params: { keyword, pageSize: 20, pageNum },
    });
    if (res.data?.error_code === 0) {
      return {
        items: res.data.result?.items ?? [],
        total: res.data.result?.total ?? 0,
      };
    }
    console.error("[TYC] getInvestments error:", res.data);
    return { items: [], total: 0 };
  } catch (err) {
    console.error("[TYC] getInvestments request failed:", err);
    return { items: [], total: 0 };
  }
}

/**
 * 经营异常
 */
export async function getAbnormals(keyword: string, pageNum = 1): Promise<{ items: TycAbnormal[]; total: number }> {
  try {
    const res = await tycClient.get("/services/open/mr/abnormal/2.0", {
      params: { keyword, pageSize: 20, pageNum },
    });
    if (res.data?.error_code === 0) {
      return {
        items: res.data.result?.items ?? [],
        total: res.data.result?.total ?? 0,
      };
    }
    console.error("[TYC] getAbnormals error:", res.data);
    return { items: [], total: 0 };
  } catch (err) {
    console.error("[TYC] getAbnormals request failed:", err);
    return { items: [], total: 0 };
  }
}

/**
 * 行政处罚
 */
export async function getPunishments(keyword: string, pageNum = 1): Promise<{ items: TycPunishment[]; total: number }> {
  try {
    const res = await tycClient.get("/services/open/mr/punishmentInfo/2.0", {
      params: { keyword, pageSize: 20, pageNum },
    });
    if (res.data?.error_code === 0) {
      return {
        items: res.data.result?.items ?? [],
        total: res.data.result?.total ?? 0,
      };
    }
    console.error("[TYC] getPunishments error:", res.data);
    return { items: [], total: 0 };
  } catch (err) {
    console.error("[TYC] getPunishments request failed:", err);
    return { items: [], total: 0 };
  }
}

/**
 * 失信被执行人
 */
export async function getDishonest(keyword: string, pageNum = 1): Promise<{ items: TycDishonest[]; total: number }> {
  try {
    const res = await tycClient.get("/services/open/mr/dishonest/2.0", {
      params: { keyword, pageSize: 20, pageNum },
    });
    if (res.data?.error_code === 0) {
      return {
        items: res.data.result?.items ?? [],
        total: res.data.result?.total ?? 0,
      };
    }
    console.error("[TYC] getDishonest error:", res.data);
    return { items: [], total: 0 };
  } catch (err) {
    console.error("[TYC] getDishonest request failed:", err);
    return { items: [], total: 0 };
  }
}

/**
 * 司法诉讼（裁判文书）
 */
export async function getLawsuits(keyword: string, pageNum = 1): Promise<{ items: TycLawsuit[]; total: number }> {
  try {
    const res = await tycClient.get("/services/open/jr/lawSuit/2.0", {
      params: { keyword, pageSize: 20, pageNum },
    });
    if (res.data?.error_code === 0) {
      return {
        items: res.data.result?.items ?? [],
        total: res.data.result?.total ?? 0,
      };
    }
    console.error("[TYC] getLawsuits error:", res.data);
    return { items: [], total: 0 };
  } catch (err) {
    console.error("[TYC] getLawsuits request failed:", err);
    return { items: [], total: 0 };
  }
}

/**
 * 综合查询 - 一次性获取企业全部信息（基本信息 + 股东 + 投资 + 风险）
 */
export async function getCompanyFullInfo(keyword: string) {
  const [baseInfo, shareholders, investments, abnormals, punishments, dishonest, lawsuits] =
    await Promise.all([
      getBaseInfo(keyword),
      getShareholders(keyword),
      getInvestments(keyword),
      getAbnormals(keyword),
      getPunishments(keyword),
      getDishonest(keyword),
      getLawsuits(keyword),
    ]);

  return {
    baseInfo,
    shareholders,
    investments,
    risks: {
      abnormals,
      punishments,
      dishonest,
      lawsuits,
    },
  };
}
