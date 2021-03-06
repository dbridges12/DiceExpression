/**
 * @requires random-js
 */
var Random = require("random-js"),
    random = new Random(Random.engines.mt19937().autoSeed());

/**
 * @function parseTheString
 * @desc Initially parses the diceExpression string during object creation. Creates an array of each value in the expression.
 * @param {String} str the full DiceExpression as passed into the object
 * @return {Array} An array of each term in the expression ['4','d','3','+','4']
 */
function parseTheString(str) {
    'use strict';

    if (str === undefined || str === null) {
        throw new SyntaxError('Dice Expression is ' + str + '.');
    }

    if (str.length === 0) {
        throw new SyntaxError('Dice Expression is empty. You must pass a valid Dice Expression string');
    }

    // remove all whitespace in the expression //
    var newStr = str.replace(/\s+/g, '');
    //console.log('newStr: ' + newStr);

    // split the expression on + and - //
    return newStr.split(/(\+|\-)/);
}

/**
 * @function evalDiceExpression
 * @desc Parse the expression and roll the dice
 * @param {String} str - a term from the diceExpression i.e 4d20
 * @param {String} rollType - min|max - if this is being called from the min or max methods - empty defaults to normal roll
 * @return {Object} - Object consisting of numDice, numSides, result of each roll array and total
 */
function evalDiceExpression(str, rollType) {
    'use strict';
    if (str.search(/d/i) === -1) {
        throw new SyntaxError('Invalid Dice Expression - ' + str);  // if there isn't a d, then its invalid
    }

    // use regex to read the dice expresssion and convert to an array //
    var regex = /^([1-9][0-9]*)?(d)(([1-9][0-9]*)|\%)/i,
        diceExp = str.match(regex);

    // trap for no sides passed in expression //
    if (diceExp===null) {
        throw new SyntaxError('Invalid Dice Expression - dice expression n(d|D)S must contain number of sides - ' + str);
    }

    var numDice = diceExp[1]===undefined?1:diceExp[1],  // number of dice at position 1 (before the d) - if empty default to 1
        numSides = diceExp[3], // number of roles at position 3 (after the d)
        eachRoll = 0,
        rollsArray = [],
        finalVal = 0,
        finalObj = {};

    // exception handling //
    if (numSides === '%') {
        numSides = 100;
    }


    // roll each of the dice and update total value //
    for (var i = 0; i < numDice; i++) {
        if (rollType === 'min') {
            eachRoll = 1;
        } else if (rollType === 'max') {
            eachRoll = Number(numSides);
        } else {
            eachRoll = random.integer(1, numSides);
        }
        rollsArray.push(eachRoll);
        finalVal += eachRoll;
    }

    // populate object with each field //
    finalObj.numDice = numDice;
    finalObj.numSides = numSides;
    finalObj.rolls = rollsArray;
    finalObj.total = finalVal;

    //console.log(finalObj);

    return finalObj;
}

/**
 * @function DiceExpression
 * @desc Creates the new DiceExpression object
 * @param {String} expression - full diceExpression string
 */
function DiceExpression(expression) {
    'use strict';
    this.diceExpArray = parseTheString(expression);  // parse and clean the expression //
}

/**
 * @function roll
 * @desc walks through the DiceExpression array and evaluates each item
 * @param {String} type - max | min | detail - used to interact with other methods and return correct data type
 * @return {Array | String} Value or detail of the roll
 */
DiceExpression.prototype.roll = function (type) {
    'use strict';
    var itemVal = '',
        diceValue = 0,
        total = 0,
        nextItem,
        exp = this.diceExpArray,
        detailArray = [],
        rollType = type || 'none';  // type can be max or min or detail

    for (var i = 0; i < exp.length; i++) {
        itemVal = exp[i];
        // if the item contains a d, then its a dice expression //
        if (itemVal.search(/[a-z]/i) > -1) {
            diceValue = evalDiceExpression(itemVal,rollType);
            total += diceValue.total;
            detailArray.push(diceValue);
            continue;
        }

        // see if its just a number and add it to the total
        if (Number.isInteger(Number(itemVal))) {
            total += parseInt(itemVal);
            continue;
        }

        // if we find an operator, step to the next item and evaluate it //
        if (itemVal === '+' || itemVal === '-') {
            // set multiplier to 1 or -1 depending on sign to handle subtraction or addition of the value //
            var multiplier = itemVal === '+'?1:-1;

            // use the next item after the operator //
            i++;
            nextItem = exp[i];

            // if the item contains a d, then its a dice expression //
            if (nextItem.search(/d/i) > -1) {
                diceValue = evalDiceExpression(nextItem, rollType);
                total += diceValue.total * multiplier;
                detailArray.push(diceValue);
            } else if (Number.isInteger(Number(nextItem)) && nextItem !== '') {
                total += parseInt(nextItem) * multiplier;
            } else {
                throw new SyntaxError('Invalid Dice Expression: ' + nextItem);
            }
        }
    }

    detailArray.push({totalValue:total});

    // return the full detail array if called by the detail function, otherwise just the total //
    return type === 'detail'?detailArray:total;
};


/**
 * @function min
 * @desc calls the roll function and passes min parameter
 * @return {String} returns a value based on the minimum roll (1) for each die
 *
 */
DiceExpression.prototype.min = function () {
    'use strict';
    return this.roll('min');
};

/**
 * @function max
 * @desc calls the roll function and passes max parameter
 * @return {String} returns a value based on the maximum roll (num sides) for each die
 *
 */
DiceExpression.prototype.max = function () {
    'use strict';
    return this.roll('max');
};

/**
 * @function detail
 * @desc calls the roll function and passes detail parameter
 * @return {Object} containing detail roll information for each individual die plus total value
 */
DiceExpression.prototype.detail = function () {
    'use strict';
    return this.roll('detail');
};

module.exports = DiceExpression;