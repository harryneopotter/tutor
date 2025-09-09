import styled from 'styled-components';
import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'sm' | 'md' | 'lg';
}

export const Card = styled.div<CardProps>`
  background: ${({ theme }) => theme.colors.surface1};
  color: ${({ theme }) => theme.colors.ink900};
  border: 1px solid #e2e8f0;
  border-radius: ${({ theme }) => theme.radius.xl};
  box-shadow: ${({ theme }) => theme.shadow.card};
  padding: ${({ padding = 'md' }) => (padding === 'sm' ? '12px' : padding === 'lg' ? '24px' : '16px')};
  transition: box-shadow 120ms ease-out, transform 120ms ease-out;
  @media (prefers-reduced-motion: reduce) {
    transition: box-shadow 0ms ease-out, transform 0ms ease-out;
  }
  &:hover {
    box-shadow: 0 1px 1px rgba(16,24,40,0.06), 0 12px 24px rgba(16,24,40,0.08);
    transform: translateY(-1px);
  }
  &:active {
    box-shadow: 0 1px 1px rgba(16,24,40,0.06), 0 8px 16px rgba(16,24,40,0.08);
    transform: translateY(0);
  }
`;

