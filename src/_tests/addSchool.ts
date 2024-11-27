import path, { resolve } from 'path';
import fs from "fs"
import '../utils/env';
import { addItem } from '../services/school';
import { NewItemType } from '../schema/school';
import { SchoolItem } from '../_scripts/school/types';

const jsonPath = path.join(__dirname, "../../data/school/211_geo.json");

function readJSON() {
    return JSON.parse(fs.readFileSync(jsonPath, "utf-8")) as SchoolItem[]
}

/**
 * 
 * @param str "2007/2018年"  2015年
 */
function getYear(str: string) {

    if (str.includes("/")) {
        return + str.split("/")[0]!
    }
    return +str.replace("年", "")
}

function getPCA(item: SchoolItem) {

    if (item.province_code == item.city_code) {
        return {
            province_code: item.province_code,
            city_code: item.district_code
        }
    }

    return {
        province_code: item.province_code,
        city_code: item.city_code,
        district_code: item.district_code,
    }
}

function getWebSite(val: string | any[] | undefined) {

    if (val == undefined) return ''

    if (Array.isArray(val) && val.length === 0) {
        return ""
    }
    if (typeof val == "string") return val.trim();
    return val[0].url || '';
}

function getAddress(val: string | any[] | undefined) {

    if (val == undefined) return ''

    if (Array.isArray(val) && val.length === 0) {
        return ""
    }
    if (typeof val == "string") return val.trim();
    return val[0].url || '';
}



async function addItemO(item: SchoolItem) {

    const pca = getPCA(item);

    const data: NewItemType = {
        schoolId: item.school_id,
        name: item.name,
        description: item.name,
        province: +pca.province_code,
        city: +pca.city_code,
        county: pca.district_code ? +pca.district_code : null,
        address: getAddress(item.address),
        longitude: item.longitude,
        latitude: item.latitude,
        photos: (item.photos || []).map(it => ({
            title: Array.isArray(it.title) ? it.title[0] || '' : it.title,
            url: it.url
        })),
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        type: +item.type,
        rank: +item.rank,
        website: getWebSite(item.website),
        is211: item.f211 == 1,
        is985: item.f985 == 1,
    }

    await addItem(data);
    console.log('add:', data.name);
};

; (async function () {
    const items: SchoolItem[] = readJSON();

    console.log('items count:', items.length);
    for (let i = 0; i < items.length; i++) {
        await addItemO(items[i]!);
        console.log(`added:${i + 1}/${items.length}`)
    }
    console.info('completed:');
})();
