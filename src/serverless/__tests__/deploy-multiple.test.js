'use strict';

const mockWrapChildProcess = jest.fn();
const mockSls = jest.fn();

jest.mock('../../utils/wrap-child-process', () => mockWrapChildProcess);
jest.mock('../command', () => mockSls);

const deployMultiple = require('../deploy-multiple');

describe('serverless deploy multiple', () => {
    beforeEach(() => {
        mockWrapChildProcess.mockImplementation(child => child);
        mockSls.mockImplementation(() => ({
            deploy: () => new Promise(resolve => resolve)
        }));
    });

    afterEach(() => {
        mockWrapChildProcess.mockReset();
        mockSls.mockReset();
    });

    describe('deploy in parallel', () => {
        it('should deploy empty list', () => {
            expect(deployMultiple([], '', {})).resolves.toBeDefined();
        });

        it('should deploy list of services', () => {
            expect(
                deployMultiple(['foo', 'bar', 'baz'], '', {})
            ).resolves.toBeDefined();

            expect(mockWrapChildProcess).toBeCalled;
        });
    });

    describe('deploy in band', () => {
        it('should deploy empty list', () => {
            expect(
                deployMultiple([], '', { runInBand: true })
            ).resolves.toBeDefined();
        });

        it('should deploy list of services', () => {
            expect(
                deployMultiple(['foo', 'bar', 'baz'], '', { runInBand: true })
            ).resolves.toBeDefined();
        });
    });
});
