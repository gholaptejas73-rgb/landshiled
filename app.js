function showStatus() {
    const status = document.getElementById("status");

    status.textContent = "System is active and monitoring landslide risk.";

    status.style.color = "green";

    setTimeout(() => {
        status.textContent = "Monitoring rainfall, terrain and risk data...";
    }, 3000);
}

console.log("NER Landslide Risk Monitoring System loaded successfully.");
const riskData = {
    location: "Sikkim",
    riskScore: 78,
    rainfall: 124,
    soilMoisture: 82,
    alerts: 6
};
async function loadRiskData() {
    try {
        const response = await fetch(
            "http://127.0.0.1:5000/api/all-risks"
        );

        const data = await response.json();

        console.log("Risk data from backend:", data);

        if (data.length > 0) {
            riskData.location = data[0].name;
            riskData.riskScore = data[0].risk;
            riskData.rainfall = data[0].rainfall;
            riskData.soilMoisture = data[0].soil_moisture;
            document.getElementById("dashboardRisk").textContent =
    riskData.riskScore + "%";
    document.getElementById("detailRainfall").textContent =
    riskData.rainfall + " mm";

document.getElementById("detailSoil").textContent =
    riskData.soilMoisture + "%";
        }

        updateRiskData();

    } catch (error) {
        console.error(
            "Risk data connection failed:",
            error
        );
    }
}

loadRiskData();
function updateRiskData() {
    console.log("Location:", riskData.location);
    console.log("Risk Score:", riskData.riskScore + "%");
    console.log("Rainfall:", riskData.rainfall + " mm");
    console.log("Soil Moisture:", riskData.soilMoisture + "%");
    console.log("Active Alerts:", riskData.alerts);

    if (riskData.riskScore >= 70) {
        console.log("Risk Level: HIGH");
    } else if (riskData.riskScore >= 40) {
        console.log("Risk Level: MEDIUM");
    } else {
        console.log("Risk Level: LOW");
    }
}

updateRiskData();
const map = L.map("riskMap").setView([27.5330, 88.5122], 7);

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "&copy; OpenStreetMap contributors"
    }
).addTo(map);

const riskLocations = [
    { name: "Sikkim Risk Zone", lat: 27.5330, lon: 88.5122, risk: 78 },
    { name: "Meghalaya Risk Zone", lat: 25.4670, lon: 91.3662, risk: 65 },
    { name: "Arunachal Pradesh", lat: 28.2180, lon: 94.7278, risk: 82 }
];

riskLocations.forEach(location => {

    const marker = L.circle(
        [location.lat, location.lon],
        {
            radius: 18000,
            color: "red",
            fillOpacity: 0.35
        }
    ).addTo(map);

    marker.bindPopup(
        `<b>${location.name}</b><br>
         Risk Score: ${location.risk}%`
    );

    marker.on("click", function () {
        showRiskDetails(location);
    });

    marker.on("mouseover", function () {
        marker.setStyle({ weight: 4 });
    });

    marker.on("mouseout", function () {
        marker.setStyle({ weight: 2 });
    });
});
function showRiskDetails(location) {
    document.getElementById("selectedLocation").textContent = location.name;
    document.getElementById("detailRisk").textContent =
        location.risk + "%";

    document.getElementById("detailRainfall").textContent =
        riskData.rainfall + " mm";

    document.getElementById("detailSoil").textContent =
        riskData.soilMoisture + "%";

    let status = "LOW";
    if (location.risk >= 70) {
        status = "HIGH";
    } else if (location.risk >= 40) {
        status = "MEDIUM";
    }

    document.getElementById("detailStatus").textContent = status;
}

function showRiskReason() {
    document.getElementById("riskReason").textContent =
        "High rainfall and high soil moisture are contributing to the current risk.";
}
// marker.on("click", function () {
//     showRiskDetails(location);
// });

// marker.on("mouseover", function () {
//     marker.setStyle({
//         weight: 4
//     });
// });

// marker.on("mouseout", function () {
//     marker.setStyle({
//         weight: 2
//     });
// });

console.log("Risk zone ready:", location.name);
console.log("Risk score:", location.risk + "%");
function simulateRisk() {
    const slider = document.getElementById("rainfallSlider");
    const change = Number(slider.value);

    const baseRisk = 78;
    let estimatedRisk = baseRisk + (change * 0.25);

    estimatedRisk = Math.max(0, Math.min(100, estimatedRisk));

    document.getElementById("rainfallValue").textContent =
        (change >= 0 ? "+" : "") + change + "%";

    document.getElementById("simulatedRisk").textContent =
        Math.round(estimatedRisk) + "%";

    let status = "Low Risk";

    if (estimatedRisk >= 70) {
        status = "High Risk";
    } else if (estimatedRisk >= 40) {
        status = "Medium Risk";
    }

    document.getElementById("simulationStatus").textContent = status;
}
const feedbackForm = document.getElementById("feedbackForm");

feedbackForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const officerName =
        document.getElementById("officerName").value;

    const observation =
        document.getElementById("observation").value;

    const fieldRisk =
        document.getElementById("fieldRisk").value;

    const message =
        document.getElementById("feedbackMessage");

    if (officerName && observation && fieldRisk) {
        message.textContent =
            "Feedback submitted successfully.";

        feedbackForm.reset();

        console.log("Officer:", officerName);
        console.log("Observation:", observation);
        console.log("Observed Risk:", fieldRisk);
    }
});
function filterLocations() {
    const searchText =
        document.getElementById("locationSearch").value.toLowerCase();

    const result =
        document.getElementById("searchResult");

    const matches = riskLocations.filter(location =>
        location.name.toLowerCase().includes(searchText)
    );

    if (searchText === "") {
        result.innerHTML =
            "<p>Available locations: Sikkim, Meghalaya, Arunachal Pradesh</p>";
        return;
    }

    if (matches.length === 0) {
        result.innerHTML =
            "<p>No risk location found.</p>";
        return;
    }

    result.innerHTML = "";

    matches.forEach(location => {
        const item = document.createElement("p");

        item.textContent =
            location.name + " — Risk Score: " +
            location.risk + "%";

        result.appendChild(item);
    });
}
function toggleDarkMode() {
    const body = document.body;
    const button = document.getElementById("darkModeBtn");

    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
        button.textContent = "☀️ Light Mode";
    } else {
        button.textContent = "🌙 Dark Mode";
    }
}

console.log("Dark mode feature ready.");
function updateLiveTime() {
    const timeElement =
        document.getElementById("liveTime");

    if (!timeElement) {
        return;
    }

    const now = new Date();

    const hours =
        String(now.getHours()).padStart(2, "0");

    const minutes =
        String(now.getMinutes()).padStart(2, "0");

    const seconds =
        String(now.getSeconds()).padStart(2, "0");

    timeElement.textContent =
        hours + ":" + minutes + ":" + seconds;
}

updateLiveTime();

setInterval(updateLiveTime, 1000);
function updateLastUpdated() {
    const timeElement =
        document.getElementById("lastUpdatedTime");

    if (!timeElement) {
        return;
    }

    const now = new Date();

    const time = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    timeElement.textContent = time;
}

updateLastUpdated();

setInterval(updateLastUpdated, 60000);

console.log("Last updated time is active.");
async function checkBackendConnection() {
    try {
        const response = await fetch(
            "http://127.0.0.1:5000/api/status"
        );

        const data = await response.json();

        console.log("Backend Status:", data.status);
        console.log("Backend System:", data.system);

    } catch (error) {
        console.error(
            "Backend connection failed:",
            error
        );
    }
}

checkBackendConnection();