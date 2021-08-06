
// defining global variables

let payBalance = 0;
let bankBalance = 0;
let loanAmount = 0;

let laptops = []
/* ================================= */
/*          RESTFUL API        */
/* ================================= */

/**This is fetching json object and  feeding it to array of laptops*/
fetch("https://noroff-komputer-store-api.herokuapp.com/computers")
    .then(response => response.json())
    .then(data => laptops = data)
    .then(laptops => dropOption(laptops))
    .catch((err) => {
        console.log(err)
    });
//Here using lambda function that is going to apply loptop options to every item in the collections
//foreach laptop we are adding it to the laptopOptions
const dropOption = (laptops) => {
    laptops.forEach(x => laptopDropOptions(x)); 
}

/**This will add on a laptop to drop option */
//appending and feeding in the newLaptopOption which we have created
const laptopDropOptions = (laptop) => {
    const laptopOptions = document.getElementById("chooseLaptop");
    const newLaptopOption = document.createElement("option");
    newLaptopOption.value = laptop.id;
    newLaptopOption.innerHTML = laptop.title;
    laptopOptions.appendChild(newLaptopOption); 
   
}

/**This will allow the user to seclect a laptop */

const chooseLaptop = () => {
    const selectLaptop = document.getElementById('chooseLaptop');
    let choosenLaptop = selectLaptop.value;
    displayLaptopInfo((choosenLaptop))
    displayInfoBox((choosenLaptop))

    
}


//This section is where the image, name, and description as well as the price of the laptop must be displayed. 

const displayLaptopInfo = (selectedLaptop) => {
    selectedLaptop = selectedLaptop - 1
    const laptopNameInCard = document.getElementById('laptop-title');
    const laptopFeaturesInCard = document.getElementById('laptop-features');
    const laptopPriceInCard = document.getElementById('laptop-price');
    const laptopImgInCard = document.getElementById('laptop-image');
    laptopNameInCard.innerHTML = laptops[selectedLaptop].title;
    laptopFeaturesInCard.innerHTML = laptops[selectedLaptop].description;
    laptopPriceInCard.innerHTML = laptops[selectedLaptop].price + " Kr"
    laptopImgInCard.src = "https://noroff-komputer-store-api.herokuapp.com/" + laptops[selectedLaptop].image;
    // onerror handler it get called when the images download is failed.
    laptopImgInCard.onerror = function () {
        // putting the placeholder image in error case
        laptopImgInCard.src = "./anonymous/placeholder.jpeg";
    }
}
// This section is to show the selected laptop Info feactures.

function displayInfoBox(selectedLaptop) {
    const laptopFeaturesInBox = document.getElementById('laptop-features-label');
    const readMore = document.getElementById('read-more');

    laptopFeaturesInBox.innerHTML = laptops[selectedLaptop].description;
    readMore.style.display = "block";

}





/* ================================= */
/*          Handling Work & Bank      */
/* ================================= */

// adds 100 to payBalance
function workToGetBalance() {
    payBalance += 100;
}

// transfer the money from paybalance to bank
function transferMoney() {
    bankBalance += payBalance;
    payBalance = 0;
}


const loanAmountLabel = document.getElementById("loanAmountLabel");
const payBalanceLabel = document.getElementById("payBalanceLabel");

// pay loan logic
function payLoanAmount() {
    // it checks first if payBalnce > loanAmount then you can pay the full loan amount
    if (payBalance > loanAmount) {
        payBalance = payBalance - loanAmount;
        loanAmount = 0;
        loanAmountLabel.innerHTML = "0" + "Kr";
        payBalanceLabel.innerHTML = payBalance + "Kr";
        document.getElementById("getLoanBtn").style.display = "block";
    } else { // else only pay the amount you have in the payBalnce towards the loan
        loanAmount = loanAmount - payBalance;
        payBalance = 0;
        payBalanceLabel.innerHTML = payBalance + "Kr";
        loanAmountLabel.innerHTML = loanAmount + "Kr";
    }

    if (loanAmount === 0) {
        hidePayLoanButton();
        hideLoanContainer();
        document.getElementById("getLoanBtn").style.display = "block";
    }
}

// get loan logic
function getLoan(amount) {
    // if the amount is less then 2 times of bank balance - loan is approved
    if (amount <= bankBalance * 2) {
        bankBalance += amount;
        loanAmount = amount;
        return true;
    } else {
        alert("We can't give you this amount");
        return false;
    }
}

// setBankBalance logic
function setBankBalance(amount) {
    bankBalance += amount
}


// handler for payToBank button
function payToBank() {
    // check if the payBalance is > 0 else you can't pay loan
    if (payBalance > 0) {
    
        //setBankBalance(payBalance);
        transferMoney();
    } else {
        alert("You need to work more to be able to transfer money!")
    }
}

//handler for buyLaptop
function buyLaptop() {
    const laptopOptions = document.getElementById("chooseLaptop");
    let laptopToBuy = laptopOptions.value - 1;
    if (laptops[laptopToBuy].price <= bankBalance) {
        setBankBalance(-laptops[laptopToBuy].price); 
        alert("Payment succeeded and you own " + laptops[laptopToBuy].title + " now!")
    } else {
        alert("Your balance is not enough to buy this laptop!")
    }
}



/**Event listeners */
document.getElementById("workBtn").addEventListener("click", function () {
    workToGetBalance();
    payBalanceLabel.innerHTML = payBalance + " Kr"
});

document.getElementById("payToBankBtn").addEventListener("click", function () {
    payToBank()
    document.getElementById("bankBalanceLabel").innerHTML = bankBalance + " Kr"
    payBalanceLabel.innerHTML = payBalance + " Kr"
});

document.getElementById("buyLaptopBtn").addEventListener("click", function () {
    buyLaptop()
    document.getElementById("bankBalanceLabel").innerHTML = bankBalance + " Kr"
});

document.getElementById("getLoanBtn").addEventListener("click", function () {
    // it shows a input box to the user to enter loan amount and store it in promptMsg variable
    let promptMsg = prompt("Enter an amount you want to loan?");
    if (Number(promptMsg)) { // check if the value entered is number
        let loanAmount = Number(promptMsg);
        if (getLoan(loanAmount)) { // check if the loan can be given getLoan will return true if loan can be given
            document.getElementById("bankBalanceLabel").innerHTML = bankBalance + " Kr"
            loanAmountLabel.innerHTML = loanAmount + " Kr";
            let getLoanBtn = document.getElementById("getLoanBtn");
            getLoanBtn.style.display = "none";
            showPayLoanButton();
            showLoanContainer();
        }
    } else {
        alert("Please enter a valid number!");
    }
});

document.getElementById("payLoanBtn").addEventListener("click", function () {
    if (payBalance === 0) {
        alert("No Pay balance in the account");
    } else {
        payLoanAmount();
    }
});


/**DOM elements showing and hiden */

function showLoanContainer() {
    document.getElementById("loanContainer").style.display = "flex";
}

function hideLoanContainer() {
    document.getElementById("loanContainer").style.display = "none";
}

function showPayLoanButton() {
    document.getElementById("payLoanBtn").style.display = "block";
}

function hidePayLoanButton() {
    document.getElementById("payLoanBtn").style.display = "none";
}





