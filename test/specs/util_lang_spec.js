import {
    some,
    every,
    extend,
    toArray,
    toPrimitive,
    normalize
} from '../../src/util/'

describe('some', () => {
  it('should return true', () => {
    expect(some([0, 1], (v) => { return v === 0 })).toBe(true)
  })

  it('should return false', () => {
    expect(some([1], (v) => { return v === 0 })).toBe(false)
  })
})

describe('every', () => {
  it('should return true', () => {
    expect(every([], (v) => { return v > 0 })).toBe(true)
    expect(every([1, 2], (v) => { return v > 0 })).toBe(true)
  })

  it('should return false', () => {
    expect(every(undefined, (v) => { return v > 0 })).toBe(false)
    expect(every([0, 1], (v) => { return v > 0 })).toBe(false)
  })
})

describe('toArray', () => {
  it('should return array', () => {
    expect(toArray([ 0, 1 ]).join(',') === '0,1').toBe(true)
  })

  it('should return array', () => {
    expect(toArray({
      0: 0,
      1: 1,
      length: 2
    }).join(',') === '0,1').toBe(true)
  })
})

describe('toPrimitive', () => {
  it('should parse string', () => {
    expect(toPrimitive('')).toBe('')
    expect(toPrimitive('hello')).toBe('hello')
  })

  it('should parse number', () => {
    expect(toPrimitive('1')).toBe(1)
    expect(toPrimitive('-1')).toBe(-1)
    expect(toPrimitive('10')).toBe(10)
    expect(toPrimitive('10.1')).toBe(10.1)
    expect(toPrimitive('10e10')).toBe(10e10)
    expect(toPrimitive('10e+10')).toBe(10e10)
    expect(toPrimitive('10e-10')).toBe(10e-10)
  })

  it('should parse boolean', () => {
    expect(toPrimitive('true')).toBe(true)
    expect(toPrimitive('True')).toBe(true)
    expect(toPrimitive('false')).toBe(false)
    expect(toPrimitive('False')).toBe(false)
  })
})

describe('normalize', () => {
  it('should return small camel equivalent', () => {
    expect(normalize('my-name')).toBe('myName')
  })
})

describe('extend', () => {
  it('should copy properties', () => {
    const a = {}
    const b = { p1: 'p1', p2: 'p2' }

    extend(a, b)
    expect(a.p1).toBe(b.p1)
    expect(a.p2).toBe(b.p2)
  })

  it('should not copy inheried properties', () => {
    const a = {}
    const b = { p1: 'p1', p2: 'p2' }
    const c = Object.create(b)

    extend(a, c)
    expect(a.p1).toBeUndefined()
    expect(a.p2).toBeUndefined()
  })
})
