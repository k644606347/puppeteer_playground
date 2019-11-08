'use strict';

const express = require('express');
const app = express();
const puppeteer = require('puppeteer');
const colors = require('colors');
const tools = require('./Tools');
const { isDebugReq } = require('./Is');

app.get('/', function (req, res) {
    let { query } = req,
        { url, useChromium } = query;

    // mock
    // url = 'http://financec.sinda.cn/blog/master/index.d.html';

    /**
     * @field requestfailed_assets
     * @field http-code
     * @field content-type
     * @field page-error
     */
    let result = {
        requestfailed_assets: []
    };

    console.clear();
    (async () => {
        let browserOptions = {
            headless: false,
            executablePath: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome',
            devtools: true,
            // ...isDebugReq(req) && {
            //     executablePath: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome',
            //     devtools: true,
            // }
        }
        const browser = await puppeteer.launch(browserOptions);
        const [page] = await browser.pages();
        page.on('pageerror', (err) => {// 获取js抛出的error
            console.error(colors.red(err));
        })
        .on('requestfailed', function(req) {// 获取页面加载资源失败的情况
            let resourceUrl = req.url(),
                failureObj = req.failure(),
                errorText = failureObj && failureObj.errorText || '';

            if (!errorText) {
                if (/^https:\/\//.test(url) && /^http:\/\//.test(resourceUrl)) {
                    errorText = 'https页面引入http资源';
                }
            }
            result.requestfailed_assets.push({
                url: resourceUrl,
                resourceType: req.resourceType(),
                errorText,
            });
        });

        let options = {
            timeout: 0,
            waitUntil: [
                'load'
            ]
        };
        await page.goto(url, options)
            .then(res => {
                result['http-code'] = res.status();
                return res.text()
                    .then(val => {
                        try {
                            JSON.parse(val);
                            result['content-type'] = 'html/json';
                        } catch(err) {
                            result['content-type'] = 'html/text';
                        }
                        result['content-length'] = val.length;
                    })
                    .catch(err => {
                        result['page-error'] = tools.formatError(err);
                    })
            }, (err) => {
                result['http-code'] = ''; // catch中没有获取http code的方法
                result['page-error'] = tools.formatError(err);
            })
            .then(() => {
                setTimeout(() => {
                    res.json(result);
                    page.close();
                    browser.close();
                }, 10000);
            });
    })();
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});