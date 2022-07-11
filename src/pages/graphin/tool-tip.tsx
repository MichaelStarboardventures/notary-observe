import { Tooltip as AntTooltip } from '@antv/graphin-components';

export const ToolTip = () => {
  return (
    <AntTooltip placement={'top'} bindType={'node'} hasArrow={true}>
      <AntTooltip.Node>{(model) => model.id}</AntTooltip.Node>
    </AntTooltip>
  );
};
