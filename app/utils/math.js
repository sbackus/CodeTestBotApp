
function cumulativeMovingAverage(accumulatedValue, value, count, removing) {
    var multiple = removing ? -1 : 1;
    return ((multiple * value) + count * accumulatedValue) / (count + multiple);
}

function roundToNearestHalf(value) {
    return Math.round(value * 2) / 2;
}

export { cumulativeMovingAverage, roundToNearestHalf };
export default { cumulativeMovingAverage: cumulativeMovingAverage, roundToNearestHalf: roundToNearestHalf };
