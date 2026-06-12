import type { Scene } from '../../engine/scene';
import { envyRival } from './envyRival';
import {
  kanzashiFujiDelivery,
  kanzashiKobaiDelivery,
  kanzashiSangoDelivery,
  kanzashiTsukikageDelivery,
} from './kanzashiDelivery';
import { m1NewYear } from './m1NewYear';
import { m4NewYearEcho } from './m4NewYearEcho';
import { m8Tsukimi } from './m8Tsukimi';
import { oldNameDebt } from './oldNameDebt';
import { romanceFadedBranchCurtain } from './romanceFadedBranchCurtain';
import { romanceSequesteredHeirCurtain } from './romanceSequesteredHeirCurtain';
import { romanceSharpBrushCurtain } from './romanceSharpBrushCurtain';

export const SCENES: Record<string, Scene> = {
  [m1NewYear.id]: m1NewYear,
  [m4NewYearEcho.id]: m4NewYearEcho,
  [m8Tsukimi.id]: m8Tsukimi,
  [envyRival.id]: envyRival,
  [oldNameDebt.id]: oldNameDebt,
  [kanzashiKobaiDelivery.id]: kanzashiKobaiDelivery,
  [kanzashiTsukikageDelivery.id]: kanzashiTsukikageDelivery,
  [kanzashiFujiDelivery.id]: kanzashiFujiDelivery,
  [kanzashiSangoDelivery.id]: kanzashiSangoDelivery,
  [romanceSequesteredHeirCurtain.id]: romanceSequesteredHeirCurtain,
  [romanceSharpBrushCurtain.id]: romanceSharpBrushCurtain,
  [romanceFadedBranchCurtain.id]: romanceFadedBranchCurtain,
};

export function getScene(id: string): Scene | undefined {
  return SCENES[id];
}
