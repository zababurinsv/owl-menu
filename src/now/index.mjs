import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
import convert from './urlencodedTojson.mjs'

export default async (req, res)  => {
        let body = {}
        body = await convert['convert'](req)
        body = await convert['json'](body)
        res.end(body);
};
