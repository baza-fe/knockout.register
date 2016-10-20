import { constructor as Avatar } from './avatar';

export default {
    name: 'list',

    constructor(opts) {
        this.items = ko.observableArray([
            {
                first: 'a',
                last: 'a'
            },
            {
                first: 'b',
                last: 'b'
            },
            {
                first: 'c',
                last: 'c'
            }
        ]);
    },

    methods: {
        onClick() {}
    },

    template: `
        <ul data-bind="foreach: items">
            <li>
                <avatar k-first="first"
                        k-last="last"
                        on-click="onClick"
                        string="string"
                        number1="0"
                        number2="1"
                        boolean1="true"
                        boolean2="false"
                        boolean3="True"
                        boolean4="False">
                </avatar>
            </li>
        </ul>
    `
};
