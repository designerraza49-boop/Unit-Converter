import type { ReactNode } from 'react';

export interface Unit {
  name: string;
  symbol: string;
  factor: number;
}

export interface ConverterCategory {
  name: string;
  icon: ReactNode;
  units: Unit[];
}

export interface Tool {
  name: string;
  icon: ReactNode;
  component: ReactNode;
}

export interface Calculator {
    name: string;
    icon: ReactNode;
    component: ReactNode;
}

export interface AiFeature {
    name: string;
    description: string;
    icon: ReactNode;
    component: ReactNode;
}
