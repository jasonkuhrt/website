import { MapPin } from 'lucide-react'
import { css } from '../../../styled-system/css'
import { Flex } from '../../../styled-system/jsx'
import { T, UI } from '../__'

const locationIconInline = css({
  display: 'inline-block',
  marginRight: '1',
})

interface Props {
  /**
   * Location text to display
   */
  location: string
  /**
   * Display variant
   * - 'inline': Icon and text in a single text element
   * - 'flex': Icon and text in a flex row
   * @default 'flex'
   */
  variant?: 'inline' | 'flex'
}

/**
 * A location badge with MapPin icon and location text.
 * Used to display the user's location in profile sections.
 */
export const LocationBadge: React.FC<Props> = ({
  location,
  variant = 'flex',
}) => {
  if (variant === 'inline') {
    return (
      <T.Text textStyle='body.sm' fontFamily='sans' color='text.tertiary'>
        <UI.Icon size='md' className={locationIconInline}>
          <MapPin />
        </UI.Icon>
        {location}
      </T.Text>
    )
  }

  return (
    <Flex align='center' gap='2' color='text.tertiary'>
      <UI.Icon size='md'>
        <MapPin />
      </UI.Icon>
      <T.Text>{location}</T.Text>
    </Flex>
  )
}
