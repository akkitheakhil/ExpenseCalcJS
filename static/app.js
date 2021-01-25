// DOM Selectors
const balanceText = document.querySelector('.balance-text');
const incomeAmount = document.querySelector('.income-amount');
const expenseAmount = document.querySelector('.expense-amount');
const listAmtText = document.querySelector('.amt-text');
const listEditBtn = document.querySelector('.edit-btn');
const listTrashBtn = document.querySelector('.trash-btn');
const incomeTab = document.querySelector("#income-tab");
const expenseTab = document.querySelector("#expense-tab");
const allTab = document.querySelector("#all-tab");
const inputTitle = document.querySelector('#input-name');
const inputAmt = document.querySelector('#input-amount');
const addBtn = document.querySelector('#add-btn');
const listsElement = document.querySelector(".lists");
const bottomBar = document.querySelector(".bottom-bar");


let expenseArr = [];
let incomeArr = [];
let allArr = [];
let currentTab = 'income'

incomeAmount.innerText = 0;
expenseAmount.innerText = 0;
balanceText.innerText = 0;

//Event Listeners
document.addEventListener("DOMContentLoaded", getItemFromLocalStorage);
addBtn.addEventListener("click", addNewItem);
incomeTab.addEventListener("click", changeTab);
expenseTab.addEventListener("click", changeTab);
allTab.addEventListener("click", changeTab);
listsElement.addEventListener("click", removeItem);
listsElement.addEventListener("click", editItem);


function addItem(amount, title, type = null) {
    if (amount !== null && title !== null) {
        const newItem = document.createElement("li");
        newItem.classList.add("list");
        const newTextSpan = document.createElement("span");
        newTextSpan.classList.add("amt-text");
        newTextSpan.innerHTML = `${title} : $${amount}`;
        newItem.appendChild(newTextSpan);

        if (currentTab === 'income' || currentTab === 'expense') {
            const editButton = document.createElement("button");
            editButton.innerHTML = `<i class="fas fa-edit"></i>`;
            editButton.classList.add("edit-btn")
            newItem.appendChild(editButton);

            const trashButton = document.createElement("button");
            trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
            trashButton.classList.add("trash-btn")
            newItem.appendChild(trashButton);
        }

        if(type === 'expense' || currentTab === 'expense') {
            newItem.classList.add("expense");
        }

        listsElement.appendChild(newItem);
        inputTitle.value = "";
        inputAmt.value = "";
    }
}


function addNewItem(e) {
    e.preventDefault();
    if (currentTab === 'income') {
        const amount = Number(inputAmt.value);
        const title = inputTitle.value;
        incomeArr.push({ amount, title });
        addItem(amount, title);

    } else if (currentTab === 'expense') {
        const amount = Number(inputAmt.value);
        const title = inputTitle.value;

        expenseArr.push({ amount, title });
        addItem(amount, title);
    }

    calculations();
    updateLocalStorage();
}

function changeTab(e) {
    e.preventDefault();
    currentTab = e.target.innerHTML.toLowerCase();

    if (currentTab === 'all') {
        bottomBar.classList.add("hide");
        bottomBar.classList.remove("show");
        incomeTab.classList.remove("active");
        expenseTab.classList.remove("active");
        allTab.classList.add("active");
    } else if (currentTab === 'income') {
        bottomBar.classList.remove("hide");
        bottomBar.classList.add("show");
        incomeTab.classList.add("active");
        expenseTab.classList.remove("active");
        allTab.classList.remove("active");
    } else if (currentTab === 'expense') {
        bottomBar.classList.remove("hide");
        bottomBar.classList.add("show");
        incomeTab.classList.remove("active");
        expenseTab.classList.add("active");
        allTab.classList.remove("active");
    }

    changeView();

}

function changeView() {
    console.log('Change Tab')
    listsElement.innerHTML = "";
    if (currentTab === "income") {
        incomeArr.forEach(item => {
            addItem(item.amount, item.title, 'income');
        });
    } else if (currentTab === "expense") {
        expenseArr.forEach(item => {
            addItem(item.amount, item.title, 'expense');
        });
    } else {
        allArr = [];
        incomeArr.forEach(item => {
            addItem(item.amount, item.title, 'income');
        });
        expenseArr.forEach(item => {
            addItem(item.amount, item.title, 'expense');
        });
    }
}

function removeItem(e) {
    e.preventDefault();
    const item = e.target;
    if (item.classList[0] === 'trash-btn') {
        console.log('trash-btn')
        const listItemElem = item.parentElement;
        const itemToRemove = listItemElem.children[0].innerText;
        listItemElem.classList.add("fall")
        if (currentTab === 'income') {
            let elementIndex = incomeArr.findIndex(item => itemToRemove === `${item.title} : $${item.amount}`);
            incomeArr.splice(incomeArr.indexOf(elementIndex), 1);
        } else if (currentTab === 'expense') {
            let elementIndex = expenseArr.findIndex(item => itemToRemove === `${item.title} : $${item.amount}`);
            expenseArr.splice(incomeArr.indexOf(elementIndex), 1);
        }
        listItemElem.remove();
        updateLocalStorage();
        calculations();
    }
  
}

function editItem(e) {
    e.preventDefault();
    const item = e.target;
    if (item.classList[0] === 'edit-btn') {
        const listItemElem = item.parentElement;
        const itemToRemove = listItemElem.children[0].innerText;

        if (currentTab === 'income') {
            let elementIndex = incomeArr.findIndex(item => itemToRemove === `${item.title} : $${item.amount}`);

            inputAmt.value = incomeArr[elementIndex].amount;
            inputTitle.value = incomeArr[elementIndex].title;

            incomeArr.splice(incomeArr.indexOf(elementIndex), 1);

        } else if (currentTab === 'expense') {
            let elementIndex = expenseArr.findIndex(item => itemToRemove === `${item.title} : $${item.amount}`);

            inputAmt.value = expenseArr[elementIndex].amount;
            inputTitle.value = expenseArr[elementIndex].title;

            expenseArr.splice(incomeArr.indexOf(elementIndex), 1);
        }
        listItemElem.remove();
    }
}

function calculations() {
    let incomeCal = 0;
    let expenseCal = 0;

    if (incomeArr.length > 0) {
        incomeCal = incomeArr.map(item => item.amount).reduce((prev, next) => prev + next);
    }

    if (expenseArr.length > 0) {
        expenseCal = expenseArr.map(item => item.amount).reduce((prev, next) => prev + next);
    }

    incomeAmount.innerText ='$' +  incomeCal;
    expenseAmount.innerText ='$' +  expenseCal;
    balanceText.innerText ='$' + (incomeCal - expenseCal);

    console.log("calc", incomeCal - expenseCal);
}

function updateLocalStorage() {
    localStorage.setItem('income', JSON.stringify(incomeArr));
    localStorage.setItem('expense', JSON.stringify(expenseArr));
}

function getItemFromLocalStorage() {
    incomeArr = JSON.parse(localStorage.getItem("income")) || [];
    expenseArr = JSON.parse(localStorage.getItem("expense")) || [];
    changeView();
    calculations();
    console.log('User Lang', getLang());
    console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)
}

function getLang()
{
 if (navigator.languages != undefined) 
 return navigator.languages[0]; 
 else 
 return navigator.language;
}