'use strict';

const express = require('express');
const app = express();
const puppeteer = require('puppeteer');
const colors = require('colors');
const tools = require('./Tools');
const { isDebugReq } = require('./Is');

app.get('/', function (req, res) {
    let { query } = req,
        { url } = query;

    // mock
    // url = 'http://financec.sinda.cn/blog/master/index.d.html';

    /**
     * @field failed_assets
     * @field http-code
     * @field content-type
     * @field page-error
     */
    let result = {
        failed_assets: []
    };

    console.clear();
    (async () => {
        let browserOptions = {
            headless: false,
            // executablePath: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome',
            devtools: true,
            // ...isDebugReq(req) && {
            //     executablePath: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome',
            //     devtools: true,
            // }
        }
        const browser = await puppeteer.launch(browserOptions);
        const [page] = await browser.pages();
        page
            .on('error', function(err) {// 当页面崩溃时触发。
                console.error(err);
            })
            .on('pageerror', function(err) {// 当发生页面js代码没有捕获的异常时触发。
                console.error(err);
            })
            .on('requestfailed', function(req) {// 资源加载失败的情况下触发（js、css、image等）
                let resourceUrl = req.url(),
                    failureObj = req.failure(),
                    errorText = failureObj && failureObj.errorText || '';

                if (!errorText) {
                    if (/^https:\/\//.test(url) && /^http:\/\//.test(resourceUrl)) {
                        errorText = 'https页面引入http资源';
                    }
                }
                result.failed_assets.push({
                    url: resourceUrl,
                    resourceType: req.resourceType(),
                    errorText,
                });
            });

        page.goto(url, {
            timeout: 3000,
            waitUntil: [
                'networkidle0'
            ]
        })
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
            }, (err) => {// 页面级加载失败
                result['http-code'] = ''; // catch中没有获取http code的方法
                result['page-error'] = tools.formatError(err);
            })
            .then(() => {
                    res.json(result);
                    // page.close();
                    browser.close();
            });
    })();
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});