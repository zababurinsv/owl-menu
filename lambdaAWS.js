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

        console.log('~~~~~~AWS~style~~~~~', content.indexOf('`/${obj.tagName.toLowerCase()}.js`'))
        content = content.replace(

            '`@import \'/static/html/components/${obj[\'component\']}/${obj[\'state\'][state]}/${obj[\'component\']}.css\'; @import \'/static/html/components/${obj[\'component\']}/${obj[\'state\'][state]}/${obj[\'component\']}-custom.css\';`',

            '`@import \'./${obj[\'component\']}.css\'; @import \'./${obj[\'component\']}-custom.css\';`')


        content = content.replace(

            '`/static/html/components/${obj[\'component\']}/${obj[\'component\']}.html`',

            '`./${obj[\'component\']}.html`')


        content = content.replace(

            '`/static/html/components/${obj[\'component\']}/template/${obj[\'parent\']}.html`',

            '`./${obj[\'parent\']}.html`')

        content = content.replace(

            '`/static/html/components/${obj[\'component\']}/template/${obj[\'this\'].getAttribute(\'preset\')}/${obj[\'component\']}-${obj[\'this\'].getAttribute(\'preset\')}.html`',

            '`./${obj[\'component\']}-${obj[\'this\'].getAttribute(\'preset\')}.html`')


        content = content.replace(

            '`/static/html/components/varan-slider/template/${obj[\'slot\']}.html`',

            '`./${obj[\'slot\']}.html`')


        content = content.replace(

            '`/static/html/components/${obj[\'component\']}/external/${obj[\'component\']}-external.html`',

            '`./${obj[\'component\']}-external.html`')


        content = content.replace(

            '`/static/html/components/${obj.tagName.toLowerCase()}/${obj.tagName.toLowerCase()}.js`',

            '`./${obj.tagName.toLowerCase()}.js`')


        if(context === 'gitHub'){
          content = content.replace(

              '\'gitHub build false\'',

              '\'gitHub build true\'')

        }

        file.contents = new Buffer(content, 'utf8');
        callback(null, 'hello' + event.name)
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