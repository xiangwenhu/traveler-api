import { z } from "zod";


export const pagerSchame = z.object({
    pageNum: z.number().min(1),
    pageSize: z.number().min(10).max(100)
})

export const PagerBodySchema = z.object({
    body: pagerSchame
});

export const PagerQuerySchame = z.object({
    query: pagerSchame
})


export type PagerParamsType = z.infer<typeof pagerSchame>;