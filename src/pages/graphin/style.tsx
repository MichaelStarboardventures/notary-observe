import styled from 'styled-components';
import { Row } from 'antd';

export const DetailSessionStyled = styled.div`
  height: 450px;
  padding: 0 24px;
  box-sizing: border-box;
`;

export const GraphinWrapperStyled = styled.div`
  height: 100vh;
  padding: 0 24px;
  box-sizing: border-box;
`;

export const DetailSessionInfoStyled = styled.div`
  padding: 0 24px;
  box-sizing: border-box;
`;

export const GraphinStyled = styled(Row)`
  height: 100%;
  background-color: #fff;
`;

export const GraphinSideStyled = styled.div`
  width: 190px;
  background-color: #f6f6f6;
`;

export const GraphinContentStyled = styled.div`
  padding: 18px;
  height: 100%;
  box-sizing: border-box;
`;

export const GraphinDetailTitle = styled.div`
  height: 48px;
  font-size: 14px;
  text-align: center;
  line-height: 48px;
  font-weight: 500;
  color: #fff;
  background: #706bff;
`;

export const GraphinSideItemStyled = styled.div`
  height: 36px;
  padding: 0 20px;
  text-align: left;
  line-height: 36px;
  font-size: 10px;
  font-weight: 400;
  border-bottom: 1px solid #a0a4a8;
  box-sizing: border-box;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const GraphinSideItemContentStyled = styled.div`
  height: calc(645px - 48px);
  overflow: auto;
`;

export const InfoStyled = styled.div`
  height: 497px;
  padding: 12px 16px;
  background-color: #fff;
  box-sizing: border-box;

  & .ant-descriptions-item-container {
    & .ant-descriptions-item-label {
      color: #082451;
      font-size: 12px;
      line-height: 12px;
    }

    & .ant-descriptions-item-content {
      color: #082451;
      font-size: 12px;
      line-height: 12px;
    }
  }
`;

export const InfoTitleStyled = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #706bff;
`;

export const TableTabWrapper = styled(Row)`
  margin: 10px 0;

  & .table-tab-item {
    padding: 2px;
    text-align: center;
    background-color: #f6f6f6;
    cursor: pointer;
  }
`;

export const TableTabItemInner = styled.div<{ selected?: boolean }>`
  font-size: 14px;
  font-weight: 500;
  line-height: 28px;
  ${({ selected }) => `
    color: ${selected ? '#fff' : '#52575c'};
    background-color: ${selected ? '#706BFF' : 'transparent'};
  `}
`;

export const ToolColorCardStyled = styled.div`
  position: absolute;
  top: 0;
  width: 180px;

  & .graphin-color-item {
    display: flex;
    height: 6px;

    &.color-item-top {
      background: linear-gradient(
        90deg,
        rgba(112, 107, 255, 0.1) 0%,
        #706bff 100%
      );
      transform: matrix(-1, 0, 0, 1, 0, 0);
    }

    &.color-item-bottom {
      background: linear-gradient(
        90deg,
        rgba(207, 207, 207, 0.1) 0%,
        #65686b 100%
      );
      transform: matrix(-1, 0, 0, 1, 0, 0);
    }
  }
`;

export const CommunitySummaryStyled = styled.div`
  width: 390px;
  position: absolute;
  bottom: 18px;
  padding: 8px;
  background-color: #f6f6f6;
  box-sizing: border-box;

  & .community-title {
    margin-bottom: 10px;
    color: #25282b;
    font-weight: 500;
    font-size: 20px;
  }

  & .community-content {
    font-size: 12px;
    line-height: 24px;
  }
`;
