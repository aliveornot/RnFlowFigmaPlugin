import React from 'react';
import styled from 'styled-components';
import ButtonCta from '../components/atoms/ButtonCta';
import StatusDisplay from '../components/organisms/StatusDisplay';
import useSelectedNodes from '../hooks/messageFromSandboxHook';

export default function ReadyPage({ onClickPublish = () => {} }: { onClickPublish?: () => void }) {
  const selectedNodesInfo = useSelectedNodes();
  const numSelection: number = (selectedNodesInfo && selectedNodesInfo.length) || 0;

  let bigMessage: JSX.Element;
  let selectionDetailStatus: string;
  let isButtonDisabled = true;

  // 선택된 노드들에 따라서 버튼의 활성화 여부, 메세지를 결정한다.
  if (numSelection === 0) {
    bigMessage = (
      <span>
        <b>Select</b> a frame to publish
      </span>
    );
    selectionDetailStatus = '(NONE)';
  } else if (numSelection === 2) {
    bigMessage = (
      <span>
        Select <b>ONE</b> frame to publish
      </span>
    );
    selectionDetailStatus = numSelection + ' nodes';
  } else {
    const selectedNode = selectedNodesInfo[0];
    if (!['FRAME', 'COMPONENT', 'INSTANCE'].includes(selectedNode.type)) {
      bigMessage = (
        <span>
          Select a top-level <b>FRAME</b> to publish
        </span>
      );
      selectionDetailStatus = 'a ' + selectedNode.type;
    } else if (!selectedNode.isTopLevelNode) {
      bigMessage = (
        <span>
          Select a <b>TOP-LEVEL</b> frame to publish
        </span>
      );
      selectionDetailStatus = 'a child of another node';
    } else {
      bigMessage = <span>Ready to publish!</span>;
      selectionDetailStatus = selectedNode.name;
      isButtonDisabled = false;
    }
  }

  return (
    <UiOuterMost>
      <StatusDisplay titleMessage={bigMessage} selectionStatusMessage={selectionDetailStatus} />
      <ButtonCta label={'Publish'} onClick={onClickPublish} isDisabled={isButtonDisabled} />
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
