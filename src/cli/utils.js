'use strict';

const { Separator } = require('inquirer');
const Path = require('path');
const findIndex = require('lodash/findIndex');
const isObject = require('lodash/isObject');
const sortBy = require('lodash/sortBy');

const getChoicesFromServices = services => {
    let choices = [];

    const getChoices = (basePath, hash) => {
        if (isObject(hash)) {
            Object.keys(hash).forEach(key => {
                const path = Path.join(basePath, key);
                const isService = key === '.' || typeof hash[key] !== 'object';
                choices.push({
                    // prettier-ignore
                    name: `${isService ? '(service)  ' : '(folder)   '} ${path}`,
                    value: path,
                    isService
                });

                getChoices(path, hash[key]);
            });
        }
    };
    getChoices('', services);

    choices = sortBy(choices, choice => choice.isService);
    const firstFolderIndex = findIndex(choices, choice => choice.isService);

    return [
        new Separator(),
        ...choices.slice(0, firstFolderIndex),
        new Separator(),
        ...choices.slice(firstFolderIndex),
        new Separator()
    ];
};

module.exports = { getChoicesFromServices };
