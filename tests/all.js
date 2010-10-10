// browser env
exports.testGamejs = require('./gamejs');

// start the test runner if we're called directly from command line
if (require.main == module.id) {
    require('test').run(exports);
}
