let lowestPrice = null;
let priceHistory = [];
let routes = [];
let selectedRouteIndex = null;

const checkButton = document.getElementById("checkButton");
const currentPriceDisplay = document.getElementById("currentPrice");
const lowestPriceDisplay = document.getElementById("lowestPrice");
const alertMessage = document.getElementById("alertMessage");
const historyList = document.getElementById("historyList");
const originInput = document.getElementById("originInput");
const destinationInput = document.getElementById("destinationInput");
const addRouteButton = document.getElementById("addRouteButton");
const routeSelector = document.getElementById("routeSelector");

const priceChartCanvas = document.getElementById("priceChart");

const priceChart = new Chart(priceChartCanvas, {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            label: "Price ($)",
            data: [],
            borderColor: "#2563eb",
            backgroundColor: "rgba(37, 99, 235, 0.1)",
            fill: true,
            tension: 0.3
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: false
            }
        }
    }
});

function addRoute(){
    const origin = originInput.value.trim().toUpperCase();
    const destination = destinationInput.value.trim().toUpperCase();

    if(origin === "" || destination ===""){
        return;
    }

    const newRoute = {
        origin: origin,
        destination: destination,
        priceHistory: [],
        lowestPrice: null
    };

    routes.push(newRoute);
    renderRouteSelector();
    originInput.value = "";
    destinationInput.value = "";
}

addRouteButton.addEventListener("click", addRoute);

function renderRouteSelector(){
    routeSelector.innerHTML = "";
    routes.forEach(function(route, index){
        const option = document.createElement("option");
        option.value = index;
        option.textContent = route.origin + " -> " + route.destination;
        routeSelector.appendChild(option);
    });
}

routeSelector.addEventListener("change", function(){
    selectedRouteIndex = Number(routeSelector.value);
});

function checkPrice(){
    if(getTodaysCheckCount() >= maxChecksPerDay){
        alertMessage.textContent = "you've already checked " + maxChecksPerDay + " times today. Comeback tomorrow!";
        alertMessage.classList.remove("new-low");
        return;
    }
    const price = Math.floor(Math.random() * (600 - 150 +1)) + 150;

    const newEntry = {price: price, timestamp: new Date()};
    priceHistory.push(newEntry);
    addHistoryItem(newEntry);

    priceChart.data.labels.push(newEntry.timestamp.toLocaleTimeString());
    priceChart.data.datasets[0].data.push(price);
    priceChart.update();

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
    li.textContent = "$" + entry.price + " - " + entry.timestamp.toLocaleDateString("en-GB");
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

const maxChecksPerDay = 2;

function isSameDay(date1, date2){
    return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
}

function getTodaysCheckCount(){
    const today = new Date();
    return priceHistory.filter(function(entry){
        return isSameDay(entry.timestamp,today);
    }).length;
}