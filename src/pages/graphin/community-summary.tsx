import { useCallback, useEffect, useState, memo } from 'react';
import { CommunitySummaryStyled } from '@/pages/graphin/style';
import { GraphinSummary } from '@/pages/graphin/props';
import { history } from 'umi';
import services from '@/services';

const CommunitySummaryComponent = () => {
  const [data, setData] = useState<GraphinSummary | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const {
        location: { query },
      } = history;

      const res = await services.getSummary();

      setData(res as GraphinSummary | null);
    } catch (e) {}
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return data ? (
    <CommunitySummaryStyled>
      <div className={'community-title'}>community summary</div>
      <div className={'community-content'}>
        Client Headcount: {data?.ClientHeadcount}
        <br />
        Provider Headcount: {data?.ProviderHeadcount}
        <br />
        {/*Maximum Deals per Provider:{' '}*/}
        {/*{Math.floor(data?.MaximumAllocationsperClient)} TiB (Share of Total:{' '}*/}
        {/*{Math.floor(data?.ShareofTotal)}%)*/}
        {/*<br />*/}
        Maximum Allocations per Client:{' '}
        {Math.floor(data?.MaximumAllocationsperClient)} TiB (Share of Total:{' '}
        {Math.floor(data?.ShareofTotal)}%)
      </div>
    </CommunitySummaryStyled>
  ) : null;
};

export const CommunitySummary = memo(CommunitySummaryComponent, () => {
  return true;
});
