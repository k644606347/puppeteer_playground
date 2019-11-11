let isProd = process.env.NODE_ENV === 'production';

console.log('::::', isProd);
module.exports = {
    port: isProd ? '80' : '3000',
    ip: '0.0.0.0',
}