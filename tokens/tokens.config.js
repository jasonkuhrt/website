import StyleDictionary from 'style-dictionary'

export default {
  source: [
    'tokens/base/**/*.json',
    'tokens/semantic/**/*.json'
  ],

  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'app/styles/',
      files: [
        {
          destination: 'tokens.generated.css',
          format: 'css/variables',
          options: {
            outputReferences: true,
            selector: ':root'
          }
        }
      ]
    }
  }
}
