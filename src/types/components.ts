import React from 'react';
import {VictoryOptionId} from "@/components/lobby/VictoryConditions";

export interface Step {
    icon: React.ReactElement;
    title: string;
    desc: string;
    iconBgColor?: string;
}

export interface LoginCardProps {
  title: string;
  subtext?: string;
  color: string;
  titleColor?: string;
  subtextColor?: string;
  buttonText: string;
  buttonIcon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  logo?: React.ReactNode;
  glow?: string;
  borderWidth?: number | string;
  borderColor?: string;
}

export interface LoginedCardProps {
    title: string;
    colorForConnected?: string;
    colorForDisConnect?: string;
    titleColor?: string;
    buttonTextForConnected?: string;
    buttonTextForDisConnect?: string;
    buttonIconForConnected?: React.ReactNode;
    buttonIconForDisConnect?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    logo?: React.ReactNode;
    loginedIcon?: React.ReactNode;
    glow?: string;
    borderWidth?: number | string;
    borderColor?: string;
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

export interface HostInformationProps {
    logoText?: string;
    streamerTag: string;
    viewerCountLabel: string;
    hostName: string;
    description: string;
    ratingLabel: string;
    imageUrl? :string
    isLive?: boolean;
    className?: string;
}


export interface ParticipantListItem {
    id: string;
    name: string;
    avatarUrl: string;
    detail?: string;
    badgeClassName?: string;
    joinedAt?: string | number | Date;
}

type ActionVariant = "primary" | "warning" | "danger";

export interface ParticipantListAction {
    label: string;
    onClick?: () => void;
    variant?: ActionVariant;
    active?: boolean;
}

export interface ParticipantListProps {
    title: string;
    currentCount: number;
    capacity: number;
    participants: ParticipantListItem[];
    searchPlaceholder?: string;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    onRefresh?: () => void;
    onRemove?: (participantId: string) => void;
    actionButtons?: ParticipantListAction[];
    className?: string;
}

export interface ParticipantListItem {
    id: string;
    name: string;
    avatarUrl: string;
    detail?: string;
    badgeLabel?: string;
    badgeClassName?: string;
    joinedAt?: string | number | Date;
}

export interface ParticipantListAction {
    label: string;
    onClick?: () => void;
    variant?: "primary" | "warning" | "danger";
    active?: boolean;
}

export const ACTION_BUTTON_STYLES = {
    primary: "bg-green-600 hover:bg-green-700",
    warning: "bg-yellow-600 hover:bg-yellow-700",
    danger: "bg-red-600 hover:bg-red-700",
} as const;

export interface ParticipationInstructions {
    prefix: string;
    highlight: string;
    suffix: string;
}

export interface ParticipationOption {
    label: string;
    value: string;
}

export type HeightVal = number | string;

export interface ParticipationProps {
    title: string;
    instructions: ParticipationInstructions;
    helperText: string;
    maxLabel: string;
    maxOptions: ParticipationOption[];
    selectedMaxOption: string;
    onMaxOptionChange?: (value: string) => void;
    totalCount: number;
    totalCountCaption: string;
    className?: string;
}

export interface SelectionTimeProps {
    title: string;
    descriptionPrefix: string;
    descriptionSuffix: string;
    availableTimes?: number[];
    selectedTime: number;
    onSelectTime: (time: number) => void;
    timeUnit?: string;
    className?: string;
}

export interface ParticipationSelectionProps {
    title: string;
    items: {
        id: string;
        name: string;
        avatarUrl: string;
        bgColor: string;
    }[];
    className?: string;
}

export const DEFAULT_TIME_OPTIONS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

export type StartGameButtonProps = {
    text?: string;
    icon?: React.ReactNode;
    backgroundColor?: string;
    textColor?: string;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
};

export interface VictoryConditionsProps {
    selectedOption: VictoryOptionId;
    onSelectOption: (option: VictoryOptionId) => void;
    survivorCount: number;
    onSurvivorCountChange?: (count: number) => void;
    roundCount: number;
    onRoundCountChange?: (count: number) => void;
    minSurvivorCount?: number;
    maxSurvivorCount?: number;
    minRoundCount?: number;
    className?: string;
}