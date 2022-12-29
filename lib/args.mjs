export function parseArgs(specs = {}, args = []) {
    const params = args.slice(2);
    const parsed = {};

    for (const [key, type] of Object.entries(specs)) {
        const idx = params.indexOf(`-${str2abbr(key)}`);
        if (idx > -1 && idx < params.length - 1) {
            parsed[key] = parseValue(params[idx + 1], type);
        }
    }

    return parsed;
}

export function argsToUsageStr(specs = {}) {
    return Object.keys(specs).reduce((p, key) => p += ` -${str2abbr(key)} <${key}>`, `Usage: npm start --`);
}

function parseValue(str, type) {
    if (type === Number) {
        const n = parseInt(str, 10);
        return isNaN(n) ? 0 : n;
    }
    else return str;
}

function str2abbr(str = '') {
    return str.split('_').map(c => c[0]).join('');
}
