import React from 'react';
import styled, { keyframes, useTheme } from 'styled-components';

const move = keyframes`
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
`;

const moveAlt = keyframes`
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-40px, 40px) scale(1.2); }
  100% { transform: translate(0, 0) scale(1); }
`;

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  /* Use a slightly deeper base for light mode to let the colors pop, pure black for dark */
  background: ${({ theme }) => theme.colors.appearance === 'dark' ? '#000000' : '#E8E8ED'};
  
  /* Strong Mesh Gradient for all-over color */
  background-image: ${({ theme }) => `
    radial-gradient(at 0% 0%, ${theme.colors.brand}60 0, transparent 80%),
    radial-gradient(at 100% 0%, ${theme.colors.info}55 0, transparent 80%),
    radial-gradient(at 50% 50%, ${theme.colors.brand}20 0, transparent 80%),
    radial-gradient(at 100% 100%, ${theme.colors.info}50 0, transparent 80%),
    radial-gradient(at 0% 100%, ${theme.colors.brand}45 0, transparent 80%)
  `};
  overflow: hidden;
  pointer-events: none;
`;

const Blob = styled.div<{ $color: string; $size: string; $top: string; $left: string; $anim: any; $delay: string }>`
  position: absolute;
  width: ${props => props.$size};
  height: ${props => props.$size};
  top: ${props => props.$top};
  left: ${props => props.$left};
  background: ${props => props.$color};
  filter: blur(140px); /* Massive blur for smooth transitions */
  border-radius: 50%;
  opacity: 0.6; /* Very vibrant */
  animation: ${props => props.$anim} 25s infinite ease-in-out;
  animation-delay: ${props => props.$delay};
`;

export const ThemeBackground: React.FC = () => {
  const theme = useTheme() as any;

  return (
    <BackgroundContainer aria-hidden="true">
      {/* Top Left - Brand Primary */}
      <Blob
        $color={theme.colors.brand}
        $size="1000px"
        $top="-250px"
        $left="-250px"
        $anim={move}
        $delay="0s"
      />

      {/* Bottom Right - Info Blue */}
      <Blob
        $color={theme.colors.info}
        $size="900px"
        $top="30%"
        $left="40%"
        $anim={moveAlt}
        $delay="-5s"
      />

      {/* Top Right - Accent */}
      <Blob
        $color={theme.colors.brand}
        $size="600px"
        $top="-100px"
        $left="60%"
        $anim={move}
        $delay="-10s"
      />

      {/* Bottom Left - Accent */}
      <Blob
        $color={theme.colors.info}
        $size="700px"
        $top="60%"
        $left="-100px"
        $anim={moveAlt}
        $delay="-15s"
      />

      {/* Surface Overlay - very low opacity just to tie it together */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at center, transparent 0%, ${theme.colors.surface0} 100%)`,
        opacity: 0.1
      }} />
    </BackgroundContainer>
  );
};
