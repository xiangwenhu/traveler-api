export interface AAAAAContent {
    id: number;
    directoryId: number;
    directoryIds: string | null | null;
    name: string;
    provinceCodeDb: string;
    provinceName: string;
    provinceCode2?: null;
    provinceName2?: null;
    provinceCode3?: null;
    provinceName3?: null;
    cityCode?: null;
    cityName?: null;
    gradesName: string;
    column8?: null;
    isDel: boolean;
    code?: null;
    type?: null | string | string;
    year: string;
    introduction?: null;
    phone?: null;
    fax?: null;
    mailBox?: null;
    postCode?: null;
    webPath?: null | string | string;
    localPath?: null;
    pdfUpdateTime?: null;
    country?: null;
    englishName?: null;
    contentSource?: null;
    keywords?: null;
    author?: null;
    contentDescription?: null;
    contentImage?: null;
    createTime: string | null | null;
    updateTime: string | null | null;
    provinceCode: string;
    /**
     * 经度
     */
    longitude: number;
    /**
     * 纬度
     */
    latitude: number;

    province: string;
    city: string;
    district: string;

    province_code: string;
    city_code: string;
    district_code: string;


    photos: {
        title: string[] ;
        url: string;
    }[];

    alias: string;

    atype: string;


    address: string;

    isfree: boolean;


    website: {title: string, url: string}[]

}
interface Sort {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
}
interface Pageable {
    sort: Sort;
    pageNumber: number;
    pageSize: number;
    offset: number;
    unpaged: boolean;
    paged: boolean;
}
interface ContentList {
    content: AAAAAContent[];
    pageable: Pageable;
    totalPages: number;
    totalElements: number;
    last: boolean;
    sort: Sort;
    first: boolean;
    numberOfElements: number;
    size: number;
    number: number;
    empty: boolean;
}
interface Data {
    contentList: ContentList;
}
export interface ResData {
    code: number;
    message: string;
    data: Data;
}