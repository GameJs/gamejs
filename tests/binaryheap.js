var BinaryHeap = require('gamejs/math/binaryheap').BinaryHeap;
qModule('gamejs/math/binaryheap');

test('PushPop', function() {
   var ITEMS = [10, 3, 4, 8, 2, 9, 7, 1, 2, 6, 5];
   var heap = new BinaryHeap(function(x){return x;});

   ITEMS.forEach(function(item) {
      heap.push(item);
   }, this);

   ITEMS.sort(function(a, b) { return a > b ? 1 : -1; });
   var i = 0;
   while (heap.size() > 0) {
      equal(heap.pop(), ITEMS[i]);
      i++;
   };
});

test('Remove', function() {
   var ITEMS = [10, 3, 4, 8, 2, 9, 7, 1, 2, 6, 5];
   var heap = new BinaryHeap(function(x){return x;});

   ITEMS.forEach(function(item) {
      heap.push(item);
   });

   //raises(function() { heap.remove(88); });
   strictEqual(heap.remove(2), true);
   strictEqual(heap.remove(2), true);
   //raises(function() { heap.remove(2); });
});
