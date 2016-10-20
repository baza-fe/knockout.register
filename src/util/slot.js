import {
    each,
    isNode,
    isArray,
    isString
} from './';

// Pluck dom node from given template
//
// @param {Array|String|Node} tpl
function pluckNodes(tpl) {
    if (isArray(tpl)) {
        return tpl;
    }

    if (isString(tpl)) {
        return ko.utils.parseHtmlFragment(tpl);
    }

    if (tpl.nodeType === Node.ELEMENT_NODE) {
        return [tpl];
    }
}

// Pluck slot node from given node list
//
// @param {Array} nodes
function pluckSlots(nodes) {
    var slots = [];

    each(nodes, (node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) {
            return;
        }

        if (isNode(node, 'slot')) {
            slots.push(node);
        } else {
            each(node.getElementsByTagName('slot'), (slot) => {
                slots.push(slot);
            });
        }
    });

    return slots;
}

// Pair slots according to name
//
// @param {Array} srcSlots
// @param {Array} destSlots
function matchSlots(srcSlots, destSlots) {
    const slotMaps = {};
    const slotPairs = [];
    const srcSlotsLen = srcSlots.length;

    each(srcSlots.concat(destSlots), (slot, i) => {
        const slotName = slot.getAttribute('name');
        const slotMap = slotMaps[slotName] = slotMaps[slotName] || {
            src: null,
            dest: []
        };

        if (i < srcSlotsLen) {
            slotMap.src = slot;
        } else {
            slotMap.dest.push(slot);
        }
    });

    const slotNames = Object.keys(slotMaps);

    each(slotNames, (slotName) => {
        const slotMap = slotMaps[slotName];

        if (!slotMap.src || !slotMap.dest.length) {
            return;
        }

        each(slotMap.dest, (destSlot) => {
            slotPairs.push({
                name: slotName,
                src: slotMap.src,
                dest: destSlot
            });
        });
    });

    return slotPairs;
}

// Replace dest slot into source slot according to name
//
// @param {Array} srcSlots
// @param {Array} destSlots
function replaceSlot(srcSlot, destSlot) {
    if (srcSlot && destSlot) {
        destSlot.parentNode.replaceChild(srcSlot.cloneNode(true), destSlot);
    } else {
        srcSlot.parentNode.removeChild(srcSlot);
        destSlot.parentNode.removeChild(detSlot)
    }
}

export function slot(srcTpl, destTpl) {
    const srcNodes = pluckNodes(srcTpl);
    const destNodes = pluckNodes(destTpl);
    const srcSlots = pluckSlots(srcNodes);
    const destSlots = pluckSlots(destNodes);
    const slotPairs = matchSlots(srcSlots, destSlots);

    each(slotPairs, (slotPair) => {
        replaceSlot(slotPair.src, slotPair.dest);
    });

    return srcNodes;
};
