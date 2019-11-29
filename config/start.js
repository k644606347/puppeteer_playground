const path = require('path');
const openBrowser = require('react-dev-utils/openBrowser');
const env = require('./env');

require('../src/index');

let origin = `http://${env.dev.ip}:${env.dev.port}`;
setTimeout(() => {
    [
        `${origin}/check?url=https://finance.sina.cn/blog/master/index.d.html`
    ].forEach(url => {
        openBrowser(url);
    });
}, 2000);