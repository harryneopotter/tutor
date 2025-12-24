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
    padding: 6px 12px;
    font-size: 13px;
    border-radius: ${({ theme }) => theme.radius.sm};
  `,
  md: css`
    padding: 10px 18px;
    font-size: 15px;
    border-radius: ${({ theme }) => theme.radius.md};
  `,
  lg: css`
    padding: 14px 24px;
    font-size: 17px;
    font-weight: 600;
    border-radius: ${({ theme }) => theme.radius.lg};
  `,
};

const variantStyles = {
  primary: css`
    background: linear-gradient(180deg, ${({ theme }) => theme.colors.brand} 0%, ${({ theme }) => theme.colors.brandHover} 100%);
    color: #fff;
    box-shadow: 
      ${({ theme }) => theme.shadow.skeuoRaised},
      inset 0 1px 1px rgba(255,255,255,0.4),
      inset 0 -1px 2px rgba(0,0,0,0.3);
    
    &::after {
      content: '';
      position: absolute;
      top: 1px; left: 1px; right: 1px; height: 40%;
      background: linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%);
      pointer-events: none;
      border-radius: inherit;
      border-top: 1px solid rgba(255,255,255,0.2);
    }
    
    &:hover { 
      filter: brightness(1.1) saturate(1.2);
      transform: translateY(-2px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.2), ${({ theme }) => theme.shadow.skeuoRaised};
    }
    
    &:active {
      transform: translateY(1px) scale(0.97);
      box-shadow: ${({ theme }) => theme.shadow.skeuoPressed};
      background: ${({ theme }) => theme.colors.brandHover};
      &::after { opacity: 0; }
    }
  `,
  secondary: css`
    background: linear-gradient(180deg, #FFFFFF 0%, #F0F0F0 100%);
    color: ${({ theme }) => theme.colors.ink900};
    border: 1px solid rgba(0,0,0,0.1);
    box-shadow: 
      ${({ theme }) => theme.shadow.skeuoRaised},
      inset 0 1px 0 #fff;
    
    &::after {
      content: '';
      position: absolute;
      top: 1px; left: 1px; right: 1px; height: 40%;
      background: linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 100%);
      pointer-events: none;
      border-radius: inherit;
    }

    &:hover { 
      background: #fff;
      box-shadow: 0 8px 16px rgba(0,0,0,0.08), ${({ theme }) => theme.shadow.skeuoRaised};
    }
    
    &:active {
      background: #E0E0E0;
      box-shadow: ${({ theme }) => theme.shadow.skeuoPressed};
      &::after { opacity: 0; }
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.brand};
    border-radius: 999px;
    &:hover { background: rgba(0,0,0,0.04); }
    &:active { transform: scale(0.98); }
  `,
  danger: css`
    background: linear-gradient(180deg, #FF453A 0%, #D70015 100%);
    color: #fff;
    box-shadow: ${({ theme }) => theme.shadow.skeuoRaised}, inset 0 1px 1px rgba(255,255,255,0.3);
    
    &::after {
      content: '';
      position: absolute;
      top: 1px; left: 1px; right: 1px; height: 40%;
      background: linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 100%);
      pointer-events: none;
      border-radius: inherit;
    }

    &:hover { filter: brightness(1.1); }
    &:active {
      box-shadow: ${({ theme }) => theme.shadow.skeuoPressed};
      background: #B71C1C;
    }
  `,
  success: css`
    background: linear-gradient(180deg, #32D74B 0%, #248A3D 100%);
    color: #fff;
    box-shadow: ${({ theme }) => theme.shadow.skeuoRaised}, inset 0 1px 1px rgba(255,255,255,0.3);
    
    &::after {
      content: '';
      position: absolute;
      top: 1px; left: 1px; right: 1px; height: 40%;
      background: linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 100%);
      pointer-events: none;
      border-radius: inherit;
    }

    &:hover { filter: brightness(1.1); }
    &:active {
      box-shadow: ${({ theme }) => theme.shadow.skeuoPressed};
      background: #1B5E20;
    }
  `,
};

const StyledButton = styled.button<{ $variant: ButtonVariant; $size: ButtonSize }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 700;
  font-family: ${({ theme }) => theme.font.heading};
  cursor: pointer;
  overflow: hidden;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  letter-spacing: -0.01em;
  
  ${(p) => sizeStyles[p.$size]}
  ${(p) => variantStyles[p.$variant]}
  
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.info}50, ${({ theme }) => theme.shadow.skeuoRaised};
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    filter: grayscale(1);
    box-shadow: none;
    &::after { display: none; }
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

