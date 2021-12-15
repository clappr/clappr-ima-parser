module.exports = {
  verbose: true,
  transform: { '^.+\\.js$': 'babel-jest' },
  collectCoverageFrom: [
    'src/*.js',
    'src/*/*.js',
    'src/*/*/*.js',
    '!src/converts/xml2json.js',
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
}
