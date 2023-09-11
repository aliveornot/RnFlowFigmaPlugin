import React from 'react';
import styled from 'styled-components';

export default function ButtonCta({ onClick, label, isDisabled = false }: { isDisabled?: boolean; label: string; onClick?: () => void }) {
  return (
    <CtaButtonOutermost isDisabled={isDisabled} onClick={onClick}>
      <LabelText isDisabled={isDisabled}>{label}</LabelText>
    </CtaButtonOutermost>
  );
}

const CtaButtonOutermost = styled.button<{ isDisabled: boolean }>`
  display: flex;
  padding: 10px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  align-self: stretch;

  outline: none;
  border: none;

  border-radius: 50px;
  background: ${(p) => (p.isDisabled ? 'darkgray' : 'var(--VS-Code-Blue, #3fa9f2)')};
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.25);
  &:hover {
    cursor: ${(p) => (p.isDisabled ? 'not-allowed' : 'pointer')};
    background-color: ${(p) => (p.isDisabled ? '' : '#3fa9f2bb')};
  }
  &:active {
    box-shadow: none;
  }
`;

const LabelText = styled.div<{ isDisabled: boolean }>`
  color: ${(p) => (p.isDisabled ? 'lightgray' : 'white')};
  font-family: 'Noto Sans';
  font-size: 16px;
  font-style: normal;
  font-weight: 900;
  line-height: normal;
`;
