/**
 * Created by davidbridges on 4/12/16.
 */

var DiceExpression = require('./src/dice-expression');

var d20 = new DiceExpression('9d6 + 4 - 4d7');
var d22 = new DiceExpression('4d4 + 7 - 3 + 8d6');

console.log('1-Normal: ',d20.roll());
console.log('1-Min: ',d20.min());
console.log('1-Max: ',d20.max());
console.log('1-Detail: ',d20.detail());

/*
console.log('2-Normal: ',d22.roll());
console.log('2-Min: ',d22.min());
console.log('2-Max: ',d22.max());
console.log('2-Detail: ',d22.detail());

console.log('3-normal', new DiceExpression('20D5 - 2 - 2 - 2 - 2').min());
*/