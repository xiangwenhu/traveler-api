import path, { resolve } from 'path';
import fs from "fs"
import '../../utils/env';
import axios, { AxiosResponse } from 'axios';
import { SchoolItem } from './types';
import { ResPOI } from '../5A/poi.type';
import { getGEODataPlus } from '../util/geo';

const AMAP_key = process.env.AMAP_KEY;


const jsonPath = path.join(__dirname, "../../../data/school/211_geo.json");

function readJSON() {
    return JSON.parse(fs.readFileSync(jsonPath, "utf-8")) as SchoolItem[]
}

function searchPlace(options: {
    keywords: string;
    city: string;
    offset?: number;
    extensions?: "all" | "base"
}) {
    const { keywords, city } = options;
    const url = `https://restapi.amap.com/v3/place/text?keywords=${keywords}&types=高等院校&city=${city}&offset=1&page=1&key=${AMAP_key}&extensions=all`
    return axios.get<any, AxiosResponse<ResPOI>>(url).then(res => res.data)
}


function delay(duration: number = 500) {
    return new Promise((resolve) => {
        setTimeout(resolve, duration)
    })
}

async function getGeoInfo() {
    const list = readJSON();
    const MIN_SAVE_VAL = 10;
    for (let i = 0; i < list.length; i++) {
        const item = list[i]!;

        try {
            if (Array.isArray(item.photos)) continue;
            const res = await searchPlace({
                city: item.city_name,
                keywords: item.name
            });


            const poi = res.pois[0]!;
            // 图片
            item.photos = poi.photos;

            // 省市县
            item.province = poi.pname;
            item.city = poi.cityname;
            item.district = poi.adname;

            // 省市县 code
            item.province_code = poi.pcode;
            // item.city_code = ''
            item.district_code = poi.adcode;


            // 地址
            item.address = poi.address;
            item.alias = poi.alias || null;

            // 经纬度

            const loc = poi.location;
            const [longitude, latitude] = loc.split(",").map(v=> +v);
            item.longitude = longitude!;
            item.latitude = latitude!;

            item.website  = poi.website;



            if (i > 0 && i % MIN_SAVE_VAL == 0) {
                fs.writeFileSync(jsonPath, JSON.stringify(list, undefined, "\t"))
            }
            console.log(`${new Date().toLocaleTimeString()}:  完成 ${i + 1}/${list.length} ${item.name}`);
            await delay(500)

        } catch (err) {
            console.log(err, item.name)
            await delay(500)

        }
    }
    fs.writeFileSync(jsonPath, JSON.stringify(list, undefined, "\t"))

}


// getGeoInfo();


function getErrorItems() {
    const list = readJSON();
    const items = list.filter(item => {
        const pCode = `${item.province_code}`.slice(0, 2);
        const cCode =  `${item.city_code}`.slice(0, 2);
        const dCode = (`${item.district_code}` || '').slice(0, 2)

        if (dCode) {
            return pCode !== cCode || pCode !== dCode
        }

        return pCode !== cCode

    })

    // const items = list.filter(item => !item.district_code)

    console.log("items:", items.map(it => it.name))
}

getErrorItems();


async function getCityAdCode() {
    const list = readJSON();
    const MIN_SAVE_VAL = 10;
    for (let i = 0; i < list.length; i++) {
        const item = list[i]!;

        try {
            if (item.city_code && item.address) continue;
            const resGeo = await getGEODataPlus(item.city, item.province_code);

            const geo = resGeo.geocodes[0]!;

            item.city_code = geo.adcode;
            // item.address = geo.formatted_address;

            if (i > 0 && i % MIN_SAVE_VAL == 0) {
                fs.writeFileSync(jsonPath, JSON.stringify(list, undefined, "\t"))
            }
            console.log(`${new Date().toLocaleTimeString()}:  完成 ${i + 1}/${list.length}  ${item.name} ${item.province}`);
            await delay(500)

        } catch (err) {
            console.log(err, item.name)
            await delay(500)

        }
    }
    fs.writeFileSync(jsonPath, JSON.stringify(list, undefined, "\t"))

}

// getCityAdCode();