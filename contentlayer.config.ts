import { defineDocumentType, makeSource } from 'contentlayer/source-files'

export const Log = defineDocumentType(() => ({
  name: 'Log',
  filePathPattern: `*.md`,
  fields: {
    title: {
      type: 'string',
      description: 'The title of the post',
      required: true,
    },
    date: {
      type: 'date',
      description: 'The date of the post',
      required: true,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (log) => `/logs/${log._raw.flattenedPath}`,
    },
  },
}))

export default makeSource({
  contentDirPath: 'logs',
  documentTypes: [Log],
})
