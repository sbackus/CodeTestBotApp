import { cumulativeMovingAverage } from 'code-test-bot-app/utils/math';

describe('Math Utils', function() {
    describe('cumulativeMovingAverage', function() {
        it('calculates a new average for an added item', function() {
            // avg([2,2]) == 2; avg([2,2,5]) == 3;
            expect(cumulativeMovingAverage(2, 5, 2)).to.equal(3);
        });

        it('calculates a new average for a removed item', function() {
            expect(cumulativeMovingAverage(3, 5, 3, true)).to.equal(2);
        });
    });
});
