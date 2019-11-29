let isProd = process.env.NODE_ENV === 'production';

// 开发环境
const dev = {
    port: '3000',
    ip: '0.0.0.0',
}

// 生产环境
const prod = {
    port: '80',
    ip: '0.0.0.0',
}

// 判断process.env.NODE_ENV并返回对应的配置
function get() {
    return isProd ? prod : dev;
}
console.log('process.env.NODE_ENV = ', process.env.NODE_ENV);
module.exports = {
    isProd,
    dev,
    prod,
    get,
}