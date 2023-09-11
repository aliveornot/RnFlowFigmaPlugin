import React from 'react';
import styled from 'styled-components';
import ButtonCta from '../components/atoms/ButtonCta';
import StatusDisplay from '../components/organisms/StatusDisplay';

export default function IntermediatePage({ status }: { status: string }) {
  return (
    <UiOuterMost>
      <StatusDisplay titleMessage={status} selectionStatusMessage={status} />
      <ButtonCta label={status} isDisabled={true} />
    </UiOuterMost>
  );
}

const UiOuterMost = styled.div`
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  padding: 10px;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
