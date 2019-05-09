import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

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

        })}else{

            resolve(req)
        }
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

export default async (req, res)  => {

   console.log('~~~~~~~~~~~~~~~', req)
        // let body = {}
        // body = await convert(req)
        // body = await json(body)
        res.end(null,req);

};
