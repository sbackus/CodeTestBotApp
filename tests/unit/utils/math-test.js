import { cumulativeMovingAverage, roundToNearestHalf } from 'code-test-bot-app/utils/math';

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

    describe('roundToNearestHalf', function() {
        it('does not change ints', function() {
            expect(roundToNearestHalf(1)).to.equal(1);
        });

        it('does not change numbers already at x.5', function() {
            expect(roundToNearestHalf(2.5)).to.equal(2.5);
        });

        it('rounds decimals to nearest half', function() {
            expect(roundToNearestHalf(2.1)).to.equal(2);
            expect(roundToNearestHalf(2.3)).to.equal(2.5);
            expect(roundToNearestHalf(2.6)).to.equal(2.5);
            expect(roundToNearestHalf(2.8)).to.equal(3);
        });
    });
});
