import {
    linkedLabel,
    linkObjectObservable,
    linkArrayObservable
} from '../../src/util/link'

beforeAll(() => {
  console._error = console.error
  console.error = () => {}
})

afterAll(() => {
  console.error = console._error
})

const string1 = 'string1'
const string2 = 'string2'
const string3 = 'string3'
const number1 = 1
const number2 = 2
const number3 = 3

describe('linkArrayObservable', () => {
  it('should create tag', () => {
    const ob = ko.observableArray([])

    linkArrayObservable(ob, ko.types.String)
    expect(ob[linkedLabel]).toBeDefined()
  })
})

describe('linkArrayObservable.push', () => {
  it('should works', () => {
    const ob = ko.observableArray([])

    linkArrayObservable(ob, ko.types.String)
    ob.push(string1)
    ob.push(string2)
    ob.push(string3)

    expect(ob()[0]).toBe(string1)
    expect(ob()[1]).toBe(string2)
    expect(ob()[2]).toBe(string3)
  })

  it('should update works', () => {
    const ob = ko.observableArray()

    linkArrayObservable(ob, ko.types.String)
    ob.push(string1)
    ob([])
    ob.push(string2)

    expect(ob()[0]).toBe(string2)
  })

  it('should log error: Invalid prop', () => {
    const ob = ko.observableArray([])

    linkArrayObservable(ob, ko.types.String)
    spyOn(console, 'error')
    ob.push(number1)
    ob.push(number2)
    ob.push(number3)

    expect(console.error).toHaveBeenCalledWith('Invalid prop: key: 0, expect: ko.types.String, actual: 1')
    expect(console.error).toHaveBeenCalledWith('Invalid prop: key: 0, expect: ko.types.String, actual: 2')
    expect(console.error).toHaveBeenCalledWith('Invalid prop: key: 0, expect: ko.types.String, actual: 3')
  })

  it('should not ignore invalid items', () => {
    const ob = ko.observableArray([])

    linkArrayObservable(ob, ko.types.String)
    ob.push(number1)
    ob.push(string1)

    expect(ob()[0]).toBe(number1)
    expect(ob()[1]).toBe(string1)
  })
})

describe('linkArrayObservable.unshift', () => {
  it('should works', () => {
    const ob = ko.observableArray([])

    linkArrayObservable(ob, ko.types.String)
    ob.unshift(string1)
    ob.unshift(string2)
    ob.unshift(string3)

    expect(ob()[0]).toBe(string3)
    expect(ob()[1]).toBe(string2)
    expect(ob()[2]).toBe(string1)
  })

  it('should update works', () => {
    const ob = ko.observableArray()

    linkArrayObservable(ob, ko.types.String)
    ob.unshift(string1)
    ob([])
    ob.unshift(string2)

    expect(ob()[0]).toBe(string2)
  })

  it('should log error: Invalid prop', () => {
    const ob = ko.observableArray([])

    linkArrayObservable(ob, ko.types.String)
    spyOn(console, 'error')
    ob.unshift(number1)
    ob.unshift(number2)
    ob.unshift(number3)

    expect(console.error).toHaveBeenCalledWith('Invalid prop: key: 0, expect: ko.types.String, actual: 1')
    expect(console.error).toHaveBeenCalledWith('Invalid prop: key: 0, expect: ko.types.String, actual: 2')
    expect(console.error).toHaveBeenCalledWith('Invalid prop: key: 0, expect: ko.types.String, actual: 3')
  })

  it('should not ignore invalid items', () => {
    const ob = ko.observableArray([])

    linkArrayObservable(ob, ko.types.String)
    ob.unshift(number1)
    ob.unshift(string1)

    expect(ob()[0]).toBe(string1)
    expect(ob()[1]).toBe(number1)
  })
})

