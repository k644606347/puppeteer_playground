const path = require('path');
const openBrowser = require('react-dev-utils/openBrowser');

require('../src/index');

setTimeout(() => {
    [
        'http://localhost:3000/?url=https://finance.sina.cn/blog/master/index.d.html',
        'http://localhost:3000/?url=http://localhost:3000/public/aessts-load-error.html',
        'http://localhost:3000/?url=http://localhost:3000/public/unknown.html'
    ].forEach(url => {
        openBrowser(url);
    });
}, 2000);