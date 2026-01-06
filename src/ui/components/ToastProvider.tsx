import React, { createContext, useContext, useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastContextType {
    showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};

const slideIn = keyframes`
  from { transform: translateX(100%) scale(0.9); opacity: 0; }
  to { transform: translateX(0) scale(1); opacity: 1; }
`;

const slideOut = keyframes`
  from { transform: translateX(0) scale(1); opacity: 1; }
  to { transform: translateX(100%) scale(0.9); opacity: 0; }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 9999;
  pointer-events: none;
`;

const ToastItem = styled.div<{ $type: ToastType; $exiting: boolean }>`
  pointer-events: auto;
  min-width: 300px;
  max-width: 400px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(40px) saturate(200%);
  -webkit-backdrop-filter: blur(40px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15), ${({ theme }) => theme.shadow.liquidGlass};
  animation: ${props => props.$exiting ? slideOut : slideIn} 0.4s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(255,255,255,0.1) 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
`;

const IconWrapper = styled.div<{ $type: ToastType }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: ${props => {
        switch (props.$type) {
            case 'success': return 'rgba(50, 215, 75, 0.2)';
            case 'error': return 'rgba(255, 69, 58, 0.2)';
            default: return 'rgba(10, 132, 255, 0.2)';
        }
    }};
  color: ${props => {
        switch (props.$type) {
            case 'success': return '#32D74B';
            case 'error': return '#FF453A';
            default: return '#0A84FF';
        }
    }};
`;

const Message = styled.span`
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ink900};
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.ink400};
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s;
  &:hover { background: rgba(0,0,0,0.05); color: ${({ theme }) => theme.colors.ink600}; }
`;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [exitingIds, setExitingIds] = useState<Set<string>>(new Set());

    const showToast = useCallback((message: string, type: ToastType) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id, type, message }]);

        setTimeout(() => {
            setExitingIds(prev => new Set(prev).add(id));
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
                setExitingIds(prev => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                });
            }, 400);
        }, 4000);
    }, []);

    const removeToast = (id: string) => {
        setExitingIds(prev => new Set(prev).add(id));
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 400);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastContainer>
                {toasts.map(toast => (
                    <ToastItem key={toast.id} $type={toast.type} $exiting={exitingIds.has(toast.id)}>
                        <IconWrapper $type={toast.type}>
                            {toast.type === 'success' && <CheckCircle size={20} />}
                            {toast.type === 'error' && <AlertCircle size={20} />}
                            {toast.type === 'info' && <Info size={20} />}
                        </IconWrapper>
                        <Message>{toast.message}</Message>
                        <CloseButton onClick={() => removeToast(toast.id)}>
                            <X size={16} />
                        </CloseButton>
                    </ToastItem>
                ))}
            </ToastContainer>
        </ToastContext.Provider>
    );
};
