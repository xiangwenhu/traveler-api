import * as Util from '@alicloud/tea-util';
import * as OpenApi from '@alicloud/openapi-client';
import ICE20201109 from '@alicloud/ice20201109';
import '../utils/env';

interface ResData<D = any> {
    body: D,
    /**
     * 一般200是成功
     */
    statusCode: string;

    description: string;

    headers: string;

    [key: string]: any;
}

export class ICEClientProxy {

    private iceClient: ICE20201109;

    constructor(configOptions: Partial<OpenApi.Config>) {
        // 工程代码泄露可能会导致 AccessKey 泄露，并威胁账号下所有资源的安全性。以下代码示例仅供参考。
        // 建议使用更安全的 STS 方式，更多鉴权访问方式请参见：https://help.aliyun.com/document_detail/378664.html。
        let config = new OpenApi.Config(configOptions);
        this.iceClient = new ICE20201109(config);
    }

    async requestICEPost(action: string, body: any) {
        const runtime = new Util.RuntimeOptions({});
        const req = new OpenApi.OpenApiRequest({
            body: Util.default.toMap(body as any),
        });
        const result = await this.iceClient.doRPCRequest(
            action,
            '2020-11-09',
            'HTTPS',
            'POST',
            'AK',
            'json',
            req,
            runtime
        ) as ResData
        return result.body;
    }

    async requestICEGet(action: string, query: Record<string, any>) {

        const runtime = new Util.RuntimeOptions({});
        const req = new OpenApi.OpenApiRequest({
            query: Util.default.toMap(query as any),
        });
        const result = await this.iceClient.doRPCRequest(
            action,
            '2020-11-09',
            'HTTPS',
            'GET',
            'AK',
            'json',
            req,
            runtime
        ) as ResData
        return result.body;
    }

}


export default new ICEClientProxy({
    accessKeyId: process.env.ALI_ACC_ID,
    accessKeySecret:  process.env.ALI_ACC_SECRET,
    endpoint: process.env.ALI_ACE_END_POINT
});