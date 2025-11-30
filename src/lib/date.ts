const shortFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

const longFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

export const formatDateShort = (date: Date): string => shortFormatter.format(date)

export const formatDateLong = (date: Date): string => longFormatter.format(date)
