import styled from 'styled-components';
import React from 'react';

export interface ModalProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(2,6,23,0.4);
  display: grid;
  place-items: center;
  z-index: 50;
`;

const Shell = styled.div`
  width: 720px;
  max-width: calc(100vw - 32px);
  background: ${({ theme }) => theme.colors.surface1};
  color: ${({ theme }) => theme.colors.ink900};
  border: 1px solid #e2e8f0;
  border-radius: ${({ theme }) => theme.radius.xl};
  box-shadow: ${({ theme }) => theme.shadow.card};
  overflow: hidden;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
`;

const Body = styled.div`
  padding: 16px;
`;

const Footer = styled.footer`
  padding: 12px 16px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

export function Modal({ open, title, onClose, footer, children }: ModalProps) {
  if (!open) return null;
  return (
    <Overlay role="dialog" aria-modal aria-label={title || 'Dialog'} onClick={onClose}>
      <Shell onClick={(e) => e.stopPropagation()}>
        <Header>
          <div style={{ fontWeight: 600 }}>{title}</div>
          <button onClick={onClose} style={{ border: '1px solid #e2e8f0', background: '#fff', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}>Close</button>
        </Header>
        <Body>{children}</Body>
        {footer && <Footer>{footer}</Footer>}
      </Shell>
    </Overlay>
  );
}

