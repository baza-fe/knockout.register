const defaultSpy = document.createComment('spy')

function getVmForNode (node) {
  if (!node) {
    return null
  }

  let spy = node.lastElementChild || defaultSpy
  let useDefault = spy === defaultSpy

  if (useDefault) {
    node.appendChild(spy)
  }

  const vm = ko.dataFor(spy)

  if (useDefault) {
    node.removeChild(spy)
  }

  return vm
}

// query vm by selector
//
// @param {String} selector
// @param {Node} context
export function querySelector (selector, context = document) {
  return getVmForNode(context.querySelector(selector))
};

// query vms by selector
//
// @param {String} selector
// @param {Node} context
export function querySelectorAll (selector, context = document) {
  const nodes = ko.utils.makeArray(context.querySelectorAll(selector))

  return ko.utils.arrayMap(nodes, (node) => {
    return getVmForNode(node)
  })
};

// query vm by id
//
// @param {String} selector
// @param {Node} context
export function getVmById (selector, context) {
  return getVmForNode(context.getElementById(selector))
};

// query vms by tag name
//
// @param {String} selector
// @param {Node} context
export function getVmsByTagName (selector, context = document) {
  const nodes = ko.utils.makeArray(context.getElementsByTagName(selector))

  return ko.utils.arrayMap(nodes, (node) => {
    return getVmForNode(node)
  })
};

// query vms by class name
//
// @param {String} selector
// @param {Node} context
export function getVmsByClassName (selector, context = document) {
  const nodes = ko.utils.makeArray(context.getElementsByClassName(selector))

  return ko.utils.arrayMap(nodes, (node) => {
    return getVmForNode(node)
  })
};

// extend ko.components
ko.components.querySelector = querySelector
ko.components.querySelectorAll = querySelectorAll
ko.components.getVmById = getVmById
ko.components.getVmsByTagName = getVmsByTagName
ko.components.getVmsByClassName = getVmsByClassName
