import insert from 'insert-css';
import { isFunction } from './lang';

// empty component template
export const emptyTemplate = '<!-- empty template -->';

// throw error with plugin name
//
// @param {String} message
export function throwError(message) {
    throw new Error(`knockout.register: ${message}`);
};

// insert dom stylesheet
export function insertCss() {
    return insert.apply(null, arguments);
};

// robust mixin
//
// @param {Object} dest
// @param {Object} opts
// @param {Array|Object} mixins
export function mixin(dest, opts, mixins) {

    // opts is optional
    if (!mixins && opts) {
        mixins = opts;
        opts = null;
    }

    if (mixins && !Array.isArray(mixins)) {
        mixins = [ mixins ];
    }

    if (!mixins || !mixins.length) {
        return dest;
    }

    // cache last opts
    dest.opts = opts = opts || {};

    ko.utils.arrayForEach(mixins, (mixin) => {
        let mixinCopy = null;

        // pre mix
        if (isFunction(mixin.preMix)) {
            mixinCopy = ko.utils.extend({}, mixin);
            mixinCopy.preMix(opts);
        }

        ko.utils.extend(dest, mixinCopy || mixin);

        // post mix
        if (isFunction(mixin.postMix)) {
            mixin.postMix.call(dest, opts);
        }
    });

    delete dest.preMix;
    delete dest.postMix;

    return dest;
};

// extend ko.utils
ko.utils.mixin = ko.utils.mixin || mixin;
ko.utils.insertCss = ko.utils.insertCss || insertCss;