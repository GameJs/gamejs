var assert = require('assert');
var {Mask} = require('gamejs/mask');

exports.testSimple = function() {

   var m1 = new Mask([10, 10]);
   var m2 = new Mask([10, 10]);

   // no overlap
   assert.isFalse(m1.overlap(m2));
   assert.equal(m1.overlapArea(m2), 0);
   var collideMask = m1.overlapMask(m2);
   assert.equal(collideMask.length, 0);

   // 1 pixel overlap
   for (var i=0;i<10;i++) {
      m1.setAt(0, i);
      m2.setAt(i, 0);
   }
   assert.isTrue(m1.overlap(m2));
   assert.equal(m1.overlapArea(m2), 1);
   collideMask = m1.overlapMask(m2);
   assert.equal(collideMask.length, 1);
   assert.isTrue(collideMask.getAt(0,0));

   // 2 overlap
   m1.setAt(5,0);
   assert.equal(m1.overlapArea(m2), 2);
   collideMask = m1.overlapMask(m2);
   assert.equal(collideMask.length, 2);
   assert.isTrue(collideMask.getAt(5, 0));

   // no overlap with offset
   assert.isFalse(m1.overlap(m2, [1, 1]));

   // but with this offset
   assert.isTrue(m1.overlap(m2, [0, 1]));
   collideMask = m1.overlapMask(m2, [0, 1]);
   assert.equal(collideMask.length, 1);
   assert.isTrue(collideMask.getAt(0, 1));

   return;
};
