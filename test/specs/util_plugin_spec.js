import { mixin } from '../../src/util/';

describe('mixin', () => {
    const parent = Object.create({});
    const son = Object.create(parent);

    parent.a = function () {};
    parent.b = function () {};
    son.c = function () {};
    son.d = function () {};

    it('should mix methods', () => {
        const result = mixin({}, null, son);

        expect(result.c).toBe(son.c);
        expect(result.d).toBe(son.d);
    });

    it('should mix own methods', () => {
        const result = mixin({}, null, son);

        expect(result.hasOwnProperty('c')).toBe(true);
        expect(result.hasOwnProperty('d')).toBe(true);
    });

    it('should not mix inherited methods', () => {
        const result = mixin({}, null, son);

        expect(result.hasOwnProperty('a')).toBe(false);
        expect(result.hasOwnProperty('b')).toBe(false);
    });

    it('should sencond param to be optional', () => {
        const result = mixin({}, son);

        expect(result.c).toBe(son.c);
        expect(result.d).toBe(son.d);
    });

    it('should not throw error without given anything', () => {
        expect(() => {
            mixin();
        }).not.toThrow();
    });

    it('should not throw error without given mixins', () => {
        expect(() => {
            mixin({});
        }).not.toThrow();
    });

    it('should call preMix with opts', () => {
        son.preMix = function () {};
        spyOn(son, 'preMix');

        const opts = {};
        mixin({}, opts, son);

        expect(son.preMix).toHaveBeenCalledWith(opts);
    });

    it('should call postMix with opts', () => {
        son.postMix = function () {};
        spyOn(son, 'postMix');

        const opts = {};
        mixin({}, opts, son);

        expect(son.postMix).toHaveBeenCalledWith(opts);
    });

    it('should not call preMix with dest as context', () => {
        const dest = {};

        son.preMix = function () {
            expect(this).not.toBe(dest);
        };

        mixin(dest, {}, son);
    });

    it('should call postMix with dest as context', () => {
        const dest = {};

        son.postMix = function () {
            expect(this).toBe(dest);
        };

        mixin(dest, {}, son);
    });

    it('should call preMix before postMix', () => {
        const spy = jasmine.createSpy('spy');

        son.preMix = function () {
            spy(son.preMix);
        };

        son.postMix = function () {
            spy(son.postMix);
        };

        mixin({}, {}, son);

        expect(spy.calls.first().args[0]).toBe(son.preMix);
        expect(spy.calls.mostRecent().args[0]).toBe(son.postMix);
    });
});
