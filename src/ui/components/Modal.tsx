import styled, { keyframes } from 'styled-components';
import React from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(20px) scale(0.95); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.glass0};
  backdrop-filter: ${({ theme }) => theme.blur.regular};
  -webkit-backdrop-filter: ${({ theme }) => theme.blur.regular};
  display: grid;
  place-items: center;
  z-index: 2000;
  animation: ${fadeIn} 200ms ease-out;
`;

const Shell = styled.div`
  width: 720px;
  max-width: calc(100vw - 32px);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: ${({ theme }) => theme.blur.thick} saturate(300%);
  -webkit-backdrop-filter: ${({ theme }) => theme.blur.thick} saturate(300%);
  color: ${({ theme }) => theme.colors.ink900};
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.radius.xl};
  box-shadow: 
    0 48px 128px rgba(0,0,0,0.3),
    ${({ theme }) => theme.shadow.liquidGlass};
  overflow: hidden;
  position: relative;
  animation: ${slideUp} 600ms cubic-bezier(0.1, 0.9, 0.2, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.3) 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    z-index: 10;
  }
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 700;
  font-family: ${({ theme }) => theme.font.heading};
  letter-spacing: -0.02em;
`;

const CloseButton = styled.button`
  background: ${({ theme }) => theme.colors.surface0};
  color: ${({ theme }) => theme.colors.ink600};
  border: none;
  border-radius: 999px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 120ms ease-out;
  &:hover {
    background: ${({ theme }) => theme.colors.ink900};
    color: ${({ theme }) => theme.colors.surface1};
  }
`;

const Body = styled.div`
  padding: 0 24px 24px;
`;

const Footer = styled.footer`
  padding: 16px 24px;
  background: ${({ theme }) => theme.colors.surface0}50;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

export function Modal({ open, title, onClose, footer, children }: ModalProps) {
  if (!open) return null;
  return (
    <Overlay role="dialog" aria-modal aria-label={title || 'Dialog'} onClick={onClose}>
      <Shell onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>{title}</Title>
          <CloseButton onClick={onClose} aria-label="Close">
            <X size={18} />
          </CloseButton>
        </Header>
        <Body>{children}</Body>
        {footer && <Footer>{footer}</Footer>}
      </Shell>
    </Overlay>
  );
}

