import * as S from 'effect/Schema'

/**
 * Date schema that handles both Date objects and date strings.
 * gray-matter may return either depending on YAML format.
 */
export const FlexibleDate = S.transform(
  S.Union(S.DateFromSelf, S.String),
  S.DateFromSelf,
  {
    decode: (input) => input instanceof Date ? input : new Date(input),
    encode: (date) => date,
  },
)
