const node = document.createElement('div');
const now = new Date();
const regexp = /\w/img;
const noop = function () {};
const array = [];
const object = {};

describe('String', () => {
    it('should return true', () => {
        expect(ko.types.String('')).toBe(true);
    });

    it('should return false', () => {
        expect(ko.types.String(1)).toBe(false);
        expect(ko.types.String(true)).toBe(false);
        expect(ko.types.String(false)).toBe(false);
        expect(ko.types.String(noop)).toBe(false);
        expect(ko.types.String(array)).toBe(false);
        expect(ko.types.String(object)).toBe(false);
        expect(ko.types.String(now)).toBe(false);
        expect(ko.types.String(regexp)).toBe(false);
        expect(ko.types.String(null)).toBe(false);
        expect(ko.types.String(undefined)).toBe(false);
        expect(ko.types.String(node)).toBe(false);
    });
});

describe('Number', () => {
    it('should return true', () => {
        expect(ko.types.Number(1)).toBe(true);
    });

    it('should return false', () => {
        expect(ko.types.Number('')).toBe(false);
        expect(ko.types.Number(true)).toBe(false);
        expect(ko.types.Number(false)).toBe(false);
        expect(ko.types.Number(noop)).toBe(false);
        expect(ko.types.Number(array)).toBe(false);
        expect(ko.types.Number(object)).toBe(false);
        expect(ko.types.Number(now)).toBe(false);
        expect(ko.types.Number(regexp)).toBe(false);
        expect(ko.types.Number(null)).toBe(false);
        expect(ko.types.Number(undefined)).toBe(false);
        expect(ko.types.Number(node)).toBe(false);
    });
});


describe('Boolean', () => {
    it('should return true', () => {
        expect(ko.types.Boolean(true)).toBe(true);
        expect(ko.types.Boolean(false)).toBe(true);
    });

    it('should return false', () => {
        expect(ko.types.Boolean('')).toBe(false);
        expect(ko.types.Boolean(1)).toBe(false);
        expect(ko.types.Boolean(noop)).toBe(false);
        expect(ko.types.Boolean(array)).toBe(false);
        expect(ko.types.Boolean(object)).toBe(false);
        expect(ko.types.Boolean(now)).toBe(false);
        expect(ko.types.Boolean(regexp)).toBe(false);
        expect(ko.types.Boolean(null)).toBe(false);
        expect(ko.types.Boolean(undefined)).toBe(false);
        expect(ko.types.Boolean(node)).toBe(false);
    });
});

describe('Object', () => {
    it('should return true', () => {
        expect(ko.types.Object(object)).toBe(true);
    });

    it('should return false', () => {
        expect(ko.types.Object('')).toBe(false);
        expect(ko.types.Object(1)).toBe(false);
        expect(ko.types.Object(true)).toBe(false);
        expect(ko.types.Object(false)).toBe(false);
        expect(ko.types.Object(noop)).toBe(false);
        expect(ko.types.Object(array)).toBe(false);
        expect(ko.types.Object(now)).toBe(false);
        expect(ko.types.Object(regexp)).toBe(false);
        expect(ko.types.Object(null)).toBe(false);
        expect(ko.types.Object(undefined)).toBe(false);
        expect(ko.types.Object(node)).toBe(false);
    });
});

describe('Array', () => {
    it('should return true', () => {
        expect(ko.types.Array(array)).toBe(true);
    });

    it('should return false', () => {
        expect(ko.types.Array('')).toBe(false);
        expect(ko.types.Array(1)).toBe(false);
        expect(ko.types.Array(true)).toBe(false);
        expect(ko.types.Array(false)).toBe(false);
        expect(ko.types.Array(noop)).toBe(false);
        expect(ko.types.Array(object)).toBe(false);
        expect(ko.types.Array(now)).toBe(false);
        expect(ko.types.Array(regexp)).toBe(false);
        expect(ko.types.String(null)).toBe(false);
        expect(ko.types.String(undefined)).toBe(false);
        expect(ko.types.String(node)).toBe(false);
    });
});

describe('Function', () => {
    it('should return true', () => {
        expect(ko.types.Function(noop)).toBe(true);
    });

    it('should return false', () => {
        expect(ko.types.Function('')).toBe(false);
        expect(ko.types.Function(1)).toBe(false);
        expect(ko.types.Function(true)).toBe(false);
        expect(ko.types.Function(false)).toBe(false);
        expect(ko.types.Function(array)).toBe(false);
        expect(ko.types.Function(object)).toBe(false);
        expect(ko.types.Function(now)).toBe(false);
        expect(ko.types.Function(regexp)).toBe(false);
        expect(ko.types.Function(null)).toBe(false);
        expect(ko.types.Function(undefined)).toBe(false);
        expect(ko.types.Function(node)).toBe(false);
    });
});

