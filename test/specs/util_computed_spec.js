import {
    computedAll,
    pureComputedAll
} from '../../src/util/computed'

describe('computedAll', () => {
  it('should create observable on function properties', () => {
    const context = {}
    const methods = {
      prop: function () {}
    }

    computedAll(context, methods)
    expect(ko.isComputed(context.prop)).toBe(true)
  })

  it('should not create observable on not function properties', () => {
    const context = {}
    const methods = {
      string: 'string',
      number: 0,
      boolean: false,
      object: {},
      array: []
    }

    computedAll(context, methods)
    expect(ko.isComputed(context.string)).toBe(false)
    expect(ko.isComputed(context.number)).toBe(false)
    expect(ko.isComputed(context.boolean)).toBe(false)
    expect(ko.isComputed(context.object)).toBe(false)
    expect(ko.isComputed(context.array)).toBe(false)
  })
})

describe('pureComputedAll', () => {
  it('should create observable on function properties', () => {
    const context = {}
    const methods = {
      function: function () {}
    }

    pureComputedAll(context, methods)
    expect(ko.isComputed(context.function)).toBe(true)
  })

  it('should not create observable on not function properties', () => {
    const context = {}
    const methods = {
      string: 'string',
      number: 0,
      boolean: false,
      undefined: undefined,
      object: {},
      array: []
    }

    pureComputedAll(context, methods)
    expect(ko.isComputed(context.string)).toBe(false)
    expect(ko.isComputed(context.number)).toBe(false)
    expect(ko.isComputed(context.boolean)).toBe(false)
    expect(ko.isComputed(context.undefined)).toBe(false)
    expect(ko.isComputed(context.object)).toBe(false)
    expect(ko.isComputed(context.array)).toBe(false)
  })
})
