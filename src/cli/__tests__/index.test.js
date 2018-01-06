'use strict';

const mockPrompt = jest.fn();
const mockInquirer = {
    prompt: mockPrompt,
    Separator: jest.fn()
};
jest.mock('inquirer', () => mockInquirer);

const Cli = require('../index');

describe('Cli', () => {
    describe('selectService', () => {
        const cli = new Cli();

        it('should ask to choose service', () => {
            mockPrompt.mockReturnValueOnce(Promise.resolve({ service: 'foo' }));

            expect(cli.selectService({ service: 'foo' }))
                .resolves.toBe('foo')
                .then(() => {
                    expect(mockPrompt).toBeCalledWith(
                        expect.arrayContaining([
                            expect.objectContaining({
                                type: 'list',
                                name: 'service',
                                message: 'Select service',
                                choices: expect.any(Array)
                            })
                        ])
                    );
                });
        });
    });
});
