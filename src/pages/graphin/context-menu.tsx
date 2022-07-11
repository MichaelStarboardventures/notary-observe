import React, { useContext } from 'react';
import { ContextMenu as GraphinContextMenu } from '@antv/graphin-components';
// @ts-ignore
import PieMenu, { Slice } from 'react-pie-menu';
import { GraphinContext, GraphinData } from '@antv/graphin';
import { request } from '@/utils';
import { GraphinDataContext } from '@/pages/graphin/index';
import services from '@/services';

const options = [
  {
    key: 'tag',
    name: 'Expand Neighborhood',
  },
];

export const ContextMenu: React.FC<{
  setData: React.Dispatch<
    React.SetStateAction<{
      nodes: Record<string, any>;
      edges: Record<string, any>;
    }>
  >;
}> = ({ setData }) => {
  const { graph } = useContext(GraphinContext);
  const graphinData = useContext(GraphinDataContext);

  const nodeSize = 30;
  const radius = 60;
  const centerX = 0;
  const centerY = 0;
  const zoom = graph.getZoom();
  const styles = {
    transform: `scale(${zoom})`,
    transformOrigin: 'left',
  };

  return (
    <GraphinContextMenu style={{ width: 125 }} bindType="node">
      <GraphinContextMenu.Menu
        options={options}
        onChange={async (item, data) => {
          try {
            const res = await services.getGraphinDetail(data.key, data.id);

            if (!res) {
              return;
            }

            setData((originData) => {
              return {
                nodes: {
                  ...originData.nodes,
                  ...res.nodes,
                },
                edges: {
                  ...originData.edges,
                  ...res.edges,
                },
              };
            });
          } catch (e) {}
        }}
        bindType="node"
      />
      {/*<div style={{ ...styles }}>*/}
      {/*  <ThemeProvider theme={theme}>*/}
      {/*    <PieMenu*/}
      {/*      radius={`${radius}px`}*/}
      {/*      centerRadius={`${nodeSize / 2}px`}*/}
      {/*      centerX={`${centerX}px`}*/}
      {/*      centerY={`${centerY}px`}*/}
      {/*    >*/}
      {/*      /!* Contents *!/*/}
      {/*      <Slice>delete</Slice>*/}
      {/*      /!*<Slice*!/*/}
      {/*      /!*  onSelect={() => window.open('https://www.facebook.com', '_blank')}*!/*/}
      {/*      /!*>*!/*/}
      {/*      /!*  tag*!/*/}
      {/*      /!*</Slice>*!/*/}
      {/*      /!*<Slice*!/*/}
      {/*      /!*  onSelect={() => window.open('https://www.twitter.com', '_blank')}*!/*/}
      {/*      /!*>*!/*/}
      {/*      /!*  fetch*!/*/}
      {/*      /!*</Slice>*!/*/}
      {/*      /!*<Slice*!/*/}
      {/*      /!*  onSelect={() => window.open('https://www.linkedin.com', '_blank')}*!/*/}
      {/*      /!*>*!/*/}
      {/*      /!*  copy*!/*/}
      {/*      /!*</Slice>*!/*/}
      {/*    </PieMenu>*/}
      {/*  </ThemeProvider>*/}
      {/*</div>*/}
    </GraphinContextMenu>
  );
};
