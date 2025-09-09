import styled from 'styled-components';
import React from 'react';

export type PillStatus = 'pending' | 'confirmed' | 'canceled' | 'waitlist';

export function StatusPill({ status, style }: { status: PillStatus; style?: React.CSSProperties }) {
  return <Pill $status={status} style={style}>{status}</Pill>;
}

const Pill = styled.span<{ $status: PillStatus }>`
  display: inline-flex;
  align-items: center;
  line-height: 1;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
  border: 1px solid transparent;
  ${(p) => p.$status === 'pending' && `background:#FEF3C7;color:#92400E;border-color:#FDE68A;`}
  ${(p) => p.$status === 'confirmed' && `background:#D1FAE5;color:#065F46;border-color:#A7F3D0;`}
  ${(p) => p.$status === 'canceled' && `background:#FECACA;color:#991B1B;border-color:#FCA5A5;text-decoration: line-through;`}
  ${(p) => p.$status === 'waitlist' && `background:#EDE9FE;color:#5B21B6;border-color:#DDD6FE;`}
`;

