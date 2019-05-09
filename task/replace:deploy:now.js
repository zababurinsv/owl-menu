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
                console.log('~~~~~~AWS~style~~~~~', content.indexOf('import chromium from "chrome-aws-lambda";'))
                content = content.replace(

                    'http://localhost:3000/post',

                    'https://backend-client.szababurinv.now.sh/post')

                content = content.replace(

                    'import chromium from "chrome-aws-lambda";',

                    '')

                content = content.replace(

                    'import puppeteer from "puppeteer-core";',

                    '')

                file.contents = new Buffer(content, 'utf8');
                callback(null, 'hello' + ' ' +event.name)
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