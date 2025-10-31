import { css } from '#styled-system/css'

const overlay = css({
  position: 'fixed',
  top: '1',
  left: '0',
  inset: '0',
  pointerEvents: 'none',
  backgroundImage: `repeating-linear-gradient(
    180deg,
    black 0px,
    black 1px,
    transparent 1px,
    transparent 6px
  )`,
  opacity: '10',
})

export const VerticalRhythmOverlay: React.FC = () => {
  return <div className={overlay} aria-hidden='true' />
}
