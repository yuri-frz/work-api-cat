const catListElement = document.getElementById('cat-list');
const filterInput = document.getElementById('filter');
const catDetailsElement = document.getElementById('cat-details');
const favoriteCatsListElement = document.getElementById('favorite-cats-list');
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let cats = [];

const fetchCats = async () => {
    const response = await fetch('https://api.thecatapi.com/v1/breeds');
    cats = await response.json();
    displayCats(cats.slice(0, 10)); // Limitar a 10 gatos
};

const displayCats = (catsToDisplay) => {
    catListElement.innerHTML = '';
    catsToDisplay.forEach(cat => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${cat.image ? cat.image.url : 'https://via.placeholder.com/100'}" alt="${cat.name}">
            <strong>${cat.name}</strong>
        `;
        li.onclick = () => showDetails(cat);
        catListElement.appendChild(li);
    });
    catDetailsElement.classList.add('hidden'); // Ocultar detalhes ao atualizar a lista
    displayFavorites(); // Atualizar a lista de favoritos
};

const showDetails = (cat) => {
    catDetailsElement.innerHTML = `
        <h2>${cat.name}</h2>
        <p><strong>Temperamento:</strong> ${cat.temperament}</p>
        <p><strong>Descrição:</strong> ${cat.description}</p>
        <button onclick="toggleFavorite('${cat.id}')">
            ${favorites.includes(cat.id) ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
        </button>
    `;
    catDetailsElement.classList.remove('hidden'); // Exibir detalhes
};

const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
        favorites.splice(favorites.indexOf(id), 1);
    } else {
        favorites.push(id);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayCats(cats.slice(0, 10)); // Atualiza a lista de gatos
};

const displayFavorites = () => {
    favoriteCatsListElement.innerHTML = '';
    const favoriteCats = cats.filter(cat => favorites.includes(cat.id));
    favoriteCats.forEach(cat => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${cat.image ? cat.image.url : 'https://via.placeholder.com/100'}" alt="${cat.name}">
            <strong>${cat.name}</strong>
        `;
        favoriteCatsListElement.appendChild(li);
    });
};

filterInput.addEventListener('input', (e) => {
    const filter = e.target.value.toLowerCase();
    const filteredCats = cats.filter(cat => cat.name.toLowerCase().includes(filter));
    displayCats(filteredCats.slice(0, 10)); // Limitar a 10 gatos filtrados
});

// Inicializa o app
fetchCats();
