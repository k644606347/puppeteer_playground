'use strict';

const path = require('path');
const express = require('express');
const app = express();
const puppeteer = require('puppeteer');
const colors = require('colors');
const tools = require('./Tools');
const { isDebugReq } = require('./Is');
const env = require('../config/env');
const envInfo = env.get();
const { ErrorHandler } = require('./controllers/ErrorHandler');

app.use('/public/',express.static(path.resolve(__dirname, '../public')));
app.get('/check', function (req, res) {
    let { query } = req,
        { url } = query;

    /**
     * @field failed-assets
     *      @field url
     *      @field resourceType
     *      @field error
     *      @field http-code
     * 
     * @field http-code
     * @field content-type
     * @field content-length
     * @field page-error
     */
    let result = {
        'failed-assets': []
    };

    // console.clear();
    async function process() {
        let browserOptions = {
            // executablePath: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome',
            // args: ['--no-sandbox'],
            ...isDebugReq(req) && {
                headless: false,
                devtools: true,
            }
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
                    res = req.response(),
                    httpCode = res ? res.status() : null,
                    failureObj = req.failure(),
                    errorText = failureObj && failureObj.errorText || '';

                if (!errorText) {
                    if (/^https:\/\//.test(url) && /^http:\/\//.test(resourceUrl)) {
                        errorText = 'https页面引入http资源';
                    }
                }
                result['failed-assets'].push({
                    url: resourceUrl,
                    'resource-type': req.resourceType(),
                    error: errorText,
                    'http-code': httpCode,
                });
            });

        page.goto(url, {
            timeout: 30000,
            waitUntil: [
                'networkidle0' // 不再有网络连接时触发（至少500毫秒后）
            ]
        })
            .then(res => {
                result['http-code'] = res.status();
                return res.text()
                    .then(val => {
                        try {
                            JSON.parse(val);
                            result['content-type'] = 'json';
                        } catch(err) {
                            result['content-type'] = 'html';
                        }
                        result['content-length'] = val.length;
                    })
                    .catch(err => {
                        result['page-error'] = tools.formatError(err);
                    })
            }, (err) => {// 页面级加载失败
                result['http-code'] = null; // catch中没有获取http code的方法
                result['page-error'] = tools.formatError(err);
            })
            .then(() => {
                res.json(result);
                // page.close();
                browser.close();
            });
    };

    process().catch((err) => {
        res.json({
            status: 1,
            msg: tools.formatError(err),
        });
    })
});

app.all('/test', (req, res) => {
    res.json({
        query: req.query,
        httpCode: res.statusCode,
    })
});

ErrorHandler(app);

app.listen(envInfo.port, envInfo.ip, function () {
    console.log(`Example app listening on port ! ${envInfo.port}`);
});