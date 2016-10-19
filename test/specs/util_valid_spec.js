import {
    isObject,
    valid,
    validProp,
    validObject,
    validWithin,
    validArray
} from '../../src/util/';

beforeAll(() => {
    console._error = console.error;
    console.error = () => {};
});

afterAll(() => {
    console.error = console._error;
});

const string = 'string';
const number = 1;
const boolean = true;

describe('validProp', () => {
    it('should return true', () => {
        expect(validProp(string, string, {}, ko.types.String)).toBe(true);
    });

    it('should return false', () => {
        expect(validProp(string, number, {}, ko.types.String)).toBe(false);
    });

    it('should create prop', () => {
        const data = {};

        validProp(string, string, data, ko.types.String);
        expect(data[string]).toBe(string);
    });

    it('should create prop with default', () => {
        const data = {};

        validProp(string, undefined, data, { type: ko.types.String, default: string });
        expect(data[string]).toBe(string);
    });

    it('should reuse observabled prop', () => {
        const data = {};
        const ob = ko.observable(string);

        validProp(string, ob, data, { type: ko.types.String });
        expect(data[string]).toBe(ob);
    });

    it('should log error for observabled prop', () => {
        const data = {};
        const ob = ko.observable(1);

        spyOn(console, 'error');
        validProp(string, ob, data, { type: ko.types.String });
        expect(console.error).toHaveBeenCalledWith('Invalid prop: key: string, propValue: 1', data);
    });

    it('should log error: Invalid prop', () => {
        const data = {};

        spyOn(console, 'error');
        expect(validProp(string, number, data, { type: ko.types.String })).toBe(false);
        expect(console.error).toHaveBeenCalledWith('Invalid prop: key: string, propValue: 1', data);
    });

    it('should log error: Missing required prop', () => {
        const data = {};

        spyOn(console, 'error');
        expect(validProp(string, undefined, data, { type: ko.types.String, required: true })).toBe(false);
        expect(console.error).toHaveBeenCalledWith('Invalid prop: Missing required prop: string', data);
    });

    it('should log warnning: Invalid prop', () => {
        return true;
    });
});

describe('validObject', () => {
    const shape = ko.types.shape({
        p1: ko.types.String,
        p2: ko.types.String
    });

    it('should return true', () => {
        expect(validObject(string, { p1: string, p2: string }, {}, shape)).toBe(true);
    });

    it('should return false', () => {
        expect(validObject(string, { p1: number, p2: number }, {}, shape)).toBe(false);
    });

    it('should reuse observabled prop', () => {
        const data = {};
        const ob = ko.observable({ p1: string, p2: string });

        validObject(string, ob, data, shape);
        expect(data[string]).toBe(ob);
    });

    it('should log error for observabled prop', () => {
        const data = {};
        const ob = ko.observable({ p1: number, p2: number });

        spyOn(console, 'error');
        validObject(string, ob, data, shape);
        expect(console.error).toHaveBeenCalledWith('Invalid prop: key: p1, propValue: 1', data.string);
    });

    it('should log warnning: Invalid prop', () => {
        return true;
    });
});

describe('validWithin', () => {
    const oneOfType = ko.types.oneOfType(
        ko.types.String,
        ko.types.Number,
        ko.types.Boolean
    );

    it('should return true', () => {
        expect(validWithin(string, string, {}, oneOfType)).toBe(true);
        expect(validWithin(string, number, {}, oneOfType)).toBe(true);
        expect(validWithin(string, boolean, {}, oneOfType)).toBe(true);
    });

    it('should return false', () => {
        expect(validWithin(string, string, {}, [])).toBe(false);
        expect(validWithin(string, number, {}, [])).toBe(false);
        expect(validWithin(string, boolean, {}, [])).toBe(false);
    });

    it('should create prop', () => {
        const data = {};

        validWithin(string, string, data, oneOfType);
        expect(data[string]).toBe(string);
    });

    it('should reuse observabled prop', () => {
        const data = {};
        const ob = ko.observable(string);

        validWithin(string, ob, data, oneOfType);
        expect(data[string]).toBe(ob);
    });

    it('should log error for observabled prop', () => {
        const data = {};
        const ob = ko.observable(null);

        spyOn(console, 'error');
        validWithin(string, ob, data, oneOfType);
        expect(console.error).toHaveBeenCalledWith('Invalid prop: key: 0, propValue: null', []);
    });

    it('should log warnning: Invalid prop', () => {
        return true;
    });
});

describe('validArray', () => {
    const arrayOfString = ko.types.arrayOf(ko.types.String);
    const arrayOfShape = ko.types.arrayOf(ko.types.shape({
        p1: ko.types.String,
        p2: ko.types.String
    }));

    it('should return true', () => {
        expect(validArray(string, [ string, string, string ], {}, arrayOfString[0])).toBe(true);
        expect(validArray(string, [
            {
                p1: string,
                p2: string
            },
            {
                p1: string,
                p2: string
            },
            {
                p1: string,
                p2: string
            }
        ], {}, arrayOfShape[0])).toBe(true);
    });

    it('should return false', () => {
        expect(validArray(string, [ number, number, number ], {}, arrayOfString[0])).toBe(false);
        expect(validArray(string, [
            {
                p1: number,
                p2: number
            },
            {
                p1: number,
                p2: number
            },
            {
                p1: number,
                p2: number
            }
        ], {}, arrayOfShape[0])).toBe(false);
    });

    it('should create items', () => {
        const data = {};

        validArray(string, [ string, string, string ], data, arrayOfString[0]);
        expect(data[string][0]).toBe(string);
        expect(data[string][1]).toBe(string);
        expect(data[string][2]).toBe(string);
    });

    it('should reuse observabled prop', () => {
        const data = {};
        const ob = ko.observableArray([ string, string, string ]);

        validArray(string, ob, data, arrayOfString[0]);
        expect(data[string]).toBe(ob);
    });

    it('should log error for observabled prop', () => {
        const data = {};
        const ob = ko.observableArray([ number, number, number ]);

        spyOn(console, 'error');
        validArray(string, ob, data, arrayOfString[0]);
        expect(console.error).toHaveBeenCalledWith('Invalid prop: key: 0, propValue: 1', data.string);
    });

    it('should log warnning: Invalid prop', () => {
        return true;
    });
});

describe('valid', () => {
    it('should return null', () => {
        expect(valid()).toBe(null);
        expect(valid(null, {})).toBe(null);
    });

    it('should return object', () => {
        const result = valid({ string: string }, { string: ko.types.String });

        expect(isObject(result)).toBe(true);
    });

    it('should return object', () => {
        const result = valid({ string: string }, { string: ko.types.String });

        expect(result.string).toBe(string);
    });

    it('should log error: Invalid props', () => {
        console.error = (err) => {
            expect(err).toBe('Invalid props: null');
        };
        valid(null, {});
    });
});
