import React from 'react';

export interface Step {
    icon: React.ReactElement;
    title: string;
    desc: string;
}

export interface StepsBoxProps {
    steps: Step[];
}

export interface LoginCardProps {
  title: string;
  color: string;
  buttonText: string;
  buttonIcon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  logo?: React.ReactNode;
  glow?: string;
}

export interface RibbonProps {
    text: string;
    rotate?: number;
    top?: string;
    left?: string;
    width?: string;
    speedSec?: number;
    theme?: "light" | "dark";
}

