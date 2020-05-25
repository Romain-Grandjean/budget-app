// MODULE BUDGET CONTROLLER

var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
        this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
        this.percentage = -1;
        }
    },

    Expense.prototype.getPercentages = function() {
        return this.percentage;
    }

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

        deleteItem: function(type, id) {
            var ids, index;

           ids = data.allItems[type].map(function(cur) {
            return cur.id;
           });
           index = ids.indexOf(id);

           if (index !== -1) {
               data.allItems[type].splice(index, 1);
           }
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

        calculatePercentages: function() {

            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });

        },

        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentages();
            });
            return allPerc;
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    var formatNumber = function(num, type) {
        var numSplit, int, dec;

        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split(".");

        int = numSplit[0];

        if (int.length > 3) {
            int = int.substr(0, int.length -3) + ',' + int.substr(int.length - 3, 3);
        };

        dec = numSplit[1];
    
        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

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
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            // Insert the html
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorID) {

            var el =  document.getElementById(selectorID);
            el.parentNode.removeChild(el);
    
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

        displayBudget: function(obj) {
            var type;
            obj.budget > 0 ? type = "inc" : type = "exp";
            document.querySelector(domStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(domStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(domStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

            if (obj.percentage > 0) {
                document.querySelector(domStrings.percentageLabel).textContent = obj.percentage;
            } else {
                document.querySelector(domStrings.percentageLabel).textContent = "-";               
            }
        },

        displayPercentages: function(percentages) {

           var fields = document.querySelectorAll(domStrings.expensesPercLabel);

            nodeListForEach(fields, function(cur, index) {
                if (percentages[index] > 0) {
                    cur.textContent = percentages[index] + '%';
                } else {
                    cur.textContent = "-";
                }
            });
        },

        displayMonth: function() {
            var now, year, month, months;

            now = new Date();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(domStrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        changedType: function() {
            var fields = document.querySelectorAll(
                domStrings.inputType + ',' +
                domStrings.inputDescription + ',' +
                domStrings.inputValue);
            
            nodeListForEach(fields, function(cur){
                cur.classList.toggle('red-focus');
            });
            document.querySelector(domStrings.inputBtn).classList.toggle('red');
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
            document.querySelector(dom.container).addEventListener('click', ctrlDeleteItem);
            document.querySelector(dom.inputType).addEventListener('change', uiCrtl.changedType);
    };

    var updateBudget = function() {

        // 1. Calculate the budget
        budgetCtrl.calculateBudget();
        // 2. Return the budget
        var budget = budgetCtrl.getBudget();
        // 3. Display the budget on UI
        uiCrtl.displayBudget(budget);
    }

    var updatePercentages = function(){

        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();
        // 2. Read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();
        // 3. Update UI
        uiCrtl.displayPercentages(percentages);
    };



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
        // 6. Calculate & update percentages
        updatePercentages();
    };

    var ctrlDeleteItem = function(e) {
        var itemId, splitId, type, id;
        itemId = e.target.parentNode.parentNode.parentNode.parentNode.id;
       
        if(itemId) {        
            splitId = itemId.split('-');
            type = splitId[0];
            id = parseInt(splitId[1]);

            // 1. Delete item from the datastructure
            budgetCtrl.deleteItem(type, id);
            // 2. Delete the item from the UI
            uiCrtl.deleteListItem(itemId);
            // 3. Update and show the budget
            updateBudget();
            // 4. Calculate & update percentages
            updatePercentages();
        }
    };

    return {
        init: function() {
            uiCrtl.displayMonth();
            uiCrtl.displayBudget({               
                    budget: 0,
                    totalInc: 0,
                    totalExp: 0,
                    percentage: -1
            });
            setUpEventListeners();
        }
    };

})(budgetController, uiController);


controller.init();