
const { isFunction, isPlainObject } = require('../Is');

function makeController(actions = {}, options = {}) {
    return function (app) {
        for(let k in actions) {
            let settings = actions[k],
                actionFn = isPlainObject(settings) ? settings.action : settings,
                httpMethod = isPlainObject(settings) ? (settings.method || 'all') : 'all';
    
            if (!isFunction(actionFn)) {
                throw new Error(`actionFn必须是一个函数，当前是${actionFn}，，请确认key为${k}的action配置！`);
            }
            if (!isFunction(app[httpMethod])) {
                throw new Error(`"${k}"在Express中没有适配的函数，请确认key为"${k}"的action配置！`);
            }

            app[httpMethod](actionFn);
        }
    }
}

module.exports = { makeController };