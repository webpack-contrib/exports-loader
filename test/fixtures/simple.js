var Foo = Foo || {};
var Bar = Bar || {};
var Baz = {
  nestedNumber: '12',
  nestedFunction: function test() {}
};
var simple = function simple() {};
var simple_foo = [1, 2, 3, 4, 5];

Foo.Image = function(width, height, data){
  this.width = width || 0;
  this.height = height || 0;
  this.data = data || [];
};

Bar.test = [1, 2, 3, 4];

class MyClass {
  myFunction() {
    return 12;
  }
}

const myVariable = new MyClass();
