import { mixin, insertCss } from './util';

// extend knockout utils
ko.utils.mixin = ko.utils.mixin || mixin;
ko.utils.insertCss = ko.utils.insertCss || insertCss
