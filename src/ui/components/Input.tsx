import styled from 'styled-components';
import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

export const Input = styled.input<InputProps>`
  width: 100%;
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.surface0};
  color: ${({ theme }) => theme.colors.ink900};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom-color: ${({ theme }) => theme.colors.glassHighlight};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 15px;
  font-family: ${({ theme }) => theme.font.body};
  outline: none;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.08);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.ink400};
  }

  &:focus {
    background: ${({ theme }) => theme.colors.surface1};
    border-color: ${({ theme }) => theme.colors.info};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.info}25, inset 0 1px 2px rgba(0,0,0,0.02);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.ink400};
    opacity: 0.6;
  }
`;

