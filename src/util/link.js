import {
    hasOwn,
    each,
    eachDict,
    isArray,
    isObject,
    isFunction,
    validArray,
    observableArray
} from './'

export const linkedLabel = '__hasLinked'

function isArrayObservable (target) {
  return ko.isObservable(target) && isFunction(target.push)
}

// Link computed observable with validators
//
// @param {Function} observable
// @param {Object|Function} validator
export function linkComputedObservable (observable, validator) {
  if (!ko.isComputed(observable)) {
    return
  }

  observable.subscribe((value) => {
    const validResult = {}

    if (isArray(validator) && validator.length === 1) {
      if (!validArray('link', value, validResult, validator[0])) {
        return
      }

      each(validResult['link'], (validItem, i) => {
        value[i] = validItem
      })
      observableArray(value)
    } else if (isObject(validator) && !hasOwn(validator, 'type')) {
      linkObjectObservable(value, validator)
    }
  })
  observable[linkedLabel] = true
};

// Link array observable with validators
//
// @param {Function} observable
// @param {Object|Function} validator
export function linkArrayObservable (observable, validator) {
  if (!isArrayObservable(observable) || observable[linkedLabel]) {
    return
  }

  each(ko.unwrap(observable), (item) => {
    linkArrayObservable(item)
  })
  observable.subscribe((changes) => {
    const items = []
    const indexes = []
    const validResult = {}

    each(changes, (change) => {
      if (change.status === 'added') {
        items.push(change.value)
        indexes.push(change.index)
      }
    })

    if (!validArray('link', items, validResult, validator)) {
      return
    }

    const source = observable()

    if (items.length) {
      each(validResult['link'], (validItem, i) => {
        source[indexes[i]] = validItem
      })
    }

    observableArray(source)
  }, null, 'arrayChange')
  observable[linkedLabel] = true
};

// Link object observable with validators
//
// @param {Object} data
// @param {Object} validators
export function linkObjectObservable (data, validators) {
  eachDict(validators, (propName, validator) => {
    const propValue = data[propName]

    if (ko.isComputed(propValue)) {
      linkComputedObservable(propValue, validator)
    } else if (isArray(validator) && validator.length === 1) {
      linkArrayObservable(propValue, validator[0])
    } else if (isObject(validator) && !hasOwn(validator, 'type')) {
      linkObjectObservable(propValue, validator)
    }
  })
};
