const parseHelper = require('../../src/helpers/parseHelper')
const expect = require('chai').expect

describe('parseHelper', () => {
  describe('parse', () => {
    it('can parse empty string', () => {
      expect(parseHelper.parse(null)).equals('')
      expect(parseHelper.parse('')).equals('')
    })

    it('can parse normal string', () => {
      expect(parseHelper.parse('foo')).equals('foo')
    })

    it('can parse string with double quote', () => {
      expect(parseHelper.parse('"hello"')).equals('hello')
    })

    it('can parse object string', () => {
      const obj = {
        foo: 'FOO',
        bar: 'BAR'
      }
      const objStr = JSON.stringify(obj)
      expect(parseHelper.parse(objStr)).deep.equals(obj)
    })

    it('can parse array string', () => {
      // Arrange
      const obj = [
        {
          foo: 'FOO 1',
          bar: 'BAR 1'
        },
        {
          foo: 'FOO 2',
          bar: 'BAR 2'
        }
      ]
      const objStr = JSON.stringify(obj)

      // Action
      const actual = parseHelper.parse(objStr)

      // Assert
      expect(actual[0]).deep.equals({
        foo: 'FOO 1',
        bar: 'BAR 1'
      })
      expect(actual[1]).deep.equals({
        foo: 'FOO 2',
        bar: 'BAR 2'
      })
    })

    it('can parse stringnified object string', () => {
      // Arrange
      const objStr = '"{\\"foo\\":\\"FOO\\",\\"bar\\":\\"BAR\\"}"'
      const arrayStr = '"[{\\"txid\\":\\"id\\",\\"value\\":\\"value\\"}]"'

      expect(parseHelper.parse(objStr)).deep.equals({
        foo: 'FOO',
        bar: 'BAR'
      })
      expect(parseHelper.parse(arrayStr)[0]).deep.equals({
        txid: 'id',
        value: 'value'
      })
    })
  })
})
