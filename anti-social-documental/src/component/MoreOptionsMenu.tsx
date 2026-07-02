import { useState, type MouseEvent, type ReactNode } from 'react'
import { MoreVertical } from 'lucide-react'
// @ts-ignore: allow importing CSS without type declarations
import '../styles/moreOptionsMenu.css'

type MoreOptionsMenuItem = {
    label: string
    icon: ReactNode
    onClick: () => void
    className?: string
}

type MoreOptionsMenuProps = {
    menuItems: MoreOptionsMenuItem[]
    title?: string
    className?: string
}

const MoreOptionsMenu = ({ menuItems, title = 'Más opciones', className = '' }: MoreOptionsMenuProps) => {
    const [showMenu, setShowMenu] = useState(false)

    const handleButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()
        setShowMenu((prev) => !prev)
}

const handleItemClick = (event: MouseEvent<HTMLButtonElement>, onClick: () => void) => {
    event.stopPropagation()
    setShowMenu(false)
    onClick()
}

return (
    <div className={`more-options-menu ${className}`}>
    <button
        type="button"
        className="more-options-menu__button"
        onClick={handleButtonClick}
        title={title}
    >
        <MoreVertical size={18} />
    </button>

    {showMenu && (
        <div className="more-options-menu__dropdown">
        {menuItems.map((item, index) => (
            <button
            key={index}
            type="button"
            className={`more-options-menu__item ${item.className ?? ''}`}
            onClick={(event) => handleItemClick(event, item.onClick)}
            >
            {item.icon}
            {item.label}
            </button>
        ))}
        </div>
    )}
    </div>
)
}

export default MoreOptionsMenu
