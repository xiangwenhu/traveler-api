import OSS, { STS } from 'ali-oss';

export async function assumeRole(): Promise<OSS.Credentials> {
  const sts = new STS({
    // 填写步骤1创建的RAM用户AccessKey。
    accessKeyId: process.env.ALI_ACC_ID!,
    accessKeySecret: process.env.ALI_ACC_SECRET!,
  });
    // roleArn填写步骤2获取的角色ARN，例如acs:ram::175708322470****:role/ramtest。
    // policy填写自定义权限策略，用于进一步限制STS临时访问凭证的权限。如果不指定Policy，则返回的STS临时访问凭证默认拥有指定角色的所有权限。
    // 临时访问凭证最后获得的权限是步骤4设置的角色权限和该Policy设置权限的交集。
    // expiration用于设置临时访问凭证有效时间单位为秒，最小值为900，最大值以当前角色设定的最大会话时间为准。本示例指定有效时间为3000秒。
    // sessionName用于自定义角色会话名称，用来区分不同的令牌，例如填写为sessiontest。
  const res = await sts.assumeRole(process.env.ALI_OSS_ACS_RAM!, ``, 1 * 60 * 60, 'traveler-session');
  return res.credentials;
}

function getClient(credentials: OSS.Credentials) {
  const client = new OSS({
    region: process.env.ALI_OSS_REGION,
    accessKeyId: credentials.AccessKeyId,
    accessKeySecret: credentials.AccessKeySecret,
    stsToken: credentials.SecurityToken,
    bucket: process.env.ALI_OSS_BUCKET!,
    refreshSTSToken: async () => {
      const refreshToken = await assumeRole();
      return {
        accessKeyId: refreshToken.AccessKeyId,
        accessKeySecret: refreshToken.AccessKeySecret,
        stsToken: refreshToken.SecurityToken,
      };
    },
  });
  return client;
}

export async function getClientBySts() {
  const res = await assumeRole();
  const client = getClient(res);
  return client;
}
