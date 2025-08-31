import React from 'react';

export interface Step {
    icon: React.ReactElement;
    title: string;
    desc: string;
    iconBgColor?: string;
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

export interface StepsBoxProps {
    title: string;
    stepSets: Step[][];
}

export interface StepExtra{
    mediaUrl?: string;
    media?: React.ReactNode;
    progress?: number;
    accent?: string;
}