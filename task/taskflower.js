let through = require('through2');
let PluginError = require('plugin-error');

module.exports = function myTransformation(options) {
    if(!options) {
        options = {};
    }
    return through.obj(function (file, enc, cb) {
        if (Number.isNaN(file)) {
            // return as is
            cb(null, file);

        } else if (file.isBuffer()) {
            try {
                const content = file.contents.toString('utf8');
                console.log('~~~~~~NOW~style~~~~~', content)
                // do any transformation
                file.contents = new Buffer(content, 'utf8');
                cb(null, file);
            }
            catch (err) {
                throw new PluginError('my-transformation', err);
            }

        } else if (file.isStream()) {
            throw new PluginError('my-transformation', 'Streams are not supported!');
        }
    });
};