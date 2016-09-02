import { mixin, insertCss, apply } from './util';

// extend knockout utils
ko.utils.mixin = ko.utils.mixin || mixin;
ko.utils.insertCss = ko.utils.insertCss || insertCss;

// extend knockout components
ko.components.apply = ko.components.apply || apply;
