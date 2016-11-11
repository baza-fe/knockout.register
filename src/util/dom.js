// Check dom node by name
//
// @param {Node} target
// @param {String} name
// @return {Boolean}
export function isNode (target, name) {
  const nodeName = (target && target.nodeName)
        ? target.nodeName.toLowerCase()
        : ''

  return nodeName === name
};
