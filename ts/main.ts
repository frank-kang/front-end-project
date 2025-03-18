// DOM
const mainScreen = document.querySelector('.main-screen') as Element;
const pokemonName = document.querySelector('.pokemon-name') as Element;
const pokemonId = document.querySelector('.pokemon-id') as Element;
const pokemonFrontImage = document.querySelector(
  '.pokemon-front-image',
) as HTMLImageElement;
const pokemonBackImage = document.querySelector(
  '.pokemon-back-image',
) as HTMLImageElement;
const pokemonTypeOne = document.querySelector(
  '.pokemon-type1',
) as HTMLSpanElement;
const pokemonTypeTwo = document.querySelector(
  '.pokemon-type2',
) as HTMLSpanElement;
const pokemonWeight = document.querySelector(
  '.pokemon-weight',
) as HTMLSpanElement;
const pokemonHeight = document.querySelector(
  '.pokemon-height',
) as HTMLSpanElement;
const pokemonCry = document.querySelector('.pokemon-cry') as HTMLAudioElement;
const pokemonListItems = document.querySelectorAll('.list-item');
const prevButton = document.querySelector('.prev-button');
const nextButton = document.querySelector('next-button');
// Variables
const types: string[] = [
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
function capitalize(name: string): string {
  if (!name) {
    return '';
  }
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

async function fetchPokeList(url: any) {
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

// Listeners

// Initial State
fetchPokeList('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20');
