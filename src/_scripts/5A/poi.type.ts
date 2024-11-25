interface Suggestion {
    keywords: any[];
    cities: any[];
}
interface Biz_ext {
    cost: any[];
    rating: any[];
}
interface Photos {
    title: any[];
    url: string;
}
interface Children {
    typecode: string;
    address: string;
    distance: string;
    subtype: string;
    sname: string;
    name: string;
    location: string;
    id: string;
}
interface Indoor_data {
    cmsid: any[];
    truefloor: any[];
    cpid: any[];
    floor: any[];
}
interface Pois {
    distance: any[];
    pcode: string;
    importance: any[];
    biz_ext: Biz_ext;
    recommend: string;
    type: string;
    photos: Photos[];
    discount_num: string;
    gridcode: string;
    typecode: string;
    shopinfo: string;
    poiweight: any[];
    citycode: string;
    adname: string;
    children: Children[];
    id: string;
    event: any[];
    indoor_map: string;
    email: any[];
    timestamp: string;
    address: string;
    adcode: string;
    pname: string;
    biz_type: any[];
    cityname: string;
    match: string;
    indoor_data: Indoor_data;
    exit_location: any[];
    name: string;
    location: string;
    shopid: any[];
    groupbuy_num: string;
    alias?: string;

    website?: string;
}
export interface ResPOI {
    suggestion: Suggestion;
    count: string;
    infocode: string;
    pois: Pois[];
    status: string;
    info: string;
}