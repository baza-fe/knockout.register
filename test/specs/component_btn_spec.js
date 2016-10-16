import '../../src/';
import Btn from '../samples/components/btn';

// describe('btn', () => {
//     const body = document.querySelector('body');
//     const warn = console.warn;
//     const logs = [];

//     console.warn = (err) => {
//         logs.push(err);
//         warn(err);
//     };

//     beforeAll(() => {
//         ko.components.register(Btn);
//         logs.length = 0;
//     });

//     afterAll(() => {
//         ko.components.unregister(Btn.name);
//         logs.length = 0;
//     });

//     beforeEach(() => {
//         body.innerHTML = `
//             <div id="test">
//                 <btn></btn>
//             </div>
//         `;
//         ko.applyBindings(null, document.querySelector('#test'));
//     });

//     afterEach(() => {
//         body.innerHTML = '';
//     });

//     it('should create properties', () => {
//         const vm = ko.components.querySelector('btn');

//         expect(ko.isObservable(vm.string)).toBe(true);
//         expect(ko.isObservable(vm.number)).toBe(true);
//         expect(ko.isObservable(vm.boolean)).toBe(true);
//         expect(ko.isObservable(vm.object)).toBe(true);
//         expect(ko.isObservable(vm.array)).toBe(true);
//         expect(ko.isObservable(vm.function)).toBe(true);
//         expect(ko.isObservable(vm.date)).toBe(true);
//         expect(ko.isObservable(vm.regexp)).toBe(true);
//         expect(ko.isObservable(vm.any)).toBe(true);
//         // expect(ko.isObservable(vm.shape)).toBe(true);
//         // expect(ko.isObservable(vm.required)).toBe(true);
//         // expect(ko.isObservable(vm.oneOf)).toBe(true);
//         // expect(ko.isObservable(vm.oneOfType)).toBe(true);
//     });

//     it('should creat nested properties', () => {

//     });

//     it('should emit warnings', () => {
//         // expect(logs.shift()).toBe('Type Error: string is undefined but ko.types.string was expected.');
//         // expect(logs.shift()).toBe('Type Error: number is undefined but ko.types.number was expected.');
//         // expect(logs.shift()).toBe('Type Error: boolean is undefined but ko.types.boolean was expected.');
//         // expect(logs.shift()).toBe('Type Error: object is undefined but ko.types.object was expected.');
//         // expect(logs.shift()).toBe('Type Error: array is undefined but ko.types.array was expected.');
//         // expect(logs.shift()).toBe('Type Error: function is undefined but ko.types.function was expected.');
//         // expect(logs.shift()).toBe('Type Error: date is undefined but ko.types.date was expected.');
//         // expect(logs.shift()).toBe('Type Error: regexp is undefined but ko.types.regexp was expected.');
//         // expect(logs.shift()).toBe('Type Error: any is undefined but ko.types.any was expected.');
//         // expect(logs.shift()).toBe('Type Error: shape is undefined but ko.types.shape was expected.');
//         // expect(logs.shift()).toBe('Type Error: required is undefined but ko.types.required was expected.');
//         // expect(logs.shift()).toBe('Type Error: oneOf is undefined but ko.types.oneOf was expected.');
//         // expect(logs.shift()).toBe('Type Error: oneOfType is undefined but ko.types.oneOfType was expected.');
//         expect(logs.length).toBe(0);
//     });

//     it('should not emit warnings', () => {
//         const logs = [];

//         body.innerHTML = `
//             <div id="test">
//                 <btn k-string="string"
//                      k-number="number"
//                      k-boolean="boolean"
//                      k-object="object"
//                      k-array="array"
//                      k-function="function"
//                      k-date="date"
//                      k-regepx="regepx"
//                      k-any="any"
//                      k-shape="shape"
//                      k-required="required"
//                      k-one-of="oneOf"
//                      k-one-of-type="oneOfType"></btn>
//             </div>
//         `;

//         ko.applyBindings({
//             string: 'string',
//             number: 1,
//             boolean: true,
//             object: {},
//             array: [],
//             function: function () {},
//             date: new Date(),
//             regepx: /\w/img,
//             any: {},
//             shape: {
//                 string: 'string',
//                 number: 1,
//                 boolean: true,
//                 object: {},
//                 array: [],
//                 function: function () {},
//                 date: new Date(),
//                 regepx: /\w/img
//             },
//             required: 'required',
//             oneOf: 1,
//             oneOfType: 'oneOfType',
//         }, document.querySelector('#test'));

//         expect(logs.length).toBe(0);
//     });
// });
