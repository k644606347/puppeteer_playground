const toString = Object.prototype.toString;
const compareToString = (v, str) => toString.call(v) === str;

const isNumber = (v) => compareToString(v, '[object Number]');
const isString = (v) => compareToString(v, '[object String]');
const isBoolean = (v) => compareToString(v, '[object Boolean]');
const isUndefined = (v) => v === undefined;
const isNull = (v) => v === null;
const isNaN = (v) => Number.isNaN(v);

const isArray = (v) => Array.isArray(v);
const isFunction = (v) => compareToString(v, '[object Function]');
const isPlainObject = (v) => compareToString(v, '[object Object]');
const isPromise = (v) => compareToString(v, '[object Promise]');
const isError = (v) => compareToString(v, '[object Error]');

const isEmptyObject = (v) => {
    let p;
    if (!isPlainObject(v)){
        return false;
    }
    for (p in v) {
        if (v.hasOwnProperty(p)) {
            return false;
        }
    }
    return true;
}

function isEmptyContent(v) {
    return v === undefined || v === null || v === '';
}

function isDebugReq(req) {
    return req.query._debug === '1';
}

module.exports = {
    isError,
    isDebugReq,
}