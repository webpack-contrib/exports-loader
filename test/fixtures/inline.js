const test1 = require('../../src/index.js?exports=Foo!./simple.js');
const test2 = require('../../src/index.js?exports=Foo,Bar!./simple.js');
const test4 = require('../../src/index.js?exports=Foo!./simple.js');
const test5 = require('../../src/index.js?type=commonjs&exports=Foo!./simple.js');
const test6 = require('../../src/index.js?type=module&exports=Foo!./simple.js');
const test7 = require('../../src/index.js?type=module&exports=default%20Foo!./simple.js');
const test8 = require('../../src/index.js?type=module&exports=named%20Foo!./simple.js');
const test9 = require('../../src/index.js?type=commonjs&exports=single%20Foo!./simple.js');
const test10 = require('../../src/index.js?type=commonjs&exports=multiple%20Foo!./simple.js');
const test11 = require('../../src/index.js?type=module&exports=named%20Foo%20FooA!./simple.js');
const test12 = require('../../src/index.js?type=module&exports=named|Foo%20FooA,named%20Bar%20BarA!./simple.js');
const test13 = require('../../src/index.js?type=module&exports=named|Foo|FooA,named|Bar|BarA!./simple.js');
const test14 = require('../../src/index.js?type=module&exports=default|Foo!./simple.js');

module.exports = {
  test1,
  test2,
  test4,
  test5,
  test6,
  test7,
  test8,
  test9,
  test10,
  test11,
  test12,
  test13,
  test14
};
