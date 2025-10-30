import { Str } from '@wollybeard/kit'
import { Order } from 'effect'
import * as S from 'effect/Schema'
import { DateString } from '../DateString.js'

/**
 * Base Experience Class
 *
 * Provides shared behavior for all experience types:
 * - Unique ID generation
 * - Date range formatting
 * - Sorting by date
 */
export class BaseExperience extends S.Class<BaseExperience>('BaseExperience')({
  date: DateString,
}) {
  /**
   * Unique ID for this experience
   *
   * Format: {tag}-{timestamp}
   * Example: "workexperience-1609459200000"
   */
  get id(): string {
    const tag = '_tag' in this && Str.Type.is(this._tag) ? this._tag.toLowerCase() : 'TAGLESS'
    return `${tag}-${this.date.getTime()}`
  }

  /**
   * Format date range for display
   *
   * Handles both single dates and date ranges.
   * If endDate exists, returns "Start - End", otherwise just "Start"
   */
  formatDateRange(): string {
    const start = DateString.format(this.date)

    // Check if this experience has an endDate
    if ('endDate' in this && (this as any).endDate !== undefined) {
      const end = DateString.format((this as any).endDate)
      return `${start} - ${end}`
    }

    return start
  }

  /**
   * Order instance for sorting experiences by date (newest first)
   */
  static readonly Order: Order.Order<BaseExperience> = Order.mapInput(
    Order.reverse(Order.Date),
    (exp: BaseExperience) => exp.date,
  )
}
