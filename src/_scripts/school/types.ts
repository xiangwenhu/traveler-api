export interface SchoolItem {
    admissions: string;
    answerurl: string;
    belong: string;
    central: string;
    city_id: string;
    city_name: string;
    code_enroll: string;
    colleges_level: string;
    county_id: string;
    county_name: string;
    department: string;
    doublehigh: string;
    dual_class: string;
    dual_class_name: string;
    f211: number;
    f985: number;
    hightitle: string;
    inner_rate: number;
    is_recruitment: string;
    level: string;
    level_name: string;
    name: string;
    nature: string;
    nature_name: string;
    outer_rate: number;
    province_id: string;
    province_name: string;
    rank: string;
    rank_type: string;
    rate: number;
    recommend_master_level: number;
    school_id: number;
    school_type: string;
    tag_name: string;
    town_name: string;
    type: string;
    type_name: string;
    upgrading_level: number;
    view_month: string;
    view_total: string;
    view_total_number: string;
    view_week: string;

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
        title: string[];
        url: string;
    }[];

    alias: string | null;

    address: string;


    website?: string;
}
interface Data {
    item: SchoolItem[];
    numFound: number;
}
export interface ResJson {
    code: string;
    message: string;
    data: Data;
    location: string;
    encrydata: string;
}