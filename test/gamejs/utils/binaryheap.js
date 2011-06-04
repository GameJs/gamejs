var assert = require('assert');

var {BinaryHeap} = require('../../../lib/gamejs/utils/binaryheap');

exports.testPushPop = function() {
   var ITEMS = [10, 3, 4, 8, 2, 9, 7, 1, 2, 6, 5];
   var heap = new BinaryHeap(function(x){return x;});

   ITEMS.forEach(function(item) {
      heap.push(item);
   }, this);

   ITEMS.sort(function(a, b) { return a > b ? 1 : -1; });
   var i = 0;
   while (heap.size() > 0) {
      assert.equal(heap.pop(), ITEMS[i]);
      i++;
   };
};

exports.testRemove = function() {
   var ITEMS = [10, 3, 4, 8, 2, 9, 7, 1, 2, 6, 5];
   var heap = new BinaryHeap(function(x){return x;});

   ITEMS.forEach(function(item) {
      heap.push(item);
   });

   assert.throws(function() { heap.remove(88); });
   assert.isUndefined(heap.remove(2));
   assert.isUndefined(heap.remove(2));
   assert.throws(function() { heap.remove(2); });
};
