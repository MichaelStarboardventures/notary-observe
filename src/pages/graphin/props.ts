export interface NotaryList {
  id: string;
  notaryName: string;
  notaryId: string;
  notaryAddress: string;
  accountOnboardingTime: Date;
  totalDataCapAllocatedTiB: number;
  clientHeadcount: number;
  providerHeadcount: number;
}

export interface ProviderList {
  id: string;
  providerName: string;
  providerId: string;
  providerAddress: string;
  accountOnboardingTime: Date;
  rawBytePowerTiB: number;
  qualityAdjustedPowerTiB: number;
  verifiedDealsTiB: number;
  clientHeadcount: number;
  notaryHeadcount: number;
}

export type NeighborRecord = (NotaryList | ProviderList) & {
  key: string;
};

export interface GraphinSummary {
  ClientHeadcount: number;
  ProviderHeadcount: number;
  MaximumAllocationsperClient: number;
  ShareofTotal: number;
}

export interface DetailClient {
  clientId: string;
  clientName: string;
  accountOnboardTime: Date;
  dataCapAllocatedTiB: number;
  dataCapSpentTiB: number;
  dataCapRemovedTiB: number;
  dataCapBalanceTiB: number;
}

export interface DetailProvider {
  providerId: string;
  accountOnboardTime: Date;
  rawByteCapacityTiB: number;
  qualityAdjustedPowerTiB: number;
  verifiedDealsTiB: number;
}

export interface DetailVerifier {
  notaryId: string;
  notaryName: string;
  notaryType: string;
  accountOnboardTime: string;
  dataCapAllocatedTiB: string;
}

export type Details = (DetailClient | DetailProvider | DetailVerifier) &
  Record<string, any>;

export type UserType = 'c' | 'p' | 'v' | 'a' | 's';

export interface DealListColumn {
  dealId: string;
  providerId: string;
  startTime: Date;
  endTime: Date;
  dealDuration: number;
  dealPrice: number;
  dealConllateral: Date;
  dealState: string;
}

export interface AllocationListColumn {
  notaryId: string;
  notaryType: string;
  notaryName: string;
  allocationTime: Date;
}

export type ActivityDealAllocationRecord = (
  | DealListColumn
  | AllocationListColumn
) & {
  key: string;
};
