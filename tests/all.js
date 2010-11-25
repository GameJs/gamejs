// browser env
exports.testGamejs = require('./gamejs');
exports.testSprite = require('./gamejs/sprite');
exports.testVector = require('./gamejs/utils/vectors');
exports.testAstar = require('./gamejs/pathfinding');
exports.testBinaryHeap = require('./gamejs/utils/binaryheap');
// start the test runner if we're called directly from command line
if (require.main == module.id) {
    require('test').run(exports);
}
