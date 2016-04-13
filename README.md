# DiceExpression

## A DiceExpression is defined as follows:

* DiceExpression => Integer
* DiceExpression => x?(d|D)y where x is the # of dice and y the sides.
* DiceExpression => x?(d|D)% where x is the # of dice and '%' = 100
* DiceExpression => DiceExpression +/- DiceExpression

We would like you to write a javascript module to be used with node.js to evaluate various dice expressions. 

### Here are the requirements:

The module should export a DiceExpression constructor with the following signature:

```javascript
function DiceExpression (exp:String):DiceExpression

### Features

You may define the DiceExpression api any way you like but it should support the following features:

* create a new DiceExpression from a give dice expression string, e.g., '2d10 + d6 - 7 + 2'
* evaluate the DiceExpression as many times as we want, i.e. get a total (from a new sequence of rolls) each time.
* bonus: evaluate the DiceExpression in terms of it's maximal possible roll
* bonus: evaluate the DiceExpression in terms of it's minimal possible roll
* bonus: evaluate the DiceExpression as an array of individual rolls, e.g., [8, 3, -7, 2] (from above)

## Additional Requirements

* Please use the npmjs node module random-js as the random number engine within your code. This should be your module's only dependency. 
* You may have any devDependencies you require -- tools that are part of your project but are not directly called by your source code.
* House your code within a public github with a name of your choosing. A github.com account is free if you don't already have one.