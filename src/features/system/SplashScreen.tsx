import React from 'react';
import styled, { keyframes } from 'styled-components';

type SplashScreenProps = {
  ready: boolean;
  onContinue?: () => void;
  exiting?: boolean;
};

// iPad-first splash with subtle pulse and teaching motif
const Container = styled.div<{ $exiting?: boolean; $ready?: boolean }>`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(1200px 800px at 50% 50%, #0b1020 0%, #0b0f1a 50%, #0a0e16 100%);
  z-index: 2000;
  opacity: ${p => p.$exiting ? 0 : 1};
  transition: opacity 400ms ease-out;
  cursor: ${p => p.$ready ? 'pointer' : 'default'};
  overflow: hidden;
`;

const Card = styled.div`
  width: min(720px, 90vw);
  height: min(540px, 82vh);
  border-radius: 18px;
  background: linear-gradient(180deg, #0e1425, #0a0f1a);
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.5);
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  place-items: center;
  position: relative;
  z-index: 1;
  @media (max-width: 820px) {
    height: auto;
  }
`;

const BooksBackdrop = styled.div`
  position: absolute;
  inset: -5%;
  background-image:
    url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900"><g fill="none" stroke="%235b6b7a" stroke-width="2" opacity="0.35"><rect x="60" y="80" width="220" height="140" rx="8"/><line x1="80" y1="120" x2="260" y2="120"/><line x1="80" y1="150" x2="260" y2="150"/><rect x="360" y="200" width="260" height="160" rx="8"/><line x1="380" y1="240" x2="580" y2="240"/><line x1="380" y1="280" x2="580" y2="280"/><rect x="700" y="140" width="280" height="160" rx="8"/><line x1="720" y1="180" x2="940" y2="180"/><line x1="720" y1="220" x2="940" y2="220"/></g></svg>'),
    radial-gradient(closest-side, rgba(209,193,118,0.08), rgba(209,193,118,0));
  background-size: 1200px 900px, cover;
  background-repeat: repeat, no-repeat;
  filter: blur(10px);
  transform: scale(1.06);
  z-index: 0;
  pointer-events: none;
`;

const flash = keyframes`
  0% { opacity: 0.4; }
  50% { opacity: 1; }
  100% { opacity: 0.4; }
`;

const Frame = styled.div`
  position: absolute;
  inset: 24px;
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0));
  box-shadow: inset 0 0 0 1px rgba(209,193,118,0.6), 0 0 0 2px rgba(209,193,118,0.25);
`;

const TitleWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const AccentLine = styled.div`
  width: 40%;
  height: 1px;
  background: linear-gradient(90deg, rgba(209,193,118,0), rgba(209,193,118,0.9), rgba(209,193,118,0));
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 40px;
  text-align: center;
`;

const Title = styled.h1`
  font-family: 'Cinzel', serif;
  font-size: clamp(28px, 4.2vw, 48px);
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: #e5e7eb;
  font-weight: 600;
`;

const Subtitle = styled.p`
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(14px, 1.8vw, 22px);
  color: #cbd5e1;
`;

const ProgressBar = styled.div`
  height: 6px;
  width: min(420px, 70%);
  background: rgba(255,255,255,0.08);
  border-radius: 999px;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.1);
`;

const ProgressFill = styled.div`
  height: 100%;
  width: 38%;
  background: linear-gradient(90deg, #c28e0e, #d1c176);
  animation: loading 1.8s ease-in-out infinite;
  @keyframes loading {
    0% { width: 18%; }
    50% { width: 76%; }
    100% { width: 38%; }
  }
`;

const TapHint = styled.div`
  margin-top: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #0b1020;
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  letter-spacing: 0.4px;
  font-size: clamp(16px, 2.0vw, 22px);
  background: linear-gradient(180deg, rgba(209,193,118,0.2), rgba(209,193,118,0.1));
  border: 1px solid rgba(209,193,118,0.5);
  border-radius: 999px;
  padding: 10px 18px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.25);
  animation: ${flash} 1.8s ease-in-out infinite;
`;

export function SplashScreen({ ready, onContinue, exiting }: SplashScreenProps) {
  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (!ready || !onContinue) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onContinue();
    }
  };
  return (
    <Container
      role={ready ? 'button' : 'dialog'}
      aria-label={ready ? 'Tap to continue' : 'Loading application'}
      tabIndex={ready ? 0 : -1}
      onKeyDown={handleKeyDown}
      onClick={ready && onContinue ? onContinue : undefined}
      $exiting={exiting}
      $ready={ready}
    >
      <BooksBackdrop aria-hidden />
      <Card>
        <Frame />
        <Content>
          <TitleWrap>
            <Title>Preparing your teaching workspace</Title>
            <AccentLine />
            <Subtitle>Loading students, lessons, and calendar. Optimized for iPad.</Subtitle>
          </TitleWrap>
          {!ready && (
            <ProgressBar>
              <ProgressFill />
            </ProgressBar>
          )}
          {ready && (
            <TapHint aria-live="polite">Tap to continue</TapHint>
          )}
        </Content>
      </Card>
    </Container>
  );
}

export default SplashScreen;
