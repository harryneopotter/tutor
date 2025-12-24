import styled, { css } from 'styled-components';
import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  glass?: boolean;
}

export const Card = styled.div<CardProps>`
  position: relative;
  background: ${({ theme, glass }) => glass ? 'rgba(255, 255, 255, 0.15)' : theme.colors.surface1};
  color: ${({ theme }) => theme.colors.ink900};
  border: 1px solid ${({ theme, glass }) => glass ? 'rgba(255, 255, 255, 0.2)' : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme, glass }) => glass ? theme.shadow.liquidGlass : theme.shadow.card};
  overflow: hidden;

  ${({ glass, theme }) => glass && css`
    backdrop-filter: ${theme.blur.thick} saturate(250%);
    -webkit-backdrop-filter: ${theme.blur.thick} saturate(250%);
    
    &::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      border-radius: inherit;
      padding: 1px;
      background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.2) 100%);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
    }

    &::after {
      content: '';
      position: absolute;
      top: 0; left: -100%; width: 200%; height: 100%;
      background: linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 55%, transparent 60%);
      transition: transform 1s ease-in-out;
      pointer-events: none;
    }

    &:hover::after {
      transform: translateX(50%);
    }
  `}

  padding: ${({ padding = 'md' }) => {
    if (padding === 'none') return '0';
    if (padding === 'sm') return '16px';
    if (padding === 'lg') return '32px';
    return '24px';
  }};

  transition: all 0.4s cubic-bezier(0.1, 0.9, 0.2, 1);
  
  &:hover {
    box-shadow: ${({ theme, glass }) => glass ? '0 32px 64px rgba(0,0,0,0.15)' : theme.shadow.premium};
    transform: translateY(-6px);
  }
`;

