import styled from 'styled-components';
import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = styled.input<InputProps>`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 14px;
  background: #fff;
  color: ${({ theme }) => theme.colors.ink900};
  outline: none;
  transition: box-shadow 120ms ease-out, border-color 120ms ease-out;
  &:focus {
    border-color: ${({ theme }) => theme.colors.brand};
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.25);
  }
`;

