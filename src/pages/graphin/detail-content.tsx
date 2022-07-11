import React, { useCallback, useContext, useEffect } from 'react';
import AntvGraphin, {
  GraphinContext,
  GraphinData,
  IG6GraphEvent,
} from '@antv/graphin';
import { INode } from '@antv/g6';
import { GraphinContentStyled } from '@/pages/graphin/style';
import { ToolColorCard } from '@/pages/graphin/tool-color-card';
import { CommunitySummary } from '@/pages/graphin/community-summary';
import { ContextMenu } from '@/pages/graphin/context-menu';
import { ToolTip } from '@/pages/graphin/tool-tip';
import { UserType } from '@/pages/graphin/props';

const keyConfig: Record<string, any> = {
  c: 0,
  p: 1,
  v: 2,
};

const BindClickNode = ({
  fetchDetails,
}: {
  fetchDetails: (id: string, clientId: string, type: UserType) => void;
}) => {
  const { graph } = useContext(GraphinContext);

  const handleClick = useCallback((e: IG6GraphEvent) => {
    const item = e.item as INode;
    const node = item.getModel();

    fetchDetails(
      keyConfig[node?.key as string],
      node.id as string,
      node.key as UserType,
    );
  }, []);

  useEffect(() => {
    graph.on('node:click', handleClick);

    return () => {
      graph.off('node:click', handleClick);
    };
  }, []);
  return null;
};

export const DetailContent = ({
  data,
  fetchDetails,
  setData,
}: {
  data: GraphinData;
  fetchDetails: (id: string, nodeId: string, type: UserType) => Promise<void>;
  setData: React.Dispatch<
    React.SetStateAction<{
      nodes: Record<string, any>;
      edges: Record<string, any>;
    }>
  >;
}) => {
  const layout = {
    type: 'graphin-force',
  };

  return (
    <GraphinContentStyled>
      <AntvGraphin data={data} layout={layout} height={700}>
        <ToolColorCard />
        <ToolTip />
        <CommunitySummary />
        <BindClickNode fetchDetails={fetchDetails} />
        <ContextMenu setData={setData} />
      </AntvGraphin>
    </GraphinContentStyled>
  );
};
