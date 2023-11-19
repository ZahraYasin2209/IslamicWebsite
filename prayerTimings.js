// Configuration for the country-state-city API
var config = {
  cUrl: 'https://api.countrystatecity.in/v1/countries',
  ckey: 'NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA=='
};

// DOM elements
var countrySelect = document.querySelector('.country'),
  stateSelect = document.querySelector('.state'),
  citySelect = document.querySelector('.city');

// Mode change button and card
const modeBtn = document.getElementById('mode-button');
const cardMode = document.querySelector('.card');


// Display area for prayer timings
const showTimingDiv = document.getElementById('show_Prayer_Timing');


// Function to load countries into the country dropdown
function loadCountries() {
  let apiEndPoint = config.cUrl;

  fetch(apiEndPoint, { headers: { "X-CSCAPI-KEY": config.ckey } })
      .then(response => {
          if (!response.ok) {
              throw new Error(`Network response was not ok: ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
          data.forEach(country => {
              const option = document.createElement('option');
              option.value = country.iso2;
              option.textContent = country.name;
              countrySelect.appendChild(option);
          });
      })
      .catch(error => showError('Error loading countries:', error));

  stateSelect.disabled = true;
  citySelect.disabled = true;
  stateSelect.style.pointerEvents = 'none';
  citySelect.style.pointerEvents = 'none';
}


// Function to load states based on the selected country
function loadStates() {
  stateSelect.disabled = false;
  citySelect.disabled = true;
  stateSelect.style.pointerEvents = 'auto';
  citySelect.style.pointerEvents = 'none';

  const selectedCountryCode = countrySelect.value;
  stateSelect.innerHTML = '<option value="">Select State</option>';
  citySelect.innerHTML = '<option value="">Select City</option>';

  fetch(`${config.cUrl}/${selectedCountryCode}/states`, { headers: { "X-CSCAPI-KEY": config.ckey } })
      .then(response => response.json())
      .then(data => {
          data.forEach(state => {
              const option = document.createElement('option');
              option.value = state.iso2;
              option.textContent = state.name;
              stateSelect.appendChild(option);
          });
      })
      .catch(error => showError('Error loading states:', error));
}


// Function to load cities based on the selected country and state
function loadCities() {
  citySelect.disabled = false;
  citySelect.style.pointerEvents = 'auto';

  const selectedCountryCode = countrySelect.value;
  const selectedStateCode = stateSelect.value;

  citySelect.innerHTML = '<option value="">Select City</option>';

  fetch(`${config.cUrl}/${selectedCountryCode}/states/${selectedStateCode}/cities`, { headers: { "X-CSCAPI-KEY": config.ckey } })
      .then(response => response.json())
      .then(data => {
          data.forEach(city => {
              const option = document.createElement('option');
              option.value = city.iso2;
              option.textContent = city.name;
              citySelect.appendChild(option);
          });
      })
      .catch(error => showError('Error loading cities:', error));
}


// Function to get and display prayer timings
async function getAndDisplayPrayerTimings() {
  const selectedCountry = countrySelect.value;
  const selectedState = stateSelect.value;
  const selectedCity = citySelect.value;

  if (selectedCity) {
      try {
          const timings = await getTimings(selectedCountry, selectedState, selectedCity);
          displayPrayerTimings(timings);
      } catch (error) {
          console.error('Error fetching prayer timings:', error);
          showError(error);
      }
  } else {
      showError(new Error('Please select a city'));
  }
}

// Function to get prayer timings from the Aladhan API
async function getTimings(selectedCountry, selectedState, selectedCity) {
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
  const apiUrl = `https://api.aladhan.com/v1/timingsByCity/${formattedDate}?city=${selectedCity}&country=${selectedCountry}&state=${selectedState}`;

  try {
      const response = await fetch(apiUrl);
      const result = await response.json();

      if (result && result.data && result.data.timings) {
          return result.data.timings;
      } else {
          throw new Error('Invalid or missing prayer timings in the result');
      }
  } catch (error) {
      console.error('Error fetching prayer timings:', error);
      throw error;
  }
}

// Function to display prayer timings in the UI
function displayPrayerTimings(timings) {
  const prayerTimingsDiv = document.getElementById('prayerTimings');
  const prayerTimingsHTML = `
      <h5>Prayer Timings:</h5>
      <p>Fajr: ${timings.Fajr}am</p>
      <p>Dhuhr: ${timings.Dhuhr}pm</p>
      <p>Asr: ${timings.Asr}pm</p>
      <p>Maghrib: ${timings.Maghrib}pm</p>
      <p>Isha: ${timings.Isha}pm</p>`;

  prayerTimingsDiv.innerHTML = prayerTimingsHTML;
}

// Function to show error messages
function showError(error) {
  console.error('Error:', error);

  // Display error message in an alert div
  const errorAlertDiv = document.getElementById('errorAlert');
  errorAlertDiv.style.display = 'block';
  errorAlertDiv.textContent = `Error: ${error.message}`;
}

// Clear error messages
function clearError() {
  document.getElementById('errorAlert').style.display = 'none';
}

// Mode Change
modeBtn.addEventListener('click', function () {
  cardMode.classList.toggle('dark-mode');
});

// Call loadCountries directly to load countries when the page loads
loadCountries();
