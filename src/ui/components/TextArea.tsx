import styled from 'styled-components';
import React from 'react';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const TextArea = styled.textarea<TextAreaProps>`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.ink400};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 14px;
  background: ${({ theme }) => theme.colors.surface1};
  color: ${({ theme }) => theme.colors.ink900};
  outline: none;
  resize: vertical;
  transition: box-shadow 120ms ease-out, border-color 120ms ease-out;
  &:focus {
    border-color: ${({ theme }) => theme.colors.brand};
    box-shadow: ${({ theme }) => theme.shadow.card};
  }
`;

