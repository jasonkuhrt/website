import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const content = readFileSync('src/content/til/index.md', 'utf-8')
const lines = content.split('\n')

// Find where content starts (after frontmatter and preamble)
let startIdx = 0
for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith('## ')) {
    startIdx = i
    break
  }
}

const monthMap: Record<string, string> = {
  'Jan': '01',
  'Feb': '02',
  'Mar': '03',
  'Apr': '04',
  'May': '05',
  'Jun': '06',
  'Jul': '07',
  'Aug': '08',
  'Sep': '09',
  'Oct': '10',
  'Nov': '11',
  'Dec': '12',
}

// Split into sections and infer years
const sections: Array<{ heading: string; year: string; month: string; day: string; content: string[] }> = []
let current: { heading: string; year: string; month: string; day: string; content: string[] } | null = null
let lastYear = 2018 // Start with most recent year seen

for (let i = startIdx; i < lines.length; i++) {
  if (lines[i].startsWith('## ')) {
    if (current) sections.push(current)

    const heading = lines[i].replace('## ', '').trim()
    const parts = heading.split(' ')

    let year: string
    let month: string
    let day: string

    // Check if first part is a year (4 digits)
    if (parts[0].length === 4 && !isNaN(Number(parts[0]))) {
      // Format: "2018 Sun Dec 9"
      year = parts[0]
      lastYear = parseInt(year)
      month = parts[2]
      day = parts[3]
    } else {
      // Format: "Wed Nov 15" - infer year
      // Since entries are newest first, entries without year are older than lastYear
      year = (lastYear - 1).toString()
      month = parts[1]
      day = parts[2]
    }

    current = {
      heading,
      year,
      month: monthMap[month],
      day: day.padStart(2, '0'),
      content: [],
    }
  } else if (current) {
    current.content.push(lines[i])
  }
}
if (current) sections.push(current)

// Create individual files
mkdirSync('src/content/til/entries', { recursive: true })

for (const section of sections) {
  const slug = `${section.year}-${section.month}-${section.day}`
  const date = `${section.year}-${section.month}-${section.day}`

  const fileContent = [
    '---',
    `title: '${section.heading}'`,
    `date: ${date}`,
    '---',
    '',
    `## ${section.heading}`,
    ...section.content,
  ].join('\n')

  writeFileSync(`src/content/til/entries/${slug}.md`, fileContent)
  // eslint-disable-next-line no-console
  console.log(`Created: ${slug}.md (${section.heading})`)
}

// eslint-disable-next-line no-console
console.log(`\nTotal: ${sections.length} entries`)
