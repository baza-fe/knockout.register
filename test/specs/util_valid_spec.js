import {
    isObject,
    valid,
    validProp,
    validObject,
    validWithin,
    validArray
} from '../../src/util/'

beforeAll(() => {
  console._error = console.error
  console.error = () => {}
})

afterAll(() => {
  console.error = console._error
})

const string = 'string'
const number = 1
const boolean = true

describe('validProp', () => {
  it('should return true', () => {
    expect(validProp(string, string, {}, ko.types.String)).toBe(true)
  })

  it('should return false', () => {
    expect(validProp(string, number, {}, ko.types.String)).toBe(false)
  })

  it('should create prop', () => {
    const data = {}

    validProp(string, string, data, ko.types.String)
    expect(data[string]).toBe(string)
  })

  it('should create prop with default', () => {
    const data = {}
    const value = undefined

    validProp(string, value, data, { type: ko.types.String, default: string })
    expect(data[string]).toBe(string)
  })

  it('should reuse observabled prop', () => {
    const data = {}
    const value = ko.observable(string)

    validProp(string, value, data, { type: ko.types.String })
    expect(data[string]).toBe(value)
  })

  it('should log error for observabled prop', () => {
    const data = {}
    const value = ko.observable(1)

    spyOn(console, 'error')
    validProp(string, value, data, { type: ko.types.String })
    expect(console.error).toHaveBeenCalledWith('Invalid prop: key: string, expect: ko.types.String, actual: 1')
  })

  it('should log error: Invalid prop', () => {
    const data = {}

    spyOn(console, 'error')
    expect(validProp(string, number, data, { type: ko.types.String })).toBe(false)
    expect(console.error).toHaveBeenCalledWith('Invalid prop: key: string, expect: ko.types.String, actual: 1')
  })

  it('should log error: Missing required prop', () => {
    const data = {}
    const value = undefined

    spyOn(console, 'error')
    expect(validProp(string, value, data, { type: ko.types.String, required: true })).toBe(false)
    expect(console.error).toHaveBeenCalledWith('Invalid prop: Missing required prop: string')
  })

  it('should log warnning: Need prop', () => {
    const data = {}
    const value = undefined

    spyOn(console, 'warn')
    expect(validProp(string, value, data, { type: ko.types.String })).toBe(true)
    expect(console.warn).toHaveBeenCalledWith('Need prop: key: string, expect: ko.types.String, actual: undefined')
    expect(data[string]).toBe(value)
  })
})

describe('validObject', () => {
  const shape = ko.types.shape({
    p1: ko.types.String,
    p2: ko.types.String
  })

  it('should return true', () => {
    expect(validObject(string, { p1: string, p2: string }, {}, shape)).toBe(true)
  })

  it('should return false', () => {
    expect(validObject(string, { p1: number, p2: number }, {}, shape)).toBe(false)
  })

  it('should reuse observabled prop', () => {
    const data = {}
    const value = ko.observable({ p1: string, p2: string })

    validObject(string, value, data, shape)
    expect(data[string]).toBe(value)
  })

  it('should log error for observabled prop', () => {
    const data = {}
    const value = ko.observable({ p1: number, p2: number })

    spyOn(console, 'error')
    validObject(string, value, data, shape)
    expect(console.error).toHaveBeenCalledWith('Invalid prop: key: p1, expect: ko.types.String, actual: 1')
  })

  it('should log warnning: Need prop', () => {
    const data = {}
    const value = { p1: undefined, p2: undefined }

    spyOn(console, 'warn')
    validObject(string, value, data, shape)
    expect(console.warn).toHaveBeenCalledWith('Need prop: key: p1, expect: ko.types.String, actual: undefined')
    expect(console.warn).toHaveBeenCalledWith('Need prop: key: p1, expect: ko.types.String, actual: undefined')
    expect(data[string].p1).toBe(value.p1)
    expect(data[string].p2).toBe(value.p2)
  })
})

