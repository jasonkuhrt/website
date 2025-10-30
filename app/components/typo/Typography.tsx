import { styled } from '../../../styled-system/jsx'

export const H1 = styled('h1', {
  base: {
    textStyle: 'heading.1',
  },
})

export const H2 = styled('h2', {
  base: {
    textStyle: 'heading.2',
  },
})

export const H3 = styled('h3', {
  base: {
    textStyle: 'heading.3',
  },
})

export const H4 = styled('h4', {
  base: {
    textStyle: 'heading.4',
  },
})

export const DisplayHero = styled('h1', {
  base: {
    textStyle: 'display.hero',
  },
})

export const DisplayXL = styled('h1', {
  base: {
    textStyle: 'display.xl',
  },
})

export const P = styled('p', {
  base: {
    textStyle: 'body.base',
  },
})

export const Text = styled('span', {
  base: {
    textStyle: 'body.base',
  },
})

export const Link = styled('a', {
  base: {
    color: 'accent.default',
    textDecoration: 'underline',
    transition: 'color {durations.fast}',
    _hover: {
      color: 'accent.dark',
    },
  },
})

export const Code = styled('code', {
  base: {
    fontFamily: 'mono',
    fontSize: 'sm',
    backgroundColor: 'bg.subtle',
    padding: '0.5 1',
    borderRadius: 'radii.sm',
  },
})

export const Pre = styled('pre', {
  base: {
    fontFamily: 'mono',
    fontSize: 'sm',
    backgroundColor: 'bg.subtle',
    padding: '4',
    borderRadius: 'radii.md',
    overflowX: 'auto',
    marginBottom: '4',
  },
})

export const Blockquote = styled('blockquote', {
  base: {
    borderLeft: '4px solid',
    borderColor: 'border.default',
    paddingLeft: '4',
    marginLeft: 0,
    marginBottom: '4',
    fontStyle: 'italic',
    color: 'text.secondary',
  },
})

export const Ul = styled('ul', {
  base: {
    listStyle: 'disc',
    paddingLeft: '6',
    marginBottom: '4',
  },
})

export const Ol = styled('ol', {
  base: {
    listStyle: 'decimal',
    paddingLeft: '6',
    marginBottom: '4',
  },
})

export const Li = styled('li', {
  base: {
    marginBottom: '2',
  },
})
