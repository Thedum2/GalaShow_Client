import { createPortal } from 'react-dom'
import Ribbon from './Ribbon'

type RibbonOverlayProps = React.ComponentProps<typeof Ribbon>

export default function RibbonOverlay(props: RibbonOverlayProps) {
    if (typeof document === 'undefined') return null
    return createPortal(<Ribbon {...props} />, document.body)
}
