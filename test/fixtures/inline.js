const test1 = require('../../src/cjs.js?exports=Foo!./simple.js');
const test2 = require('../../src/cjs.js?exports[]=Foo&exports[]=Bar!./simple.js');
const test3 = require('../../src/cjs.js?exports=[name]!./simple.js');
const test4 = require('../../src/cjs.js?exports=Foo!./simple.js');
const test5 = require('../../src/cjs.js?type=commonjs&exports=Foo!./simple.js');
const test6 = require('../../src/cjs.js?type=module&exports=Foo!./simple.js');

module.exports = {
  test1,
  test2,
  test3,
  test4,
  test5,
  test6,
};
