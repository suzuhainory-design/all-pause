/**
 * 天眼查 API tRPC 路由器
 * 提供企业信息查询的后端代理接口
 */
import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import {
  searchCompany,
  getBaseInfo,
  getShareholders,
  getInvestments,
  getAbnormals,
  getPunishments,
  getDishonest,
  getLawsuits,
  getCompanyFullInfo,
} from "../tianyancha";

export const tianyanchaRouter = router({
  /**
   * 企业搜索（模糊匹配）
   */
  search: publicProcedure
    .input(z.object({ keyword: z.string().min(1) }))
    .query(async ({ input }) => {
      const results = await searchCompany(input.keyword);
      return results;
    }),

  /**
   * 企业基本信息
   */
  baseInfo: publicProcedure
    .input(z.object({ keyword: z.string().min(1) }))
    .query(async ({ input }) => {
      const info = await getBaseInfo(input.keyword);
      return info;
    }),

  /**
   * 股东信息
   */
  shareholders: publicProcedure
    .input(z.object({ keyword: z.string().min(1), pageNum: z.number().optional() }))
    .query(async ({ input }) => {
      const result = await getShareholders(input.keyword, input.pageNum);
      return result;
    }),

  /**
   * 对外投资
   */
  investments: publicProcedure
    .input(z.object({ keyword: z.string().min(1), pageNum: z.number().optional() }))
    .query(async ({ input }) => {
      const result = await getInvestments(input.keyword, input.pageNum);
      return result;
    }),

  /**
   * 经营异常
   */
  abnormals: publicProcedure
    .input(z.object({ keyword: z.string().min(1), pageNum: z.number().optional() }))
    .query(async ({ input }) => {
      const result = await getAbnormals(input.keyword, input.pageNum);
      return result;
    }),

  /**
   * 行政处罚
   */
  punishments: publicProcedure
    .input(z.object({ keyword: z.string().min(1), pageNum: z.number().optional() }))
    .query(async ({ input }) => {
      const result = await getPunishments(input.keyword, input.pageNum);
      return result;
    }),

  /**
   * 失信被执行人
   */
  dishonest: publicProcedure
    .input(z.object({ keyword: z.string().min(1), pageNum: z.number().optional() }))
    .query(async ({ input }) => {
      const result = await getDishonest(input.keyword, input.pageNum);
      return result;
    }),

  /**
   * 司法诉讼
   */
  lawsuits: publicProcedure
    .input(z.object({ keyword: z.string().min(1), pageNum: z.number().optional() }))
    .query(async ({ input }) => {
      const result = await getLawsuits(input.keyword, input.pageNum);
      return result;
    }),

  /**
   * 综合查询 - 一次性获取企业全部信息
   */
  fullInfo: publicProcedure
    .input(z.object({ keyword: z.string().min(1) }))
    .query(async ({ input }) => {
      const result = await getCompanyFullInfo(input.keyword);
      return result;
    }),
});
