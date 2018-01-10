'use strict';

const createStatusStream = require('../status-stream');

describe('createStatusStream', () => {
    it('should not set output if it does not contain Serverless', () => {
        const task = {};
        const stream = createStatusStream(task);

        stream.write('data');
        expect(task.output).toBeUndefined();
    });

    it('should not set Serverless output', () => {
        const task = {};
        const stream = createStatusStream('path', 'green', task);

        stream.write('Serverless: data');
        expect(task.output).toContain('Serverless: data');
    });
});
