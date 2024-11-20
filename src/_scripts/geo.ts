import path, { resolve } from 'path';
import fs from "fs"
import '../utils/env';
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
function getLngLat(location: string) {
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


async function start() {
    const list = readJSON();
    const MIN_SAVE_VAL = 10;
    for (let i = 0; i < list.length; i++) {
        const item = list[i]!;

        try {
            // if (item.latitude && item.longitude) continue;
            const resGeo = await getGEOData(item);
            const lngLat = getLngLat(resGeo.geocodes[0]!.location);
            item.longitude = lngLat.longitude!;
            item.latitude = lngLat.latitude!;
            if (i > 0 && i % MIN_SAVE_VAL == 0) {
                fs.writeFileSync(jsonPath, JSON.stringify(list, undefined, "\t"))
            }
            console.log(`${new Date().toLocaleTimeString()}:  完成 ${i + 1}/${list.length} ${item.name}`);
            await delay(500)
        } catch (err) {
            console.log(err, item.name)
        }
    }
    fs.writeFileSync(jsonPath, JSON.stringify(list, undefined, "\t"))

}

start();

function getErrorItems(){
    const list = readJSON();
    const items = list.filter(item=> item.longitude == undefined || item.latitude == undefined )
    console.log("items:", items.map(it=> it.name))
}

// getErrorItems();