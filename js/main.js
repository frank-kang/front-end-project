'use strict';
// DOM
const mainScreen = document.querySelector('.main-screen');
const pokemonName = document.querySelector('.pokemon-name');
const pokemonId = document.querySelector('.pokemon-id');
const pokemonFrontImage = document.querySelector('.pokemon-front-image');
const pokemonBackImage = document.querySelector('.pokemon-back-image');
const pokemonTypeOne = document.querySelector('.pokemon-type1');
const pokemonTypeTwo = document.querySelector('.pokemon-type2');
const pokemonWeight = document.querySelector('.pokemon-weight');
const pokemonHeight = document.querySelector('.pokemon-height');
const pokemonCry = document.querySelector('.pokemon-cry');
const pokemonListItems = document.querySelectorAll('.list-item');
const prevButton = document.querySelector('.prev-button');
const nextButton = document.querySelector('.next-button');
const headPhones = document.querySelector('.fa-headphones');
// Variables
const types = [
  'normal',
  'fighting',
  'flying',
  'poison',
  'ground',
  'rock',
  'bug',
  'ghost',
  'steel',
  'fire',
  'water',
  'grass',
  'electric',
  'psychic',
  'ice',
  'dragon',
  'dark',
  'fairy',
];
let prevUrl = null;
let nextUrl = null;
// Functions
function capitalize(name) {
  if (!name) {
    return '';
  }
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}
function resetScreen() {
  mainScreen.classList.remove('hide');
  for (const type of types) {
    mainScreen.classList.remove(type);
  }
}
async function fetchPokeList(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error. Status ${response.status}`);
    }
    const data = await response.json();
    const { results, previous, next } = data;
    prevUrl = previous;
    nextUrl = next;
    for (let i = 0; i < pokemonListItems.length; i++) {
      const pokeListItem = pokemonListItems[i];
      const resultData = results[i];
      if (resultData) {
        const { name, url } = resultData;
        const urlArray = url.split('/');
        const id = urlArray[urlArray.length - 2];
        pokeListItem.textContent = id + '. ' + capitalize(name);
      } else {
        pokeListItem.textContent = '';
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
async function fetchPokemonData(id) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error. Status ${response.status}`);
    }
    resetScreen();
    const data = await response.json();
    const dataTypes = data.types;
    const dataFirstType = dataTypes[0];
    const dataSecondType = dataTypes[1];
    pokemonTypeOne.textContent = capitalize(dataFirstType.type.name);
    if (dataSecondType) {
      pokemonTypeTwo.classList.remove('hide');
      pokemonTypeTwo.textContent = capitalize(dataSecondType.type.name);
    } else {
      pokemonTypeTwo.classList.add('hide');
      pokemonTypeTwo.textContent = '';
    }
    mainScreen.classList.add(dataFirstType.type.name);
    pokemonName.textContent = capitalize(data.name);
    pokemonId.textContent = '#' + data.id.toString().padStart(3, '0');
    pokemonWeight.textContent = data.weight;
    pokemonHeight.textContent = data.height;
    pokemonFrontImage.src = data.sprites.front_default || '';
    pokemonBackImage.src = data.sprites.back_default || '';
    pokemonCry.src = data.cries.latest || '';
  } catch (error) {
    console.error('Error:', error);
  }
}
function leftButtonClick() {
  if (prevUrl) {
    fetchPokeList(prevUrl);
  }
}
function rightButtonClick() {
  if (nextUrl) {
    fetchPokeList(nextUrl);
  }
}
function handleListItemClick(event) {
  if (!event.target) return;
  const listItem = event.target;
  if (!listItem.textContent) return;
  const id = listItem.textContent.split('.')[0];
  fetchPokemonData(id);
}
function playAudio() {
  pokemonCry.play();
}
// Listeners
headPhones?.addEventListener('click', playAudio);
if (!prevButton) throw new Error('prevButton does not exist');
prevButton.addEventListener('click', leftButtonClick);
if (!nextButton) throw new Error('nextButton does not exist');
nextButton.addEventListener('click', rightButtonClick);
for (const pokemonListItem of pokemonListItems) {
  pokemonListItem.addEventListener('click', handleListItemClick);
}
// Initial State
fetchPokeList('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20');
