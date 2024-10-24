import { z } from "zod";

export const zNumberString = z.string().regex(/^\d+$/);

const zNumberString100 = z
    .string()
    .regex(/^([1-9][0-9]?|100)$/);

export const pagerSchame = z.object({
    pageNum: zNumberString.min(1),
    pageSize: zNumberString100,
})

export const PagerBodySchema = z.object({
    body: pagerSchame
});

export const PagerQuerySchame = z.object({
    query: pagerSchame
})


export type PagerParamsType = z.infer<typeof pagerSchame>;


