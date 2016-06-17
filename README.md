knockout.register
=====

In order to accelerate development with knockout components.The original knockout component module is cumbersome.**knockout.register** helps register component in more simple and more powerful way.

## Usage

Install from NPM:

```bash
npm install knockout.register --save
```

```html
<script src="knockout.3.4.0.js"></script>
<script src="node_modules/knockout.register/dest/knockout.register.cjs.js"></script>
```

## Defination

### Native Component Module

**knockout.register** call knockout original component module as **Native Component Module**.

Cite knockout doc:

```js
ko.components.register('my-component', {
    viewModel: {
        createViewModel: function(params, componentInfo) {
            // - 'params' is an object whose key/value pairs are the parameters
            //   passed from the component binding or custom element
            // - 'componentInfo.element' is the element the component is being
            //   injected into. When createViewModel is called, the template has
            //   already been injected into this element, but isn't yet bound.
            // - 'componentInfo.templateNodes' is an array containing any DOM
            //   nodes that have been supplied to the component. See below.

            // Return the desired view model instance, e.g.:
            return new MyViewModel(params);
        }
    },
    template: ...
});
```

## Standard Component Module

**knockout.register** create own component module and call it **Stand Component Module**.It's more simple and powerful than **NCM**.

Here is a brief list what **SCM** can do but **NCM** can not:

+ register with component css
+ register with defaults params
+ register with computed and pureComputed params
+ register with mixins
+ more constrict module format
+ helpful lifecycle methods
+ node attributes as params

Here is a sample:

```js
import eventMixin from './mixin/event';
import style from './btn.css';
import template form './btn.tpl';

const Btn = {
    constructor(opts, info) {
        this.text = ko.observable(opts.text);
    },

    defaults: {
        text: 'button'
    },

    mixin: {
        eventMixin
    },

    methods: {
        onClick(vm, ev) {

            // trigger mixin from event mixin
            this.trigger('click', vm);
        }
    },

    style: style,
    template: template
};

ko.components.register(Btn);
```

## License

MIT &copy; [BinRui.Guan](differui@gmail.com)