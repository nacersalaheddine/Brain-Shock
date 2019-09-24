var operationData = {
    add: {
        precedence: 1,
        name: 'add',
        operation: function(a, b) { return a + b; },
        output: function(a, b) { return a + ' + ' + b; },
        buttonHTML: '+'
    },
    subtract: {
        precedence: 1,
        name: 'subtract',
        operation: function(a, b) { return a - b; },
        output: function(a, b) { return a + ' - ' + b; },
        buttonHTML: '-'
    },
    multiply: {
        precedence: 2,
        name: 'multiply',
        operation: function(a, b) { return a * b; },
        output: function(a, b) { return a + ' * ' + b; },
        buttonHTML: '*'
    },
    divide: {
        precedence: 2,
        name: 'divide',
        operation: function(a, b) { return a / b; },
        isInvalidInput: function(a, b) { return b == 0 ? 'division by 0' : false; },
        output: function(a, b) { return a + ' / ' + b; },
        buttonHTML: '/'
    },
    epow: {
        precedence: 3,
        singleInput: true,
        name: 'epow',
        operation: function(a) { return Math.pow(Math.E, a); },
        output: function(a, b) { return 'epow(' + a + ')'; },
        buttonHTML: 'e<sup>x</sup>'
    },
    ln: {
        precedence: 3,
        singleInput: true,
        name: 'ln',
        operation: function(a) { return Math.log(a); },
        isInvalidInput: function(a) { return a <= 0 ? 'ln of non-positive number' : false; },
        output: function(a, b) { return 'ln(' + a + ')'; },
        buttonHTML: 'ln'
    },
    square: {
        precedence: 3,
        singleInput: true,
        name: 'square',
        operation: function(a) { return Math.pow(a, 2); },
        output: function(a) { return 'sqr(' + a + ')'; },
        buttonHTML: 'x<sup>2</sup>'
    },
    squareRoot: {
        precedence: 3,
        singleInput: true,
        name: 'squareRoot',
        operation: function(a) { return Math.sqrt(a); },
        isInvalidInput: function(a) { return a < 0 ? 'complex number' : false; },
        output: function(a) { return 'sqrt(' + a + ')'; },
        buttonHTML: '&#8730;'
    },
    power: {
        precedence: 3,
        name: 'power',
        operation: function(a, b) { return Math.pow(a, b); },
        isInvalidInput: function(a, b) { return isNaN(Math.pow(a, b)) ? 'complex number' : false; },
        output: function(a, b) { return a + ' ^ ' + b; },
        buttonHTML: 'x<sup>y</sup>'
    },
    yroot: {
        precedence: 3,
        name: 'yroot',
        operation: function(a, b) { return Math.pow(a, b == 0 ? 0 : 1 / b); },
        isInvalidInput: function(a, b) {
            return isNaN(Math.pow(a, a, b == 0 ? 0 : 1 / b)) ? 'complex number' : false;
        },
        output: function(a, b) { return a + ' yroot ' + b; },
        buttonHTML: '<sup>y</sup>&#8730;'
    },
    modulo: {
        precedence: 2,
        name: 'modulo',
        operation: function(a, b) { return a % b; },
        output: function(a, b) { return a + ' % ' + b; },
        buttonHTML: 'Mod'
    },
    negate: {
        precedence: 3,
        singleInput: true,
        name: 'negate',
        operation: function(a) { return -a; },
        output: function(a) { return 'negate(' + a + ')'; },
        buttonHTML: '&#177;'
    },
    reciproc: {
        precedence: 3,
        singleInput: true,
        name: 'reciproc',
        operation: function(a) { return 1 / a; },
        isInvalidInput: function(a) { return a == 0 ? 'division by 0' : false; },
        output: function(a) { return 'reciproc(' + a + ')'; },
        buttonHTML: '1/x'
    },
    context: {
        precedence: 4,
        singleInput: true,
        name: 'context',
        operation: function(a) { return a; },
        output: function(a) { return '(' + a + ')'; }
    }
};

