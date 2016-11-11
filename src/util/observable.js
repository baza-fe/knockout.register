import {
    each,
    eachDict,
    isString,
    isNumber,
    isBoolean,
    isArray,
    isObject
} from './'

function isBasic (value) {
  return isString(value) || isNumber(value) || isBoolean(value)
}

// Observable array and object items
//
// @param {Array} data
export function observableArray (data) {
  each(data, (item, i) => {
    if (ko.isObservable(item)) {
      return true
    }

    if (isObject(item)) {
      data[i] = observableObject(item)
    } else if (isArray(item)) {
      data[i] = observableArray(item)
    }
  })

  return ko.observableArray(data)
};

// Observable object properties
//
// @param {Object} data
export function observableObject (data) {
  eachDict(data, (propKey, propValue) => {
    if (ko.isObservable(propValue)) {
      return true
    }

    if (isObject(propValue)) {
      data[propKey] = observableObject(propValue)
    } else if (isArray(propValue)) {
      data[propKey] = observableArray(propValue)
    } else if (propValue === undefined || isBasic(propValue)) {
      data[propKey] = ko.observable(propValue)
    } else {
      data[propKey] = propValue
    }
  })

  return data
};
