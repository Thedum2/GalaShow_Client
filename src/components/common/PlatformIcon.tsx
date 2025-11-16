import React from 'react';
import Icon from '@/components/icons/Icon';
import {PlatformIconProps, PlatformType} from "@/types/common";
import {PlatformConfig} from "@/types/domain/platform";

const PLATFORM_CONFIGS: Record<PlatformType, PlatformConfig> = {
    chzzk: {
        iconName: 'chzzk_mini',
        bgColor: '#000000',
        iconSize: 22,
    },
    soop: {
        iconName: 'soopmini',
        bgColor: '#0545B1',
        iconSize: 21,
    },
    youtube: {
        iconName: 'youtube',
        bgColor: '#DDDDDD',
        iconSize: 24,
    },
};



export const PlatformIcon: React.FC<PlatformIconProps> = ({
    platform,
    size = 50,
    className = '',
}) => {
    const config = PLATFORM_CONFIGS[platform];

    return (
        <div
            className={`border-[1px] border-white rounded-full flex items-center justify-center flex-shrink-0 ${className}`}
            style={{
                backgroundColor: config.bgColor,
                width: `${size}px`,
                height: `${size}px`
            }}
        >
            <Icon
                name={config.iconName}
                size={config.iconSize}
                mode="eager"
            />
        </div>
    );
};

export function getRandomPlatform(id: string): PlatformType {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const types: PlatformType[] = ['chzzk', 'soop', 'youtube'];
    return types[hash % types.length];
}
