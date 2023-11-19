// Get references to DOM elements
const modeBtn = document.getElementById('mode-button');
const cardMode = document.querySelector('.card');
const locationElement = document.getElementById("location");


// Function to get the precise location of the user
function getPreciseLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showExactPosition, handleGeolocationError);
    } else {
        locationElement.innerHTML = "Geolocation is not supported";
    }
}


// Function to display the exact position
function showExactPosition(position) {
    locationElement.innerHTML = `Latitude: ${position.coords.latitude} degrees <br> Longitude: ${position.coords.longitude} degrees`;
}

// Event listener for finding Qibla direction button
document.getElementById('qiblaDirection').addEventListener('click', findQiblaDirection);


// Function to find Qibla direction
function findQiblaDirection() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getQiblaDirection, handleGeolocationError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Function to handle geolocation errors
function handleGeolocationError(error) {
    console.error('Error getting geolocation:', error);
    alert('Error getting your location. Please make sure your location services are enabled.');
}

// Function to display Qibla direction result
function showQiblaDirection(result) {
    const qiblaDirectionElement = document.getElementById('qiblaDirectionResult');
    const needleElement = document.getElementById('needle');

    if (result && result.data && result.data.direction !== undefined) {
        const qiblaDirection = result.data.direction;
        qiblaDirectionElement.innerHTML = `The Qibla direction is "${qiblaDirection}" degrees.`;

        // Rotate the needle to point to the Qibla direction
        needleElement.style.transform = `translateX(-50%) translateY(-100%) rotate(${qiblaDirection}deg)`;
    } else {
        console.error('Invalid or missing Qibla direction in the result:', result);
        qiblaDirectionElement.innerHTML = 'Error fetching Qibla direction. Please try again.';
    }
}

// Function to get Qibla direction using the Aladhan API
async function getQiblaDirection(position) {
    const latitude = position.coords.latitude;         // User's latitude
    const longitude = position.coords.longitude;       // User's longitude

    const apiUrl = `https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        showQiblaDirection(result);
    } catch (error) {
        console.error('Error fetching Qibla direction:', error);
        alert('Error fetching Qibla direction. Please try again.');
    }
}

// Clear error function
function clearError() {
    const alertElement = document.querySelector('.alert');
    if (alertElement) {
        alertElement.remove();
    }
}

// Mode Change event listener
document.getElementById('mode-button').addEventListener('click', function () {
    console.log('mode');
    cardMode.classList.toggle('dark-mode');
});
