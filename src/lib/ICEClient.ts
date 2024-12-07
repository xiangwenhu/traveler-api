// This file is auto-generated, don't edit it
// 依赖的模块可通过下载工程中的模块依赖文件或右上角的获取 SDK 依赖信息查看
import ICE20201109, * as ICE from '@alicloud/ice20201109';
import OpenApi, * as $OpenApi from '@alicloud/openapi-client';
import Util, * as $Util from '@alicloud/tea-util';
import * as $tea from '@alicloud/tea-typescript';
import '../utils/env';

export class ICEClient {

    private iceClient: ICE20201109;

    private runtime = new $Util.RuntimeOptions({});

    constructor(configOptions: Partial<$OpenApi.Config>) {
        // 工程代码泄露可能会导致 AccessKey 泄露，并威胁账号下所有资源的安全性。以下代码示例仅供参考。
        // 建议使用更安全的 STS 方式，更多鉴权访问方式请参见：https://help.aliyun.com/document_detail/378664.html。
        let config = new $OpenApi.Config(configOptions);
        this.iceClient = new ICE20201109(config);
    }

    registerMediaInfo(request: ICE.RegisterMediaInfoRequest) {
        return this.iceClient.registerMediaInfo(request)
    }

    batchGetMediaInfos(request: ICE.BatchGetMediaInfosRequest) {
        return this.iceClient.batchGetMediaInfos(request)
    }

    submitMediaProducingJob(request: ICE.SubmitMediaProducingJobRequest){
        return this.iceClient.submitMediaProducingJob(request)
    }

    getMediaProducingJob(request: ICE.GetMediaProducingJobRequest){
        return this.iceClient.getMediaProducingJob(request)
    }    
}



export default new ICEClient({
    accessKeyId: process.env.ALI_ACC_ID,
    accessKeySecret: process.env.ALI_ACC_SECRET,
    endpoint: process.env.ALI_ACE_END_POINT
});