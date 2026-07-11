import { badgeColors } from '../components/ui/Badge'

export function getBadgeColor(value: string) {
    const BADGE_COLORS = Object.keys(badgeColors)

    let hash = 0

    for (let i = 0; i < value.length; i++) {
        hash = (hash * 31 + value.charCodeAt(i)) >>> 0
    }
    return BADGE_COLORS[hash % BADGE_COLORS.length]
}
