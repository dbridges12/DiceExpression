/**
 * Created by davidbridges on 4/12/16.
 */
var Random = require("random-js"),
    random = new Random(Random.engines.mt19937().autoSeed());

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

function evalDiceExpression(str, rollType) {
    'use strict';
    if (str.search(/d/i) === -1) {
        throw new SyntaxError('Invalid Dice Expression - ' + str);
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

// pass a type for min or max evaluation //
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

function DiceExpression(expression) {
    'use strict';
    this.diceExpArray = parseTheString(expression);  // parse and clean the expression //
}

// add a min function to the DiceExpression prototype object //
DiceExpression.prototype.min = function () {
    'use strict';
    return this.roll('min');
};

// add a max function to the DiceExpression prototype object //
DiceExpression.prototype.max = function () {
    'use strict';
    return this.roll('max');
};

// add a detail function to show each actual roll value //
DiceExpression.prototype.detail = function () {
    'use strict';
    return this.roll('detail');
};

module.exports = DiceExpression;