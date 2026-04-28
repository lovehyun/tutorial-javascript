// 간단한 타임스탬프 + 카테고리 로거
function ts() {
    return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

function log(category, ...args) {
    console.log(`[${ts()}] [${category}]`, ...args);
}

function warn(category, ...args) {
    console.warn(`[${ts()}] [${category}]`, ...args);
}

function error(category, ...args) {
    console.error(`[${ts()}] [${category}]`, ...args);
}

module.exports = { log, warn, error };