describe('Date', () => {
    it('should return true', () => {
        expect(ko.types.Date(now)).toBe(true);
    });

    it('should return false', () => {
        expect(ko.types.Date('')).toBe(false);
        expect(ko.types.Date(1)).toBe(false);
        expect(ko.types.Date(true)).toBe(false);
        expect(ko.types.Date(false)).toBe(false);
        expect(ko.types.Date(array)).toBe(false);
        expect(ko.types.Date(object)).toBe(false);
        expect(ko.types.Date(regexp)).toBe(false);
        expect(ko.types.Date(null)).toBe(false);
        expect(ko.types.Date(undefined)).toBe(false);
        expect(ko.types.Date(node)).toBe(false);
    });
});

describe('RegExp', () => {
    it('should return true', () => {
        expect(ko.types.RegExp(regexp)).toBe(true);
    });

    it('should return false', () => {
        expect(ko.types.RegExp('')).toBe(false);
        expect(ko.types.RegExp(1)).toBe(false);
        expect(ko.types.RegExp(true)).toBe(false);
        expect(ko.types.RegExp(false)).toBe(false);
        expect(ko.types.RegExp(array)).toBe(false);
        expect(ko.types.RegExp(object)).toBe(false);
        expect(ko.types.RegExp(now)).toBe(false);
        expect(ko.types.RegExp(null)).toBe(false);
        expect(ko.types.RegExp(undefined)).toBe(false);
        expect(ko.types.RegExp(node)).toBe(false);
    });
});

describe('any', () => {
    it('should return true', () => {
        expect(ko.types.any('')).toBe(true);
        expect(ko.types.any(1)).toBe(true);
        expect(ko.types.any(true)).toBe(true);
        expect(ko.types.any(false)).toBe(true);
        expect(ko.types.any(array)).toBe(true);
        expect(ko.types.any(object)).toBe(true);
        expect(ko.types.any(now)).toBe(true);
        expect(ko.types.any(regexp)).toBe(true);
        expect(ko.types.any(node)).toBe(true);
    });

    it('should return false', () => {
        expect(ko.types.any(null)).toBe(false);
        expect(ko.types.any(undefined)).toBe(false);
    });
});

describe('instanceof', () => {
    const ctor = noop;
    const validator = ko.types.instanceof(ctor);

    it('should return true', () => {
        expect(validator(new ctor())).toBe(true);
    });

    it('should return false', () => {
        expect(validator('')).toBe(false);
        expect(validator(1)).toBe(false);
        expect(validator(true)).toBe(false);
        expect(validator(false)).toBe(false);
        expect(validator(array)).toBe(false);
        expect(validator(object)).toBe(false);
        expect(validator(now)).toBe(false);
        expect(validator(regexp)).toBe(false);
        expect(validator(null)).toBe(false);
        expect(validator(undefined)).toBe(false);
        expect(validator(node)).toBe(false);
    });
});

describe('Node', () => {
    it('should return true', () => {
        expect(ko.types.Node(node)).toBe(true);
    });

    it('should return false', () => {
        expect(ko.types.Node('')).toBe(false);
        expect(ko.types.Node(1)).toBe(false);
        expect(ko.types.Node(true)).toBe(false);
        expect(ko.types.Node(false)).toBe(false);
        expect(ko.types.Node(array)).toBe(false);
        expect(ko.types.Node(object)).toBe(false);
        expect(ko.types.Node(now)).toBe(false);
        expect(ko.types.Node(regexp)).toBe(false);
        expect(ko.types.Node(null)).toBe(false);
        expect(ko.types.Node(undefined)).toBe(false);
    });
});

describe('Element', () => {
    it('should return true', () => {
        expect(ko.types.Element(node)).toBe(true);
    });

    it('should return false', () => {
        expect(ko.types.Element('')).toBe(false);
        expect(ko.types.Element(1)).toBe(false);
        expect(ko.types.Element(true)).toBe(false);
        expect(ko.types.Element(false)).toBe(false);
        expect(ko.types.Element(array)).toBe(false);
        expect(ko.types.Element(object)).toBe(false);
        expect(ko.types.Element(now)).toBe(false);
        expect(ko.types.Element(regexp)).toBe(false);
        expect(ko.types.Element(null)).toBe(false);
        expect(ko.types.Element(undefined)).toBe(false);
    });
});