var Operation = function(options) {

    var inputs = [];

    for (var key in options) {
        this[key] = options[key];
    };

    this.addInput = function(input) {
        if (this.isSaturated()) return this;
        inputs.push(input);
        return this;
    };

    this.isInvalidInput = this.isInvalidInput || function() { return false; };

    this.isSaturated = function() {
        var inputCount = this.singleInput ? 1 : 2;
        for (var i = 0; i < inputCount; ++i) {
            if (inputs[i] == null || isNaN(inputs[i])) return false;
        }
        return true;
    };

    this.execute = function() {
        if (this.error) return this;
        if (!this.isSaturated() || this.value != null) return this;
        var inputValues = inputs.map(function(input) { return Number(input); });
        this.error = this.isInvalidInput.apply(this, inputValues);
        if (this.error) {
            throw new Error(this.error);
        }
        this.calculationString = this.getCalculationString();
        this.value = this.operation.apply(this, inputValues);
        return this;
    };

    this.getCalculationString = function(lastInput, collapsed) {
        if (collapsed) {
            this.execute();
            if (this.value != null) return this.value.toString();
        }
        var singleInput = this.singleInput;
        var inputValues = inputs.map(function(input) {
            var inputValue = input.getCalculationString ?
                input.getCalculationString(lastInput, collapsed) :
                input.toString();
            return singleInput ? inputValue.replace(/^\((.*)\)$/g, '$1') : inputValue;
        });
        return options.output.apply(this, inputValues.concat([lastInput]));
    };

    this.valueOf = function() {
        if (this.value == null) {
            this.execute();
        }
        return this.value;
    };

    this.toString = function() {
        if (this.calculationString == null) {
            this.execute();
        }
        return this.getCalculationString();
    };
};

var InputStack = (function() {

    var levels, closedContext, partialResult, error;

    var Stack = function() {
        this.peek = function() { return this[this.length - 1]; };
    };
    Stack.prototype = [];

    var reset = function() {
        levels = new Stack;
        levels.push(new Stack);
        closedContext = error = null;
    };

    var wrapLastOperation = function(operation) {
        var stack = levels.peek();
        stack.push(operation.addInput(stack.pop()));
        collapse(operation.precedence);
    };

    var collapse = function(precedence) {
        var stack = levels.peek();
        var currentOperation = stack.pop();
        var previousOperation = stack.peek();

        if (!currentOperation) return;

        if (!currentOperation.isSaturated()) {
            stack.push(currentOperation);
            return;
        }

        try {
            partialResult = Number(currentOperation);
        } catch (e) {
            partialResult = error = 'Error: ' + e.message;
        }

        if (previousOperation && previousOperation.precedence >= precedence) {
            previousOperation.addInput(currentOperation);
            collapse(precedence);
        } else {
            stack.push(currentOperation);
        }
    };

    reset();

    return {
        push: function(number, operation) {
            error && reset();
            var stack = levels.peek();
            var lastOperation = stack.peek();
            var input = closedContext || number;
            closedContext = null;
            partialResult = Number(input);
            if (!lastOperation || operation.precedence > lastOperation.precedence) {
                stack.push(operation.addInput(input));
                collapse(operation.precedence);
            } else {
                lastOperation.addInput(input);
                collapse(operation.precedence);
                wrapLastOperation(operation);
            }
            return this;
        },
        openContext: function() {
            error && reset();
            var lastOperation = levels.peek().peek();
            if (closedContext || lastOperation && lastOperation.isSaturated()) return;
            levels.push(new Stack);
            return this;
        },
        closeContext: function(number) {
            error && reset();
            if (levels.length <= 1) return;
            var input = closedContext || number;
            var stack = levels.peek();
            var lastOperation = stack.peek();
            closedContext = new Operation(operationData.context).addInput(
                lastOperation ? (function() {
                    lastOperation.addInput(input);
                    collapse(0);
                    return stack.pop();
                }()) : input
            );
            partialResult = Number(closedContext);
            levels.pop();
            return this;
        },
        evaluate: function(number) {
            error && reset();
            var input = closedContext || number;
            partialResult = Number(input);
            while (levels.length > 1) {
                this.closeContext(input);
            }
            var lastOperation = levels.peek().peek();
            lastOperation && lastOperation.addInput(input);
            collapse(0);
            reset();
            return this;
        },
        getPartialResult: function() {
            var _partialResult = partialResult;
            partialResult = 0;
            return _partialResult;
        },
        getCalculationString: function(collapsed) {
            var result = closedContext ? closedContext.getCalculationString('', collapsed) : '';
            for (var j = levels.length - 1; j >= 0; --j) {
                for (var i = levels[j].length - 1; i >= 0; --i) {
                    result = levels[j][i].getCalculationString(result, collapsed);
                }
                if (j > 0) {
                    result = '(' + result;
                }
            }
            return result;
        }
    };

}());