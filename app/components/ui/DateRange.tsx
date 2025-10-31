import { DateString } from '../../data/schemas/DateString'
import { T } from '../__'
import { hiddenSmall } from './responsive'

interface Props {
  /**
   * Start date
   */
  startDate: Date
  /**
   * End date (optional)
   */
  endDate?: Date
  /**
   * Display variant
   * @default 'inline'
   */
  variant?: 'inline' | 'block'
  /**
   * Show dash separator on small screens
   * @default true
   */
  showDash?: boolean
}

/**
 * Date range component for displaying start and end dates.
 * Commonly used in timeline and table views.
 */
export const DateRange: React.FC<Props> = ({
  startDate,
  endDate,
  variant = 'inline',
  showDash = true,
}) => {
  const display = variant === 'inline' ? 'inline-block' : 'block'

  return (
    <>
      <T.Text as='span' display={display} fontSize='2' color='text.secondary'>
        {DateString.format(startDate)}
      </T.Text>
      {endDate && (
        <>
          {showDash && (
            <T.Text as='span' className={hiddenSmall} fontSize='2' color='text.secondary'>
              -
            </T.Text>
          )}
          <T.Text as='span' display={display} fontSize='2' color='text.secondary'>
            {DateString.format(endDate)}
          </T.Text>
        </>
      )}
    </>
  )
}