describe('linkArrayObservable.splice', () => {
  it('should works', () => {
    const ob = ko.observableArray([])

    linkArrayObservable(ob, ko.types.String)
    ob.splice(0, 0, string1, string2, string3)

    expect(ob()[0]).toBe(string1)
    expect(ob()[1]).toBe(string2)
    expect(ob()[2]).toBe(string3)
  })

  it('should update works', () => {
    const ob = ko.observableArray()

    linkArrayObservable(ob, ko.types.String)
    ob.splice(0, 0, string1)
    ob([])
    ob.splice(0, 0, string2)

    expect(ob()[0]).toBe(string2)
  })

  it('should log error: Invalid prop', () => {
    const ob = ko.observableArray([])

    linkArrayObservable(ob, ko.types.String)
    spyOn(console, 'error')
    ob.splice(0, 0, number1)
    ob.splice(0, 0, number2)
    ob.splice(0, 0, number3)

    expect(console.error).toHaveBeenCalledWith('Invalid prop: key: 0, expect: ko.types.String, actual: 1')
    expect(console.error).toHaveBeenCalledWith('Invalid prop: key: 0, expect: ko.types.String, actual: 2')
    expect(console.error).toHaveBeenCalledWith('Invalid prop: key: 0, expect: ko.types.String, actual: 3')
  })

  it('should ignore invalid items', () => {
    const ob = ko.observableArray([])

    linkArrayObservable(ob, ko.types.String)
    ob.splice(0, 0, number1)
    ob.splice(0, 0, string1)

    expect(ob()[0]).toBe(string1)
    expect(ob()[1]).toBe(number1)
  })
})

describe('linkObjectObservable', () => {
  const shapeOfArray = ko.types.shape({
    array: ko.types.arrayOf(
            ko.types.String
        )
  })
  const shapeOfArrayOfShape = ko.types.shape({
    array: ko.types.arrayOf(
            ko.types.shape({
              string: ko.types.String
            })
        )
  })
  const shapeOfArrayOfArray = ko.types.shape({
    array: ko.types.arrayOf(
            ko.types.arrayOf(ko.types.String)
        )
  })

  it('should link observabled array property', () => {
    const data = {
      array: ko.observableArray([ string1, string2, string3 ])
    }

    linkObjectObservable(data, shapeOfArray)
    expect(data.array[linkedLabel]).toBeDefined()
  })

  it('should not link array property', () => {
    const data = {
      array: [ string1, string2, string3 ]
    }

    linkObjectObservable(data, shapeOfArray)
    expect(data.array[linkedLabel]).toBeUndefined()
  })

  it('should link observabled array items', () => {
    const data = {
      array: ko.observableArray([
        ko.observableArray([ string1, string2, string3 ]),
        ko.observableArray([ string1, string2, string3 ]),
        ko.observableArray([ string1, string2, string3 ])
      ])
    }

    linkObjectObservable(data, shapeOfArrayOfArray)
    expect(data.array()[0][linkedLabel]).toBeDefined()
    expect(data.array()[1][linkedLabel]).toBeDefined()
    expect(data.array()[2][linkedLabel]).toBeDefined()
  })

  it('should not link array items', () => {
    const data = {
      array: ko.observableArray([
                [ string1, string2, string3 ],
                [ string1, string2, string3 ],
                [ string1, string2, string3 ]
      ])
    }

    linkObjectObservable(data, shapeOfArrayOfArray)
    expect(data.array()[0][linkedLabel]).toBeUndefined()
    expect(data.array()[1][linkedLabel]).toBeUndefined()
    expect(data.array()[2][linkedLabel]).toBeUndefined()
  })

  it('should create object observable', () => {
    const data = {
      array: ko.observableArray()
    }

    linkObjectObservable(data, shapeOfArrayOfShape)
    data.array.push({ string: string1 })
    data.array.push({ string: string2 })
    data.array.push({ string: string3 })

    expect(ko.isObservable(data.array()[0].string)).toBe(true)
    expect(ko.isObservable(data.array()[1].string)).toBe(true)
    expect(ko.isObservable(data.array()[2].string)).toBe(true)
  })

  it('should create array observable', () => {
    const data = {
      array: ko.observableArray()
    }

    linkObjectObservable(data, shapeOfArrayOfArray)
    data.array.push([])
    data.array.push([])
    data.array.push([])

    expect(ko.isObservable(data.array()[0])).toBe(true)
    expect(ko.isObservable(data.array()[1])).toBe(true)
    expect(ko.isObservable(data.array()[2])).toBe(true)
  })
})
