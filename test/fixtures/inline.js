const test1 = require('../../src/cjs.js?exports=Foo!./simple.js');
const test2 = require('../../src/cjs.js?exports[]=Foo&exports[]=Bar!./simple.js');
const test3 = require('../../src/cjs.js?exports=[name]!./simple.js');
const test4 = require('../../src/cjs.js?exports=Foo!./simple.js');
const test5 = require('../../src/cjs.js?type=commonjs&exports=Foo!./simple.js');
const test6 = require('../../src/cjs.js?type=module&exports=Foo!./simple.js');
const test7 = require('../../src/cjs.js?type=module&exports=default%20Foo!./simple.js');
const test8 = require('../../src/cjs.js?type=module&exports=named%20Foo!./simple.js');
const test9 = require('../../src/cjs.js?type=commonjs&exports=single%20Foo!./simple.js');
const test10 = require('../../src/cjs.js?type=commonjs&exports=multiple%20Foo!./simple.js');
const test11 = require('../../src/cjs.js?type=module&exports=named%20Foo%20FooA!./simple.js');
const test12 = require('../../src/cjs.js?type=module&exports[]=named%20Foo%20FooA&exports[]=named%20Bar%20BarA!./simple.js');

module.exports = {
  test1,
  test2,
  test3,
  test4,
  test5,
  test6,
  test7,
  test8,
  test9,
  test10,
  test11,
  test12
};
