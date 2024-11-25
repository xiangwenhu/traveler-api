import path, { resolve } from 'path';
import fs from "fs"
import '../utils/env';
import { AAAAAContent } from '../_scripts/5A/5AA.types';
import { addItem } from '../services/5AScenic';
import { NewItemType } from '../schema/5AScenic';

const jsonPath = path.join(__dirname, "../../data/5a/AAAAA-geo-photos.json");

function readJSON() {
    return JSON.parse(fs.readFileSync(jsonPath, "utf-8")) as AAAAAContent[]
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

function getPCA(item: AAAAAContent){

    if(item.province_code == item.city_code){
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


async function addItemO(item: AAAAAContent) {

    const pca = getPCA(item);

    const data: NewItemType = {
        name: item.name,
        description: item.name,
        province: +pca.province_code,
        city: +pca.city_code,
        county: pca.district_code ? +pca.district_code : null ,
        address: item.address || '',
        longitude: item.longitude,
        latitude: item.latitude,
        year: getYear(item.year),
        photos: item.photos.map(it => ({
            title: Array.isArray(it.title) ? it.title[0] || '' : it.title,
            url: it.url
        })) || [],
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        sourceId: item.id,
    }

    await addItem(data);
    console.log('add:', data.name);
};

; (async function () {
    const items: AAAAAContent[] = readJSON();

    console.log('items count:', items.length);
    for (let i = 0; i < items.length; i++) {
        await addItemO(items[i]!);
    }
    console.info('completed:');
})();
