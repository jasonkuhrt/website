import * as S from 'effect/Schema'

/**
 * DateString - transforms ISO date string to Date object with formatting utilities
 */
export class DateString extends S.DateFromString {
  /**
   * Create a Date from a string
   */
  static make = (str: string) => S.decodeUnknownSync(DateString)(str)

  /**
   * Format a Date object for display
   */
  static format(date: Date | undefined): string {
    if (!date) return 'Present'
    const month = date.toLocaleString('en-US', { month: 'short' })
    const year = date.getFullYear()
    return `${month} ${year}`
  }
}
