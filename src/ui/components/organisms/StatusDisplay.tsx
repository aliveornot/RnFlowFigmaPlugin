import React from 'react';
import styled from 'styled-components';

export default function StatusDisplay(props: { titleMessage: JSX.Element; selectionStatusMessage: string }) {
  return (
    <StatusOutermost>
      <BigText>{props.titleMessage}</BigText>
      <CurrentStatusInfo>
        <TitleText>Current Selection:</TitleText>
        <DetailSelectionInfo>
          <DetailText>• {props.selectionStatusMessage}</DetailText>
        </DetailSelectionInfo>
      </CurrentStatusInfo>
    </StatusOutermost>
  );
}

const StatusOutermost = styled.div`
  flex: 1 0 0;
  align-self: stretch;

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  gap: 4px;
`;

const BigText = styled.div`
  align-self: stretch;

  color: #333;
  font-family: 'Noto Sans';
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const CurrentStatusInfo = styled.div`
  display: flex;
  height: 59px;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
`;

const TitleText = styled.div`
  align-self: stretch;

  color: #666;
  font-family: 'Noto Sans';
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const DetailSelectionInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
`;

const DetailText = styled.div`
  flex: 1 0 0;

  margin-left: 4px;

  color: #666;
  font-family: 'Noto Sans';
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;
