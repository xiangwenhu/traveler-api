import '../utils/env';
import { getClientBySts } from '@/utils/ali-oss';

; (async function () {
   const client = await getClientBySts()

   const res = await client.put("a.png", "D:\\videosAndImages\\ssssssssssssss.png")

   console.info('res:', res);
})();
