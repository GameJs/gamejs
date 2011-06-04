How can I divide my code into various files / modules?
========================================================

GameJs follows the CommonJs Module Pattern! You can split your project
into modules and conviniently load them.

A module is just a plain JavaScript file which exports some
properties. Only exported properties are then visible for other
modules that require it. For example, say you have one file foo.js:

    // in foo.js
    var adder = function(a, b) {
        return a + b;
    };
    exports.add = function(a, b) {
        return adder(a, b);
    };

.. then another file `bar.js` can load the module `foo` and use its
function `add()`  like this:

    // in bar.js:
    var foo = require('./foo');
    foo.add(2, 2)

You can also split your files into directories. Check out this example
app, it uses require() a lot:

https://github.com/oberhamsi/gamejs/tree/master/examples/example-scene


(especially see how main.js does `require('./tyround')` and in
tyround.js more modules from the tyround/ directory are loaded).

For more in depth info on CommonJs Modules see:

  * Another explanation http://ringojs.org/wiki/Tutorial#modules
  * More technical explanation http://ringojs.org/wiki/Modules_in_RingoJS/
  * the commonjs specification http://wiki.commonjs.org/wiki/Modules/1.1

With a minimal extension to JavaScript
(the new `exports` and `require()`) we get a very capable module
system.


JavaScript Class System
========================

JavaScript has very powerfull prototypal inheritance and I prefer it
over the "usual" class based inheritance - well, frankly, I avoid
inheritance, especially in games.

The following two, rather short, articles from Douglas Crockford
explain the JavaScript concepts very well! I encourge you to read
them. They give you inheritance without any magic - you will  understand what is going on.
And it gives you public as well as private class members:

  * Prototypal inheritance http://javascript.crockford.com/prototypal.html
  * Private Members in JS http://javascript.crockford.com/private.html

Prototypal inheritance is what GameJs' extend() does! And the module
pattern from the second article fits CommonJs very well! In fact I
follow the pattern mentioned in the second article very closely for my
classes! Like this:

     // a module file exporting a class
     exports.Constructor = function() {
          var privateVariable = 'foo';
          this.publicVariable = 'bar';
          this.priviligedFunction = function() {
              // can access private properties
              return privateVariable;
          };
          return this;
     };
     Constructor.prototype.publicMethod = function() {
         // can only access public properties
         return this.publicVariable;
     };
