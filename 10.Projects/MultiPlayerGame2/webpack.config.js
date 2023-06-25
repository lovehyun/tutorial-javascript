// webpack.config.js

const path = require('path');

module.exports = {
    entry: './client/main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './client/dist'),
    },
    mode: 'production',
};
