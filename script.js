let lowestPrice = null;
let priceHistory = [];

const checkButton = document.getElementById("checkButton");
const currentPriceDisplay = document.getElementById("currentPrice");
const lowestPriceDisplay = document.getElementById("lowestPrice");
const alertMessage = document.getElementById("alertMessage");
const historyList = document.getElementById("historyList");

function checkPrice(){
    const price = Math.floor(Math.random() * (600 - 150 +1)) + 150;

    const newEntry = {price: price, timestamp: new Date()};
    priceHistory.push(newEntry);
    addHistoryItem(newEntry);

    if(lowestPrice == null || lowestPrice > price){
        lowestPrice = price;
        alertMessage.textContent = "New lowest Price found!";
        alertMessage.classList.add("new-low");
    }else{
        alertMessage.textContent = "No change";
        alertMessage.classList.remove("new-low");
    }
    currentPriceDisplay.textContent = "Current price: $" + price;
    lowestPriceDisplay.textContent = "Lowest price: $" + lowestPrice;
    saveToStorage();
}

checkButton.addEventListener("click", checkPrice);

function addHistoryItem(entry){
    const li = document.createElement("li");
    li.textContent = "$" + entry.price + " - " + entry.timestamp;
    historyList.appendChild(li);
}

function saveToStorage(){
    localStorage.setItem("priceHistory", JSON.stringify(priceHistory));
    localStorage.setItem("lowestPrice", JSON.stringify(lowestPrice));
}

const savedHistory = localStorage.getItem("priceHistory");
if(savedHistory){
    priceHistory = JSON.parse(savedHistory);
    priceHistory.forEach(function(entry){
        entry.timestamp = new Date(entry.timestamp);
        addHistoryItem(entry);
    });
}

const savedLowest = localStorage.getItem("lowestPrice");
if(savedLowest){
    lowestPrice = JSON.parse(savedLowest);
    lowestPriceDisplay.textContent = "Lowest price: $" + lowestPrice;
}