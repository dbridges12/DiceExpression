# DiceExpression

## A DiceExpression specifies a return value based on simulated dice rolls +/- and constants:

* DiceExpression => Integer  ( 6 + 7 - 3)
* DiceExpression => x?(d|D)y where x is the # of dice and y the sides - '4d6' is 4 6-sided dice
* DiceExpression => x?(d|D)% where x is the # of dice and '%' = 100 sides - '2d%' is 2 100-sided dice
* DiceExpression => DiceExpression +/- DiceExpression +/- Integer - (3d8 + 3 + 12d6) you can mix and match

### The API
* The included app.js file shows how to include the module and call the functions
```js
var DiceExpression = require('./src/dice-expression');
```
* create a new DiceExpression object from a given dice expression string
```js
var d20 = new DiceExpression('9d6 + 4 - 4d7');
```

* evaluate the DiceExpression as many times as we want using the roll method.
```js
console.log('d20 normal roll: ',d20.roll());
// d20 normal roll: 29
```

* evaluate the DiceExpression in terms of it's minimum possible dice roll - each die rolls a 1
```js
console.log('d20 min() roll: ',d20.min());
// d20 min() roll: 9
```

* evaluate the DiceExpression in terms of it's maximum possible roll dice roll - each die rolls its highest number
```js
console.log('d20 max() roll: ',d20.max());
// d20 max() roll: 30
```

* evaluate the DiceExpression as an array of individual rolls - show each dice grouping and its results. This returns an array with each grouping roll list, total value for that grouping and the total value for the expression
```js
console.log('d20 detail roll: ',d20.detail());
// d20 detail roll:  [ { numDice: '9',
      numSides: '6',
      rolls: [ 6, 1, 6, 6, 2, 5, 1, 3, 2 ],
      total: 32 },
    { numDice: '4', numSides: '7', rolls: [ 7, 2, 4, 5 ], total: 18 },
    { totalValue: 18 } ]
```

