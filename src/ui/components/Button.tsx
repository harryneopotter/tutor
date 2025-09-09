import styled, { css } from 'styled-components';
import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const sizeStyles = {
  sm: css`
    padding: 6px 10px;
    font-size: 12px;
    border-radius: ${({ theme }) => theme.radius.sm};
  `,
  md: css`
    padding: 8px 14px;
    font-size: 14px;
    border-radius: ${({ theme }) => theme.radius.md};
  `,
  lg: css`
    padding: 10px 18px;
    font-size: 16px;
    border-radius: ${({ theme }) => theme.radius.lg};
  `,
};

const variantStyles = {
  primary: css`
    background: ${({ theme }) => theme.colors.brand};
    color: #fff;
    border: 1px solid ${({ theme }) => theme.colors.brand};
    &:hover { background: ${({ theme }) => theme.colors.brandHover}; }
  `,
  secondary: css`
    background: #fff;
    color: ${({ theme }) => theme.colors.ink900};
    border: 1px solid #e2e8f0;
    &:hover { background: #f8fafc; }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.ink900};
    border: 1px solid transparent;
    &:hover { background: #f8fafc; }
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.danger};
    color: #fff;
    border: 1px solid ${({ theme }) => theme.colors.danger};
    &:hover { filter: brightness(0.95); }
  `,
  success: css`
    background: ${({ theme }) => theme.colors.success};
    color: #fff;
    border: 1px solid ${({ theme }) => theme.colors.success};
    &:hover { filter: brightness(0.95); }
  `,
};

const StyledButton = styled.button<{ $variant: ButtonVariant; $size: ButtonSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 120ms ease-out, color 120ms ease-out, border-color 120ms ease-out, box-shadow 120ms ease-out;
  ${(p) => sizeStyles[p.$size]}
  ${(p) => variantStyles[p.$variant]}
  &:focus-visible {
    outline: none;
    border-color: ${({ theme }) => theme.colors.brand};
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.25);
  }
`;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'secondary', size = 'md', children, ...rest }, ref) => {
    return (
      <StyledButton ref={ref} $variant={variant} $size={size} {...rest}>
        {children}
      </StyledButton>
    );
  },
);

Button.displayName = 'Button';

