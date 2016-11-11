import {
    isString
} from '../util/'

export function apply (selector, contextNode) {
  if (isString(contextNode)) {
    contextNode = document.querySelector(contextNode)
  }

  const nodes = (contextNode || document).querySelectorAll(selector)

  ko.utils.arrayForEach(nodes, (node) => {
    let bindingStatements = null
    const bindingAttributes = node.getAttribute('data-bind') || ''

    if (bindingAttributes.indexOf(/\bskip\b\s*:/g) > -1) {
      return
    }

    ko.applyBindings(null, node)
    bindingStatements = bindingAttributes ? bindingAttributes.split(',') : []
    bindingStatements.push('skip: true')
    node.setAttribute('data-bind', bindingStatements.join(','))
  })
};

// extend ko.components
ko.components.apply = ko.components.apply || apply