describe('validWithin', () => {
  const oneOfType = ko.types.oneOfType(
        ko.types.String,
        ko.types.Number,
        ko.types.Boolean
    )

  it('should return true', () => {
    expect(validWithin(string, string, {}, oneOfType)).toBe(true)
    expect(validWithin(string, number, {}, oneOfType)).toBe(true)
    expect(validWithin(string, boolean, {}, oneOfType)).toBe(true)
  })

  it('should return false', () => {
    expect(validWithin(string, string, {}, [])).toBe(false)
    expect(validWithin(string, number, {}, [])).toBe(false)
    expect(validWithin(string, boolean, {}, [])).toBe(false)
  })

  it('should create prop', () => {
    const data = {}

    validWithin(string, string, data, oneOfType)
    expect(data[string]).toBe(string)
  })

  it('should reuse observabled prop', () => {
    const data = {}
    const value = ko.observable(string)

    validWithin(string, value, data, oneOfType)
    expect(data[string]).toBe(value)
  })

  it('should log error for observabled prop', () => {
    const data = {}
    const value = ko.observable(null)

    spyOn(console, 'error')
    validWithin(string, value, data, oneOfType)
    expect(console.error).toHaveBeenCalledWith('Invalid prop: key: 0, expect: ko.types.String, actual: null')
  })

  it('should log warnning: Need prop', () => {
    const data = {}
    const value = undefined

    spyOn(console, 'warn')
    validWithin(string, value, data, oneOfType)
    expect(console.warn).toHaveBeenCalledWith('Need prop: key: 0, expect: ko.types.String, actual: undefined')
    expect(data[string]).toBe(value)
  })
})

describe('validArray', () => {
  const arrayOfString = ko.types.arrayOf(ko.types.String)
  const arrayOfShape = ko.types.arrayOf(
        ko.types.shape({
          p1: ko.types.String,
          p2: ko.types.String
        })
    )

  it('should return true', () => {
    expect(validArray(string, [ string, string, string ], {}, arrayOfString[0])).toBe(true)
    expect(validArray(string, [
      {
        p1: string,
        p2: string
      },
      {
        p1: string,
        p2: string
      },
      {
        p1: string,
        p2: string
      }
    ], {}, arrayOfShape[0])).toBe(true)
  })

  it('should return false', () => {
    expect(validArray(string, [ number, number, number ], {}, arrayOfString[0])).toBe(false)
    expect(validArray(string, [
      {
        p1: number,
        p2: number
      },
      {
        p1: number,
        p2: number
      },
      {
        p1: number,
        p2: number
      }
    ], {}, arrayOfShape[0])).toBe(false)
  })

  it('should create items', () => {
    const data = {}

    validArray(string, [ string, string, string ], data, arrayOfString[0])
    expect(data[string][0]).toBe(string)
    expect(data[string][1]).toBe(string)
    expect(data[string][2]).toBe(string)
  })

  it('should reuse observabled prop', () => {
    const data = {}
    const value = ko.observableArray([ string, string, string ])

    validArray(string, value, data, arrayOfString[0])
    expect(data[string]).toBe(value)
  })

  it('should log error for observabled prop', () => {
    const data = {}
    const value = ko.observableArray([ number, number, number ])

    spyOn(console, 'error')
    validArray(string, value, data, arrayOfString[0])
    expect(console.error).toHaveBeenCalledWith('Invalid prop: key: 0, expect: ko.types.String, actual: 1')
  })

  it('should log warnning: Need prop', () => {
    const data = {}
    const value = [ undefined, undefined, undefined ]

    spyOn(console, 'warn')
    validArray(string, value, data, arrayOfString[0])
    expect(console.warn).toHaveBeenCalledWith('Need prop: key: 0, expect: ko.types.String, actual: undefined')
    expect(console.warn).toHaveBeenCalledWith('Need prop: key: 1, expect: ko.types.String, actual: undefined')
    expect(console.warn).toHaveBeenCalledWith('Need prop: key: 2, expect: ko.types.String, actual: undefined')
    expect(data[string].length).toBe(value.length)
    expect(data[string][0]).toBe(value[0])
    expect(data[string][1]).toBe(value[1])
    expect(data[string][2]).toBe(value[2])
  })
})

