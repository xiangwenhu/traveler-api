import { z } from "zod";

export const zNumberString = z.string().regex(/^\d+$/);

const zNumberString100 = z
    .string()
    .regex(/^([1-9][0-9]?|100)$/);

export const pagerSchema = z.object({
    pageNum: zNumberString.min(1),
    pageSize: zNumberString100,
})

export const PagerBodySchema = z.object({
    body: pagerSchema
});

export const PagerQuerySchema = z.object({
    query: pagerSchema
})


export type PagerParamsType = z.infer<typeof pagerSchema>;


