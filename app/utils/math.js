
function cumulativeMovingAverage(accumulatedValue, value, count, removing) {
    var multiple = removing ? -1 : 1;
    return ((multiple * value) + count * accumulatedValue) / (count + multiple);
}

export { cumulativeMovingAverage };
export default { cumulativeMovingAverage: cumulativeMovingAverage };