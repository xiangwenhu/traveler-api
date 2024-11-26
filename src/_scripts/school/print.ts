import path from "path";
import fs from "fs";
import { SchoolItem } from "./types";

const jsonPath = path.join(__dirname, "../../../data/school/211_geo.json");

function readJSON() {
    return JSON.parse(fs.readFileSync(jsonPath, "utf-8")) as SchoolItem[]
}


const list = readJSON().filter(v=> v.f985 == 1).sort((a,b)=> a.province > b.province ? 1: -1).map(v=> `${v.name}(${v.province})`)

console.log(list.join("\r\n"))