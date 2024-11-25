import path from "path";
import { ResJson, SchoolItem } from "./types";
import fs from "fs"

const URLS = {
  s211: "https://api.zjzw.cn/web/api/?uri=apidata/api/gkv3/school/lists"
}

async function getPagedData(queryObj: {
  page: number,
  pageSize: number
}): Promise<ResJson> {
  const query = `f211=1&keyword=&page=${queryObj.page}&province_id=&ranktype=&request_type=1&size=${queryObj.pageSize}`
  const fullUrl = `${URLS.s211}&${query}`;
  const res = await fetch(fullUrl).then(res => res.json());

  return res as ResJson
}


const dist = path.join(__dirname, "../../../data/school/211_ori.json");


; (async function init() {


  let hasNext = true;
  let page = 1;
  const list: SchoolItem[] = [];

  const PAGE_SIZE = 20;
  while (hasNext) {
    const res = await getPagedData({
      page,
      pageSize: PAGE_SIZE
    });

    const items = res.data.item;

    list.push(...items);
    hasNext = items.length == PAGE_SIZE;

    if (hasNext) {
      page++
    }
  }

  fs.writeFileSync(dist, JSON.stringify(list, undefined, "\t"))


})()