describe('valid', () => {
  it('should return null', () => {
    expect(valid()).toBe(null)
    expect(valid(null, {})).toBe(null)
  })

  it('should return object', () => {
    const result = valid({ string: string }, { string: ko.types.String })

    expect(isObject(result)).toBe(true)
  })

  it('should return object', () => {
    const result = valid({ string: string }, { string: ko.types.String })

    expect(result.string).toBe(string)
  })

  it('should log error: Invalid props', () => {
    spyOn(console, 'error')
    valid(null, {})
    expect(console.error, 'Invalid props: null')
  })
})

describe('validObject(nested)', () => {
  const shape = ko.types.shape({
    p1: ko.types.String,
    p2: ko.types.String
  })
  const shapeOfShape = ko.types.shape({
    s1: shape,
    s2: shape
  })
  const shapeOfArray = ko.types.shape({
    s1: ko.types.arrayOf(ko.types.String),
    s2: ko.types.arrayOf(ko.types.String)
  })
  const shapeOfArrayOfShape = ko.types.shape({
    s1: ko.types.arrayOf(shape),
    s2: ko.types.arrayOf(shape)
  })

  it('should return true', () => {
    expect(validObject(string, {
      s1: { p1: string, p2: string },
      s2: { p1: string, p2: string }
    }, {}, shapeOfShape))
    expect(validObject(string, {
      s1: [ string, string, string ],
      s2: [ string, string, string ]
    }, {}, shapeOfArray))
    expect(validObject(string, {
      s1: [ { p1: string, p2: string }, { p1: string, p2: string }, { p1: string, p2: string } ],
      s2: [ { p1: string, p2: string }, { p1: string, p2: string }, { p1: string, p2: string } ]
    }, {}, shapeOfArrayOfShape))
  })

  it('should return false', () => {
    expect(validObject(string, {
      s1: { p1: string, p2: string },
      s2: { p1: string, p2: number }
    }, {}, shapeOfShape))
    expect(validObject(string, {
      s1: [ string, string, string ],
      s2: [ string, string, number ]
    }, {}, shapeOfArray))
    expect(validObject(string, {
      s1: [ { p1: string, p2: string }, { p1: string, p2: string }, { p1: string, p2: string } ],
      s2: [ { p1: string, p2: string }, { p1: string, p2: string }, { p1: string, p2: number } ]
    }, {}, shapeOfArrayOfShape))
  })
})

describe('validArray(nested)', () => {
  const shape = ko.types.shape({
    p1: ko.types.String,
    p2: ko.types.String
  })
  const arrayOfArray = ko.types.arrayOf(
        ko.types.arrayOf(ko.types.String)
    )
  const arrayOfShape = ko.types.arrayOf(shape)
  const arrayOfArrayOfShape = ko.types.arrayOf(
        ko.types.arrayOf(shape)
    )

  it('should return true', () => {
    expect(validArray(string, [
            [ string, string, string ],
            [ string, string, string ],
            [ string, string, string ]
    ], {}, arrayOfArray)).toBe(true)
    expect(validArray(string, [
            { p1: string, p2: string },
            { p1: string, p2: string },
            { p1: string, p2: string }
    ], {}, arrayOfShape)).toBe(true)
    expect(validArray(string, [
            [ { p1: string, p2: string }, { p1: string, p2: string }, { p1: string, p2: string } ],
            [ { p1: string, p2: string }, { p1: string, p2: string }, { p1: string, p2: string } ],
            [ { p1: string, p2: string }, { p1: string, p2: string }, { p1: string, p2: string } ]
    ], {}, arrayOfArrayOfShape)).toBe(true)
  })

  it('should return false', () => {
    expect(validArray(string, [
            [ string, string, string ],
            [ string, string, string ],
            [ string, string, number ]
    ], {}, arrayOfArray)).toBe(false)
    expect(validArray(string, [
            { p1: string, p2: string },
            { p1: string, p2: string },
            { p1: string, p2: number }
    ], {}, arrayOfShape)).toBe(false)
    expect(validArray(string, [
            [ { p1: string, p2: string }, { p1: string, p2: string }, { p1: string, p2: string } ],
            [ { p1: string, p2: string }, { p1: string, p2: string }, { p1: string, p2: string } ],
            [ { p1: string, p2: string }, { p1: string, p2: string }, { p1: string, p2: number } ]
    ], {}, arrayOfArrayOfShape)).toBe(false)
  })
})
