import '../utils/env';
import path from 'node:path';
import type { NewRegion, Region } from '@/schema/region';
import { addRegion } from '@/services/region-service';

export interface AreaItem {
  code: number;
  name: string;
  children?: AreaItem[];
}

async function adRegion(area: AreaItem, parentCode: number | undefined) {
  const region: NewRegion = {
    parentCode: parentCode || 0,
    name: area.name,
    code: area.code,
  };

  await addRegion(region);
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
