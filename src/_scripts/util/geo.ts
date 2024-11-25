import axios, { AxiosResponse } from "axios"
import { ResJson } from "../5A/geo.types"
const AMAP_key = process.env.AMAP_KEY;

export function getGEODataPlus(name: string, city: string) {
    const url = `https://restapi.amap.com/v3/geocode/geo?key=${AMAP_key}&address=${encodeURIComponent(name)}&city=${city}`
    return axios.get<any, AxiosResponse<ResJson>>(url).then(res => res.data)
}
