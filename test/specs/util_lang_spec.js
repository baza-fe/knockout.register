import {
    some,
    every,
    toArray
} from '../../src/util/';

describe('some', () => {
    it('should return true', () => {
        expect(some([0, 1], (v) => { return v === 0; })).toBe(true);
    });

    it('should return false', () => {
        expect(some([1], (v) => { return v === 0; })).toBe(false);
    });
});

describe('every', () => {
    it('should return true', () => {
        expect(every([1, 2], (v) => { return v > 0; })).toBe(true);
    });

    it('should return false', () => {
        expect(every([], (v) => { return v > 0; })).toBe(false);
        expect(every([0, 1], (v) => { return v > 0; })).toBe(false);
    });
});

describe('toArray', () => {
    it('should return array', () => {
        expect(toArray([ 0, 1 ]).join(',') === '0,1').toBe(true);
    });

    it('should return array', () => {
        expect(toArray({
            0: 0,
            1: 1,
            length: 2
        }).join(',') === '0,1').toBe(true);
    });
});
