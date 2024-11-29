import path, { resolve } from 'path';
import fs from "fs"
import '../utils/env';
import { AAAAAContent } from '../_scripts/5A/5AA.types';
import { updateItem, getItems } from '../services/5AScenic';
import { arrayToRecord } from '../_scripts/util';


const jsonPath = path.join(__dirname, "../../data/5a/AAAAA-geo-photos.json");

function readJSON() {
    return JSON.parse(fs.readFileSync(jsonPath, "utf-8")) as AAAAAContent[]
}


function getDBItems() {
    return getItems({
        pageNum: '1',
        pageSize: '999'
    })
}




; (async function init() {

    const lItems = readJSON();
    const lItemMap = arrayToRecord(lItems, "id");

    const dbItems = (await getDBItems()).list;

    for (let i = 0; i < dbItems.length; i++) {
        const dbItem = dbItems[i]!;
        if (dbItem && dbItem.sourceId) {
            const lItem = lItemMap[dbItem.sourceId];
            dbItem.website = lItem?.website || null;
            if (lItem?.website) {
                await updateItem({
                    id: dbItem.id,
                    website: lItem.website
            });
            }
        }

        console.log(`${i+1}/${dbItems.length}  ${dbItem.name}`);
    }

})();

