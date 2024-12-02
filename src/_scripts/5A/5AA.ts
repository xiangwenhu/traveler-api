import axios, { AxiosResponse } from "axios";
import fs from "fs/promises";
import path from "path";
import { AAAAAContent, ResData } from "./5AA.types";


// 从中华人民共和国文化和旅游部 获取全部  5A景区

const URLS = {
    "getContentListByDirId": "https://www.mct.gov.cn/tourism/api/content/getContentListByDirId"
}

function getPagedData(page: number) {
    return axios.post<any, AxiosResponse<ResData>>(URLS.getContentListByDirId, {
        "directoryId": "4",
        "searchList": [],
        "size": 100,
        page
    }).then(res=> res.data)
}



const dist = path.join(__dirname, "../../data/5a/AAAAA.json");

async function start() {

    let hasNext = true;
    let page = 1;
    const AAAAA: AAAAAContent[] = [];
    while (hasNext) {
        const res = await getPagedData(page);
        if (res.code != 200) {
            throw new Error(`请求失败：${res.message}`);
        }
        AAAAA.push(...res.data.contentList.content);
        page++;
        if (res.data.contentList.last) hasNext = false;
    }

    fs.writeFile(dist, JSON.stringify(AAAAA, undefined, "\t"))

}

start();