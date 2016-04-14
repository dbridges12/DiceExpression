/**
 * Created by davidbridges on 4/13/16.
 */

var DiceExpression = require('../src/dice-expression.js');

describe('DiceExpression Errors', function() {
    'use strict';

    it(" object should throw a SyntaxError for hrn7fh rhfn7f ff: ", function () {
        var result,
            errVal = function() {
                result = new DiceExpression('hrn7fh rhfn7f ff');
                result.roll();
            };
        expect(errVal).toThrowError(SyntaxError);
    });

    it(" object should throw a SyntaxError for 12f4 + 6 + 4d9: ", function () {
        var result,
            errVal = function() {
                result = new DiceExpression('12f4 + 6 + 4d9');
                result.roll();
            };
        expect(errVal).toThrowError(SyntaxError);
    });

    it(" object should throw a SyntaxError for empty expression: ", function () {
        var result,
            errVal = function() {
                result = new DiceExpression();
            };
        expect(errVal).toThrowError(SyntaxError);
    });

    it(" roll() method should throw a SyntaxError for 3 + 4d7 -  + 6 ", function () {
        var result,
            errVal = function() {
                result = new DiceExpression('3 + 4d7 -  + 6');
                result.roll();
            };
        expect(errVal).toThrowError(SyntaxError);
    });
});

describe('DiceExpression Methods', function() {
    'use strict';

    it(" roll() method should be less than 600 for 6d%: ", function () {
        var minVal = new DiceExpression('6d%');
        expect(minVal.roll()).toBeLessThan(600);
    });

    it(" roll() method should be 27 for 12 + 15: ", function () {
        var minVal = new DiceExpression('12 + 15');
        expect(minVal.roll()).toEqual(27);
    });


    it(" min() method should return 12 for 12d6: ", function () {
        var minVal = new DiceExpression('12d6');
        expect(minVal.min()).toEqual(12);
    });

    it(" max() method should return 48 for 12d4: ", function () {
        var maxVal = new DiceExpression('12d4');
        expect(maxVal.max()).toEqual(48);
    });

    it(" detail() method result array totalValue to be greater than 8 for 3 + 4d7 - 5 + 6 ", function () {

        var result = new DiceExpression('3 + 4d7 - 5 + 6');
        result = result.detail();

        expect(result[1].totalValue).toBeGreaterThan(8);
    });

});