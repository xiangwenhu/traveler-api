import '../utils/env';
import path from 'node:path';
import type { NewItemType, Region } from '@/schema/region';
import { addItem } from '@/services/region';
import { PCA_CHINA_CODE } from '@/const';

export interface AreaItem {
  code: number;
  name: string;
  children?: AreaItem[];
}

async function adRegion(area: AreaItem, parentCode: number | undefined) {
  const region: NewItemType = {
    parentCode: parentCode || PCA_CHINA_CODE,
    name: area.name,
    code: area.code,
  };

  await addItem(region);
  console.log('add:', region.code, region.name);

  if (Array.isArray(area.children)) {
    for (let i = 0; i < area.children.length; i++) {
      await adRegion(area.children[i]!, area.code);
    }
  }
};

; (async function () {
  const areas: AreaItem[] = require(path.join(__dirname, '../../data/pca-code.json'));

  console.log('area count:', areas.length);
  for (let i = 0; i < areas.length; i++) {
    await adRegion(areas[i]!, 0);
  }
  console.info('completed:');
})();
