// MODULE BUDGET CONTROLLER

var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }

    return {
        addItem: function(type, des, val) {
            var newItem;

            // Create new ID
            if (data.allItems[type].length > 0) {
                id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                id = 0;
            }

          

            // Create new item on "inc" or "exp" type
            if (type === 'exp') {
                newItem = new Expense(id, des, val);
            } else if (type === 'inc') {
                newItem = new Income(id, des, val);
            }

            // Push it into data structure
            data.allItems[type].push(newItem);

            // Return the new element
            return newItem;
        },
        testing: function() {
            console.log(data);
        }
    }
})();




// MODULE UI CONTROLLER

var uiController = (function() {

    var domStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }

    return {
        getInput: function() {
            return {
                type: document.querySelector(domStrings.inputType).value,
                description: document.querySelector(domStrings.inputDescription).value,
                value: document.querySelector(domStrings.inputValue).value
            };
        },
        getDomStrings: function() {
            return domStrings;
        }
    };

})();


// MODULE APP CONTROLLER

var controller = (function(budgetCtrl, uiCrtl) {
    
    var setUpEventListeners = function() {
        var dom = uiController.getDomStrings();

        document.querySelector(dom.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(e) {        
                if (e.keyCode === 13 || e.which === 13) {      
                    ctrlAddItem();
                }
            });
    };


    var ctrlAddItem = function() {
        var input; newItem;

        // 1. Get the field input data
        var input = uiCrtl.getInput();
        // 2. Add the item to the budget Controller
        var newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    };

    return {
        init: function() {
            console.log('application launched');
            setUpEventListeners();
        }
    };

})(budgetController, uiController);


controller.init();