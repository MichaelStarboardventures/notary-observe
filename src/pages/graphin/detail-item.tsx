import React, { useMemo } from 'react';
import { Tooltip } from 'antd';
import {
  GraphinDetailTitle,
  GraphinSideItemContentStyled,
  GraphinSideItemStyled,
  GraphinSideStyled,
} from '@/pages/graphin/style';
import {
  DetailClient,
  DetailProvider,
  Details,
  DetailVerifier,
} from '@/pages/graphin/props';

const useConfig = (nodeId: string, details: Details | null) => {
  return useMemo(() => {
    if (nodeId === '') return null;

    const id = Number(nodeId);
    switch (id) {
      case 0:
        const client = details as DetailClient;
        return {
          'Client ID': client?.clientId,
          'Client Name': client?.clientName,
          'Account Onboard Time': client?.accountOnboardTime,
          'DataCap Allocated (TiB)': client?.dataCapAllocatedTiB,
          'DataCap Spent (TiB)': client?.dataCapSpentTiB,
          'DataCap Removed (TiB)': client?.dataCapRemovedTiB,
          'DataCap Balance (TiB)': client?.dataCapBalanceTiB,
        };

      case 1:
        const provider = details as DetailProvider;
        return {
          'Provider ID': provider?.providerId,
          'Account Onboard Time': provider?.accountOnboardTime,
          'Raw Byte Capacity (TiB)': provider?.rawByteCapacityTiB,
          'Quality Adjusted Power(TiB)': provider?.qualityAdjustedPowerTiB,
          'Verified Deals (TiB)': provider?.verifiedDealsTiB,
        };

      case 2:
        const verifier = details as DetailVerifier;
        return {
          'Notary ID': verifier?.notaryId,
          'Notary Name': verifier?.notaryName,
          'Notary Type': verifier?.notaryType,
          'DataCap Allocated (TiB)': verifier?.dataCapAllocatedTiB,
          'Account Onboard Time': verifier?.accountOnboardTime,
        };

      default:
        return null;
    }
  }, [nodeId, details]);
};

export const DetailItem: React.FC<{
  details: Details | null;
  nodeId: string;
}> = ({ details, nodeId }) => {
  const data = useConfig(nodeId, details) as unknown as Details;

  return (
    data && (
      <GraphinSideStyled>
        <GraphinDetailTitle>Details</GraphinDetailTitle>
        <GraphinSideItemContentStyled>
          {Object.keys(data).map((ret) => (
            <GraphinSideItemStyled key={ret}>
              <Tooltip overlay={`${ret + ': ' + data[ret]}`}>
                {ret}: {data[ret]}
              </Tooltip>
            </GraphinSideItemStyled>
          ))}
        </GraphinSideItemContentStyled>
      </GraphinSideStyled>
    )
  );
};
