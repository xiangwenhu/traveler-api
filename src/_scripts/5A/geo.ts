import path, { resolve } from 'path';
import fs from "fs"
import '../../utils/env';
import { AAAAAContent } from './5AA.types';
import axios, { AxiosResponse } from 'axios';
import { ResJson } from './geo.types';

// 给5A景区的基本数据， 名称 + code , geo查询 经纬度


const AMAP_key = process.env.AMAP_KEY;


const jsonPath = path.join(__dirname, "../../data/5a/AAAAA-geo.json");



function readJSON() {
    return JSON.parse(fs.readFileSync(jsonPath, "utf-8")) as AAAAAContent[]
}


function getGEOData(item: AAAAAContent) {
    const url = `https://restapi.amap.com/v3/geocode/geo?key=${AMAP_key}&address=${encodeURIComponent(item.name)}&city=${item.provinceCode}`
    return axios.get<any, AxiosResponse<ResJson>>(url).then(res => res.data)
}


/**
 * 
 * @param location "116.565052,40.431668",
 */
function getLngLatFromLocation(location: string) {
    const arr = location.split(",").map(v => +v);
    return {
        longitude: arr[0],
        latitude: arr[1]
    }
}

function delay(duration: number = 500) {
    return new Promise((resolve) => {
        setTimeout(resolve, duration)
    })
}

/**
 * 通过搜索5A景区地址，获取经纬度，
 * 并同时得到 province, city, district, province_code, district_code
 * cityCode 需单独再获取一次，详见 getAdCode
 */
async function getLngLat() {
    const list = readJSON();
    const MIN_SAVE_VAL = 10;
    for (let i = 0; i < list.length; i++) {
        const item = list[i]!;

        try {
            if (item.latitude && item.longitude && item.province_code && item.district_code) continue;
            const resGeo = await getGEOData(item);
            const lngLat = getLngLatFromLocation(resGeo.geocodes[0]!.location);
            item.longitude = lngLat.longitude!;
            item.latitude = lngLat.latitude!;

            const geo = resGeo.geocodes[0]!;

            // 省市县名
            item.province = geo.province;
            item.city = geo.city;
            item.district = geo.district;

            // 省和区的code
            item.province_code = item.provinceCode;
            item.district_code = geo.adcode;

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

// getLngLat();

function getErrorItems() {
    const list = readJSON();
    const items = list.filter(item => {
        const pCode = item.province_code.slice(0, 2);
        const cCode = item.city_code.slice(0, 2);
        const dCode = (item.district_code || '').slice(0, 2)

        if (dCode) {
            return pCode !== cCode || pCode !== dCode
        }

        return pCode !== cCode

    })

    // const items = list.filter(item => !item.district_code)

    console.log("items:", items.map(it => it.name))
}

getErrorItems();

function getGEODataPlus(name: string, city: string) {
    const url = `https://restapi.amap.com/v3/geocode/geo?key=${AMAP_key}&address=${encodeURIComponent(name)}&city=${city}`
    return axios.get<any, AxiosResponse<ResJson>>(url).then(res => res.data)
}



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
            console.log(`${new Date().toLocaleTimeString()}:  完成 ${i + 1}/${list.length}  ${item.name} ${item.address}`);
            await delay(500)

        } catch (err) {
            console.log(err, item.name)
            await delay(500)

        }
    }
    fs.writeFileSync(jsonPath, JSON.stringify(list, undefined, "\t"))

}


// getCityAdCode();



async function getAddress() {
    const list = readJSON();
    const MIN_SAVE_VAL = 10;
    for (let i = 0; i < list.length; i++) {
        const item = list[i]!;

        try {
            // if (item.address) continue;
            const resGeo = await getGEODataPlus(item.name, item.province_code);

            const geo = resGeo.geocodes[0]!;

            item.address = geo.formatted_address;

            if (i > 0 && i % MIN_SAVE_VAL == 0) {
                fs.writeFileSync(jsonPath, JSON.stringify(list, undefined, "\t"))
            }
            console.log(`${new Date().toLocaleTimeString()}:  完成 ${i + 1}/${list.length}  ${item.name} ${item.address}`);
            await delay(500)

        } catch (err) {
            console.log(err, item.name)
            await delay(500)

        }
    }
    fs.writeFileSync(jsonPath, JSON.stringify(list, undefined, "\t"))

}


// getAddress();