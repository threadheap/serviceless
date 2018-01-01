'use strict';

const getArgv = (rawArgs, options) => {
    const optionsHash = {};
    options.forEach(option => {
        optionsHash[option.short] = option;
        optionsHash[option.long] = option;
    });

    return rawArgs
        .filter(arg => {
            return !optionsHash[arg];
        })
        .join(' ');
};

module.exports = getArgv;
