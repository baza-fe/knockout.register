const defaultSpy = document.createComment('spy');

function getVmForNode(node) {
    let spy = node.lastElementChild || defaultSpy;
    let useDefault = spy === defaultSpy;

    if (useDefault) {
        node.appendChild(spy);
    }

    const vm = ko.dataFor(spy);

    if (useDefault) {
        node.removeChild(spy);
    }

    return vm;
}

// query element by selector
//
// @param {String} selector
// @param {Node} context
export function querySelector(selector, context = document) {
    return getVmForNode(context.querySelector(selector));
};

// query elements by selector
//
// @param {String} selector
// @param {Node} context
export function querySelectorAll(selector, context = document) {
    const nodes = ko.utils.makeArray(context.querySelectorAll(selector));

    return ko.utils.arrayMap(nodes, (node) => {
        return getVmForNode(node);
    });
};

// query element by id
//
// @param {String} selector
// @param {Node} context
export function getElementById() {
    return getVmForNode(context.getElementById(selector));
};

// query elements by tag name
//
// @param {String} selector
// @param {Node} context
export function getElementsByTagName(selector, context = document) {
    const nodes = ko.utils.makeArray(context.getElementsByTagName(selector));

    return ko.utils.arrayMap(nodes, (node) => {
        return getVmForNode(node);
    });
};

// query elements by class name
//
// @param {String} selector
// @param {Node} context
export function getElementsByClassName(selector, context = document) {
    const nodes = ko.utils.makeArray(context.getElementsByClassName(selector));

    return ko.utils.arrayMap(nodes, (node) => {
        return getVmForNode(node);
    });
};

// ref vm
//
// @param {String} query
// @param {Node} context
export function ref(query, context) {
    return ko.components.querySelector(query, context || this.componentInfo.element);
};

// ref vms
//
// @param {String} query
// @param {Node} context
export function refs(query, context) {
    return ko.components.querySelectorAll(query, context || this.componentInfo.element);
};

// extend ko.components
ko.components.querySelector = querySelector;
ko.components.querySelectorAll = querySelectorAll;
ko.components.getElementById = getElementById;
ko.components.getElementsByTagName = getElementsByTagName;
ko.components.getElementsByClassName = getElementsByClassName;
