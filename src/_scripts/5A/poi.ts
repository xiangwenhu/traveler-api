import path, { resolve } from 'path';
import fs from "fs"
import '../../utils/env';
import { AAAAAContent } from './5AA.types';
import axios, { AxiosResponse } from 'axios';
import { ResPOI } from './poi.type';

const AMAP_key = process.env.AMAP_KEY;


const jsonPath = path.join(__dirname, "../../data/5a/AAAAA-geo-photos.json");

function readJSON() {
    return JSON.parse(fs.readFileSync(jsonPath, "utf-8")) as AAAAAContent[]
}

function searchPlace(options: {
    keywords: string;
    city: string;
    offset?: number;
    extensions?: "all" | "base"
}) {
    const { keywords, city } = options;
    const url = `https://restapi.amap.com/v3/place/text?keywords=${keywords}&city=${city}&offset=1&page=1&key=${AMAP_key}&extensions=all`
    return axios.get<any, AxiosResponse<ResPOI>>(url).then(res => res.data)
}


function delay(duration: number = 500) {
    return new Promise((resolve) => {
        setTimeout(resolve, duration)
    })
}

async function getPhotos() {
    const list = readJSON();
    const MIN_SAVE_VAL = 10;
    for (let i = 0; i < list.length; i++) {
        const item = list[i]!;

        try {
            if (Array.isArray(item.photos)) continue;
            const res = await searchPlace({
                city: item.city_code,
                keywords: item.name
            });

            const poi = res.pois[0]!;

            item.photos = poi.photos;

            if (i > 0 && i % MIN_SAVE_VAL == 0) {
                fs.writeFileSync(jsonPath, JSON.stringify(list, undefined, "\t"))
            }
            console.log(`${new Date().toLocaleTimeString()}:  完成 ${i + 1}/${list.length} ${item.city}`);
            await delay(500)

        } catch (err) {
            console.log(err, item.name)
            await delay(500)

        }
    }
    fs.writeFileSync(jsonPath, JSON.stringify(list, undefined, "\t"))

}


// getPhotos();


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