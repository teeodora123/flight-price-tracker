let lowestPrice = null;
let priceHistory = [];

const checkButton = document.getElementById("checkButton");
const currentPriceDisplay = document.getElementById("currentPrice");
const lowestPriceDisplay = document.getElementById("lowestPrice");
const alertMessage = document.getElementById("alertMessage");
const historyList = document.getElementById("historyList");

function addHistoryItem(entry){
    const li = document.createElement("li");
    li.textContent = "$" + entry.name + " - " + entry.timestamp;
    historyList.appendChild(li);
}

function checkPrice(){
    const price = Math.floor(Math.random() * (600 - 150 +1)) + 150;
    priceHistory.push({name: price, timestamp: new Date()});

    const newEntry = {name: price, timestamp: new Date()};
    priceHistory.push(newEntry);
    addHistoryItem(newEntry);
    
    if(lowestPrice == null || lowestPrice > price){
        lowestPrice = price;
        alertMessage.textContent = "New lowest Price found!";
    }else{
        alertMessage.textContent = "No change";
    }
    currentPriceDisplay.textContent = "Current price: $" + price;
    lowestPriceDisplay.textContent = "Lowest price: $" + lowestPrice;
}

checkButton.addEventListener("click", checkPrice);