const ayahBtn = document.getElementById('ayahTextBtn');
const prayerBtn = document.getElementById('prayerTimingBtn');
const directionBtn = document.getElementById('qiblaDirectionBtn');
const modeBtn = document.getElementById('mode-button');
const cardMode = document.querySelector('.card');

//Add event Listener
ayahBtn.addEventListener('click', function (e) {
    e.preventDefault();

    window.location.href = 'islamicProject.html';
})

//Add event Listener
prayerBtn.addEventListener('click', function (e) {
    e.preventDefault();

    window.location.href = 'prayerTimings.html';
})

//Add event Listener
directionBtn.addEventListener('click', function (e) {
    e.preventDefault();

    window.location.href = 'qiblaDirection.html';
})


//Mode Change
modeBtn.addEventListener('click', function () {

    console.log('mode');
    cardMode.classList.toggle('light-mode');
})