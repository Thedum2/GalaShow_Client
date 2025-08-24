import * as React from 'react'

type SVGRComponent = React.ComponentType<React.SVGProps<SVGSVGElement> & { title?: string }>


const lazyModules = import.meta.glob('../../assets/svg/**/*.svg', { import: 'default' }) as Record<
    string,
    () => Promise<{ default: SVGRComponent }>
>
const eagerModules = import.meta.glob('../../assets/svg/**/*.svg', {
    eager: true,
    import: 'default',
}) as Record<string, SVGRComponent>

type LazyReg = Record<string, () => Promise<{ default: SVGRComponent }>>
type EagerReg = Record<string, SVGRComponent>

const buildLazyRegistry = (): LazyReg => {
    const reg: LazyReg = {}
    for (const path in lazyModules) {
        const base = path.split('/').pop()!.replace(/\.svg$/i, '')
        if (!reg[base]) reg[base] = lazyModules[path]
    }
    return reg
}

const buildEagerRegistry = (): EagerReg => {
    const reg: EagerReg = {}
    for (const path in eagerModules) {
        const base = path.split('/').pop()!.replace(/\.svg$/i, '')
        const Cmp = eagerModules[path]
        if (!reg[base]) reg[base] = Cmp
    }
    return reg
}


const LAZY_REG = buildLazyRegistry()
const EAGER_REG = buildEagerRegistry()

export type IconProps = {
    name: string
    size?: number | string
    color?: string
    title?: string
    className?: string
    mode?: 'lazy' | 'eager'
} & Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height' | 'color' | 'title'>

function FallbackBox({
                         size = '1em',
                         color = 'currentColor',
                         className,
                     }: Pick<IconProps, 'size' | 'color' | 'className'>) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" role="img" aria-hidden className={className}>
            <rect x="3" y="3" width="18" height="18" fill="none" stroke={color} strokeWidth="1.5" />
            <path d="M7 7l10 10M17 7L7 17" stroke={color} strokeWidth="1.5" />
        </svg>
    )
}

export function Icon({
                         name,
                         size = '1em',
                         color = 'currentColor',
                         title,
                         className,
                         mode = 'lazy',
                         style,
                         ...rest
                     }: IconProps) {

    const exists = mode === 'eager' ? !!EAGER_REG[name] : !!LAZY_REG[name]
    if (!exists) {
        if (import.meta.env.DEV) console.warn(`[Icon] SVG not found: "${name}"`)
        return <FallbackBox size={size} color={color} className={className} />
    }

    if (mode === 'eager') {
        const Cmp = EAGER_REG[name]!
        return (
            <Cmp
                width={size}
                height={size}
                className={className}
                title={title}
                aria-hidden={title ? undefined : true}
                role="img"
                style={{ color, ...style }}
                {...rest}
            />
        )
    }

    const LazyCmp = React.useMemo(() => React.lazy(LAZY_REG[name]!), [name])
    return (
        <React.Suspense fallback={<FallbackBox size={size} color={color} className={className} />}>
            <LazyCmp
                width={size}
                height={size}
                className={className}
                title={title}
                aria-hidden={title ? undefined : true}
                role="img"
                style={{ color, ...style }}
                {...rest}
            />
        </React.Suspense>
    )
}

export default Icon
