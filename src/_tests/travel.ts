import '../utils/env';
import { statisticsItems } from '@/services/travel';


statisticsItems({
    province: 120000 + '',
    city: 120111 + ''
}).then(res=> {
    console.log("res:", res)
})