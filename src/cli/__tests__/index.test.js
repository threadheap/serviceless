'use strict';

const mockPrompt = jest.fn();
const mockInquirer = {
    prompt: mockPrompt
};
jest.mock('inquirer', () => mockInquirer);

const Cli = require('../index');

describe('Cli', () => {
    describe('selectService', () => {
        const cli = new Cli();

        it('should ask to choose service', () => {
            mockPrompt.mockReturnValueOnce(Promise.resolve({ path: 'foo' }));

            expect(cli.selectService({ foo: true })).resolves.toBe('foo');
            expect(mockPrompt).toBeCalledWith(
                expect.arrayContaining([
                    expect.objectContaining({
                        type: 'checkbox',
                        name: 'services',
                        message: 'Select service',
                        choices: expect.any(Array)
                    })
                ])
            );
        });
    });
});
