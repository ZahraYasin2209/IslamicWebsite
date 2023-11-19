const modeBtn = document.getElementById('mode-button');
const cardMode = document.querySelector('.card');

const surahSelect = document.getElementById('surahSelect');
for (let i = 1; i <= 114; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.text = `Surah ${i}`;
    surahSelect.add(option);
}

// Function to fetch Ayats for the selected Surah
function loadAyats() {
    const surahNumber = surahSelect.value;
    const ayahSelect = document.getElementById('ayahSelect');

    // Clear previous options
    ayahSelect.innerHTML = '';

    // Fetch Ayats
    fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch Ayats. Please try again.');
            }
            return response.json();
        })
        .then(data => {
            const ayats = data.data.ayahs;

            // Populate Ayah dropdown
            for (let i = 0; i < ayats.length; i++) {
                const option = document.createElement('option');
                option.value = i + 1;
                option.text = `Ayah ${i + 1}`;
                ayahSelect.add(option);
            }
        })
        .catch(error => console.error('Error fetching Ayats:', error));
}

// Function to display Ayah
function showAyah() {
    const surahNumber = surahSelect.value;
    const ayahNumber = document.getElementById('ayahSelect').value;

    // Fetch and display Ayah
    fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch Ayah. Please try again.');
            }
            return response.json();
        })
        .then(data => {
            const ayahContainer = document.getElementById('ayatsContainer');
            ayahContainer.innerHTML = `<p>Ayah: <br>${data.data.text}</p>`;
        })
        .catch(error => console.error('Error fetching Ayah:', error));
}

// Function to get translation
function getTranslation() {
    const surahNumber = surahSelect.value;
    const ayahNumber = document.getElementById('ayahSelect').value;

    // Fetch Ayah and translation
    const ayahPromise = fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch Ayah. Please try again.');
            }
            return response.json();
        });

    const translationPromise = fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/en.asad`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch translation. Please try again.');
            }
            return response.json();
        });

    // Wait for both promises to resolve
    Promise.all([ayahPromise, translationPromise])
        .then(data => {
            const ayahContainer = document.getElementById('ayatsContainer');
            ayahContainer.innerHTML = `<p>Ayah: <br>${data[0].data.text}</p><p><br>Translation: <br>${data[1].data.text}</p>`;
        })
        .catch(error => console.error('Error fetching Ayah and translation:', error));
}

// Function to recite Ayah
function reciteAyah() {
    const surahNumber = surahSelect.value;
    const ayahNumber = document.getElementById('ayahSelect').value;

    // Fetch and play recitation
    fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/ar.alafasy`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch recitation. Please try again.');
            }
            return response.json();
        })
        .then(data => {
            const audioUrl = data.data.audio;
            const audio = new Audio(audioUrl);
            audio.play();
        })
        .catch(error => console.error('Error fetching recitation:', error));
}

//Mode Change
modeBtn.addEventListener('click', function () {
    console.log('mode');
    cardMode.classList.toggle('light-mode');
});
