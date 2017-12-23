'use strict';

const getArgv = (rawArgs, options) => {
    const argv = [];

    const optionsHash = {};
    options.forEach(option => {
        optionsHash[option.short] = option;
        optionsHash[option.long] = option;
    });

    let index = 0;
    while (index < rawArgs.length) {
        if (!(rawArgs[index] in optionsHash)) {
            argv.push(rawArgs[index]);
        }
        index += 1;
    }

    return argv.join(' ');
};

module.exports = getArgv;
