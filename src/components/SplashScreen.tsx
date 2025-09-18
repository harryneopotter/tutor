import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const SplashContainer = styled.div<{ $visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
  color: ${({ theme }) => theme.colors.ink900};
  z-index: 9999;
  animation: ${({ $visible }) => ($visible ? fadeIn : fadeOut)} 0.5s forwards;
  cursor: pointer;
`;

const Title = styled.h1`
  font-family: 'Dancing Script', cursive;
  font-size: 4.5rem;
  font-weight: 400;
  animation: ${fadeIn} 1s forwards;
`;

const Subtitle = styled.p`
  margin-top: 1rem;
  font-size: 1.25rem;
  font-weight: 300;
  animation: ${fadeIn} 1s 2.5s forwards;
  opacity: 0;
`;

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [showTapToContinue, setShowTapToContinue] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTapToContinue(true);
    }, 2000); // Wait 2s before showing "Tap to Continue"

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    if (showTapToContinue) {
      setIsExiting(true);
      setTimeout(onFinish, 500); // Match fade-out duration
    }
  };

  return (
    <SplashContainer $visible={!isExiting} onClick={handleClick}>
      <Title>Tutor App Draft</Title>
      {showTapToContinue && <Subtitle>Tap to Continue</Subtitle>}
    </SplashContainer>
  );
};

export default SplashScreen;
