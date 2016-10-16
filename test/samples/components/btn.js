export default {
    name: 'btn',

    props: {
        string: ko.types.String,
        number: ko.types.Number,
        boolean: ko.types.Boolean,
        object: ko.types.Object,
        array: ko.types.Array,
        function: ko.types.Function,
        date: ko.types.Date,
        regexp: ko.types.RegExp,
        any: ko.types.Any
        // shape: ko.types.shape({
        //     string: ko.types.String,
        //     number: ko.types.Number,
        //     boolean: ko.types.Boolean,
        //     object: ko.types.Object,
        //     array: ko.types.Array,
        //     function: ko.types.Function,
        //     date: ko.types.Date,
        //     regexp: ko.types.RegExp
        // }),
        // required: {
        //     type: ko.types.String,
        //     required: true
        // },
        // oneOf: ko.types.oneOf(1, 2, 3),
        // oneOfType: ko.types.oneOfType(
        //     ko.types.String,
        //     ko.types.Number,
        //     ko.types.Boolean
        // )
    }
};
