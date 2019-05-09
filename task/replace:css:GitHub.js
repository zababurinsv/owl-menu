let through = require('through2');
let PluginError = require('plugin-error');

exports.handler = (event, context, callback) => {
    if(!context) {
        context = {};
    }
    return through.obj(function (file, enc, cb) {
        if (Number.isNaN(file)) {
            // return as is
            cb(null, file);

        } else if (file.isBuffer()) {
            try {
                let content = file.contents.toString('utf8');
                console.log('~~~~~~find~~~~~', content.indexOf('static/html/light.css'))
                content = content.replace(

                    '/static/html/light.css',

                    '/light.css')

                file.contents = new Buffer(content, 'utf8');
                callback(null, 'replaceCssGitHub')
                cb(null, file);
            }
            catch (err) {
                throw new PluginError('my-transformation', err);
            }
        } else if (file.isStream()) {
            throw new PluginError('my-transformation', 'Streams are not supported!');
        }
    });
}