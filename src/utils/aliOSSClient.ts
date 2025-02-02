import OSS, { STS } from 'ali-oss';
import { getClientBySts } from './ali-oss';

let client: OSS | undefined;

export default async function getOSSClient() {
    if (!client) {
        client = await getClientBySts();
    }
    return client;
}