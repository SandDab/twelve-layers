import type { Scene } from '../../engine/scene';
import { envyRival } from './envyRival';
import {
  kanzashiFujiDelivery,
  kanzashiKobaiDelivery,
  kanzashiSangoDelivery,
  kanzashiTsukikageDelivery,
} from './kanzashiDelivery';
import { m1NewYear } from './m1NewYear';
import { m4AoiCarriage } from './m4AoiCarriage';
import { m4NewYearEcho } from './m4NewYearEcho';
import { m7Tanabata } from './m7Tanabata';
import { m8Tsukimi } from './m8Tsukimi';
import { m11Gosechi } from './m11Gosechi';
import { oldNameDebt } from './oldNameDebt';
import {
  romanceCaptainCritical,
  romanceClimberCritical,
  romanceDevoteeCritical,
  romanceMerchantCritical,
  romanceRiverbankCritical,
  romanceSecondPrinceCritical,
  romanceSoleHeirCritical,
  romanceWidowCritical,
} from './romanceCriticalStubs';

export const SCENES: Record<string, Scene> = {
  [m1NewYear.id]: m1NewYear,
  [m4NewYearEcho.id]: m4NewYearEcho,
  [m4AoiCarriage.id]: m4AoiCarriage,
  [m7Tanabata.id]: m7Tanabata,
  [m8Tsukimi.id]: m8Tsukimi,
  [m11Gosechi.id]: m11Gosechi,
  [envyRival.id]: envyRival,
  [oldNameDebt.id]: oldNameDebt,
  [kanzashiKobaiDelivery.id]: kanzashiKobaiDelivery,
  [kanzashiTsukikageDelivery.id]: kanzashiTsukikageDelivery,
  [kanzashiFujiDelivery.id]: kanzashiFujiDelivery,
  [kanzashiSangoDelivery.id]: kanzashiSangoDelivery,
  [romanceClimberCritical.id]: romanceClimberCritical,
  [romanceWidowCritical.id]: romanceWidowCritical,
  [romanceSoleHeirCritical.id]: romanceSoleHeirCritical,
  [romanceRiverbankCritical.id]: romanceRiverbankCritical,
  [romanceCaptainCritical.id]: romanceCaptainCritical,
  [romanceDevoteeCritical.id]: romanceDevoteeCritical,
  [romanceSecondPrinceCritical.id]: romanceSecondPrinceCritical,
  [romanceMerchantCritical.id]: romanceMerchantCritical,
};

export function getScene(id: string): Scene | undefined {
  return SCENES[id];
}
