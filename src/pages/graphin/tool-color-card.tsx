import React from 'react';
import { ToolColorCardStyled } from '@/pages/graphin/style';
import { Col, Row } from 'antd';

export const ToolColorCard = () => {
  return (
    <ToolColorCardStyled>
      <Row gutter={[0, 15]}>
        <Col span={24}>
          <Row justify={'space-between'} style={{ fontSize: 10 }}>
            <Col style={{ color: '#706BFF' }}>High</Col>
            <Col style={{ color: '#949595' }}>Verfied Deals</Col>
            <Col style={{ color: '#706BFF' }}>Low</Col>
          </Row>
          <div className={'graphin-color-item color-item-top'} />
        </Col>
        <Col span={24}>
          <Row justify={'space-between'} style={{ fontSize: 10 }}>
            <Col style={{ color: '#A0A4A8' }}>High</Col>
            <Col style={{ color: '#949595' }}>DataCap Allocated</Col>
            <Col style={{ color: '#A0A4A8' }}>Low</Col>
          </Row>
          <div className={'graphin-color-item color-item-bottom'} />
        </Col>
        <Col span={24}>
          <span>Right Click Node to Expand Neighborhood</span>
        </Col>
      </Row>
    </ToolColorCardStyled>
  );
};
