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

function querySelector(selector, context = document) {
    return getVmForNode(context.querySelector(selector));
}

function querySelectorAll(selector, context = document) {
    const nodes = ko.utils.makeArray(context.querySelectorAll(selector));

    return ko.utils.arrayMap(nodes, (node) => {
        return getVmForNode(node);
    });
}

function getElementById() {
    return getVmForNode(context.getElementById(selector));
}

function getElementsByTagName(selector, context = document) {
    const nodes = ko.utils.makeArray(context.getElementsByTagName(selector));

    return ko.utils.arrayMap(nodes, (node) => {
        return getVmForNode(node);
    });
}

function getElementsByClassName(selector, context = document) {
    const nodes = ko.utils.makeArray(context.getElementsByClassName(selector));

    return ko.utils.arrayMap(nodes, (node) => {
        return getVmForNode(node);
    });
}

ko.components.querySelector = querySelector;
ko.components.querySelectorAll = querySelectorAll;
ko.components.getElementById = getElementById;
ko.components.getElementsByTagName = getElementsByTagName;
ko.components.getElementsByClassName = getElementsByClassName;
