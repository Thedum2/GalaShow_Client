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
    subtitle?: string;
    color: "blue" | "green" | "gray" | "indigo";
    buttonText: string;
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

