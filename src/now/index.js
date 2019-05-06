const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

let stack = [];
stack.staticProperty = []

function convert (req){
    return new Promise((resolve, reject) => {
        if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
            resolve(body)

        })}
    })
}

function json (str){
    return new Promise((resolve, reject) => {
        let obj,i,pt,keys,j,ev;

        if (typeof json.br !== 'function')
        {
            json.br = function(repl)
            {
                if (repl.indexOf(']') !== -1)
                {
                    return repl.replace(/\](.+?)(,|$)/g,function($1,$2,$3)
                    {
                        return json.br($2+'}'+$3);
                    });
                }
                return repl;
            };
        }
        str = '{"'+(str.indexOf('%') !== -1 ? decodeURI(str) : str)+'"}';
        obj = str.replace(/\=/g,'":"').replace(/&/g,'","').replace(/\[/g,'":{"');
        obj = JSON.parse(obj.replace(/\](.+?)(,|$)/g,function($1,$2,$3){ return form2Json.br($2+'}'+$3);}));
        pt = ('&'+str).replace(/(\[|\]|\=)/g,'"$1"').replace(/\]"+/g,']').replace(/&([^\[\=]+?)(\[|\=)/g,'"&["$1]$2');
        pt = (pt + '"').replace(/^"&/,'').split('&');
        for (i=0;i<pt.length;i++)
        {
            ev = obj;
            keys = pt[i].match(/(?!:(\["))([^"]+?)(?=("\]))/g);
            for (j=0;j<keys.length;j++)
            {
                if (!ev.hasOwnProperty(keys[j]))
                {
                    if (keys.length > (j + 1))
                    {
                        ev[keys[j]] = {};
                    }
                    else
                    {
                        ev[keys[j]] = pt[i].split('=')[1].replace(/"/g,'');
                        break;
                    }
                }
                ev = ev[keys[j]];
            }
        }
        obj = JSON.stringify(obj)
        resolve(obj)
    })
}

module.exports = async (req, res)  => {
        let body = {}
        body = await convert(req)
        body = await json(body)

        res.end(body);
        // const query = await json(req);
        // let result = null;
        // let browser = null;
        // browser = await puppeteer.launch({
        //     args: chromium.args,
        //     defaultViewport: chromium.defaultViewport,
        //     executablePath: await chromium.executablePath,
        //     headless: chromium.headless,
        // });
        // let page = await browser.newPage();
        // await page.goto('https://index-2d7a4.firebaseapp.com/', {waitUntil: 'networkidle0'});
        // result = await page.content();
        // await browser.close();
        // res.statusCode = 200;
        // res.end(query);
};
