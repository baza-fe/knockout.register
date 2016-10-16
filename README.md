knockout.register
=====

**knockout.register** helps to register component in a simpler and more powerful way.

```js
import eventMixin from './mixin/event';
import style from './btn.css';
import template form './btn.tpl';

export default {
    name: 'btn',
    props: {
        text: {
            type: ko.types.String,
            required: true
        },
        type: ko.types.oneOf(
            'button',
            'submit',
            'reset'
        )
    },
    mixin: [
        eventMixin
    ],
    methods: {
        onClick(vm, ev) {

            // 'trigger' mix from eventMixin
            this.trigger('click', vm);
        }
    },
    style,
    template
};
```

## Usage

Install from NPM:

```bash
npm install knockout.register --save
```

```html
<script src="knockout.3.4.0.js"></script>
<script src="node_modules/knockout.register/dest/knockout.register.js"></script>
```

## Native Component Module

**knockout.register** named knockout original component module as **Native Component Module**.

Cite from knockout documentation:

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

**knockout.register** creates a new component module and named it as **Standard Component Module**.

### Options

#### `name`

+ type: `String` _(required)_

The name for component and custom element.HTML elements are case-insensitive, so when using component the name need to use their kebab-case(hyphen delimited) equivalents eg. `my-component`.

#### `props`

+ type: `Object` _(default: `null`)_

A prop is a custom attribute for passing information from parent components.A child component needs to explicity declare the props it expects to receive using the this options.

```js
export default {
    name: 'child',
    props: {
        text: String
    }
};
```

Then we can pass a plain string to it like so:

```html
<child text="hello"></child>
```

It is possible for a component to specify requirements for the props it is receiving.If a requirement is not met, the plugin will emit warnings.

```html
<child text="1"></child>
```

When a prop validation fails, the plugin will produce a console warning(if using the development build).

The validateor can be a custom function or one of the following native constructors:

+ String
+ Number
+ Boolean
+ Function
+ Object
+ Array
+ Date
+ RegExp
+ Node
+ Element

Or combination of them:

+ any()
+ shape()
+ oneOf()
+ oneOfType()
+ instanceof()

#### `computed` & `pureComputed`

Putting too much logic into your templates can make them bloated and hard to maintain.You should use a **computed property**.[Why pure?](http://knockoutjs.com/documentation/computed-pure.html)

```js
export default {
    name: 'component',
    props: {
        firstName: String,
        lastName: String
    },
    pureComputed: {
        fullName() {
            return `${this.firstName()} ${thie.lastName()}`;
        }
    }
};
```

#### `mixins`

+ type: `Array` _(default: `null`)_

A mixin is a methods collection reused in multiply components.The merge stratege is dead simple just copy methods from a mixin to `methods` of target component.It is possible for a mixin to do something before and after mixing.

```js
export default {

    // before mixing
    preMix() {
        this; // => this keyword refer to target component
    },

    // after mixing
    postMix() {},

    // the methods will be copied
    on() {},
    off() {},
    trigger() {}
};
```

#### `methods`

+ type: `Object` _(default: `null`)_

Built-in lifecycle and custom methods which shared by every component instance.

```js
export default {
    methods: {

        // before create vm
        beforeCreate() {
            this.text(); // => throw Error: text in undefined
            this.componentInfo.element; // => null
        },

        // vm created
        created() {
            this.text(); // => ''
            this.componentInfo.element; // => null
        },

        // template compiled and inserted into DOM
        ready() {
            this.text(); // => ''
            this.componentInfo.element; // => element
        }
    }
};
```

#### `style`

+ type: `String` _(default: `''`)_

A `<style/>` tag which wraps the style string will be created and inserted to `<head/>`.

#### `template`

+ type: `String` _(default: `'<!-- empty template -->'`)_

Knockout will emit error and halt application if `template` not specified.This plugin will use a HTML comment string to cheat in registering.

## License

MIT &copy; [BinRui.Guan](differui@gmail.com)
