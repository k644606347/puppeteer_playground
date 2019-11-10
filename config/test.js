const path = require('path');
const openBrowser = require('react-dev-utils/openBrowser');
const env = require('./env');

require('../src/index');

let origin = `http://${env.ip}:${env.port}`;
setTimeout(() => {
    [
        `${origin}/?url=https://finance.sina.cn/blog/master/index.d.html`,
        `${origin}/?url=${origin}/public/aessts-load-error.html`,
        `${origin}/?url=${origin}/public/404.html`,
    ].forEach(url => {
        openBrowser(url);
    });
}, 2000);