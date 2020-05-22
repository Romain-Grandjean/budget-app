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

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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

        calculateBudget: function() {

            // Calculate total income & expenses

            calculateTotal('exp');
            calculateTotal('inc');

            // Calculate the budget 

            data.budget = data.totals.inc - data.totals.exp;

            // Calculate the percentage of income
            if (data.totals.inc > 0) {
            data.percentage = Math.round((data.totals.exp /data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },        

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
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
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    }

    return {
        getInput: function() {
            return {
                type: document.querySelector(domStrings.inputType).value,
                description: document.querySelector(domStrings.inputDescription).value,
                value: parseFloat(document.querySelector(domStrings.inputValue).value)
            };
        },

        addListItem: function(obj, type) {
            var html, newHtml, element;

            // Create html string with placeholders
            if (type === 'inc') {
                element = domStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = domStrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            // Replace the placeholders with data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            // Insert the html
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll(domStrings.inputDescription + ', ' + domStrings.inputValue);
            
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
            fieldsArr[0].focus();
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

    var updateBudget = function() {

        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on UI
        console.log(budget);
    }

    var ctrlAddItem = function() {
        var input; newItem;

       // 1. Get the field input data
       var input = uiCrtl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
 
        // 2. Add the item to the budget Controller
        var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        // 3. Add the item
        uiController.addListItem(newItem, input.type);
        // 4. Clear the fields
        uiController.clearFields();
        // 5. Calculate & update budget
        updateBudget();
        }
    };

    return {
        init: function() {
            console.log('application launched');
            setUpEventListeners();
        }
    };

})(budgetController, uiController);


controller.init();