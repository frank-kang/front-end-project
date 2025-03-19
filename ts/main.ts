interface FormElements extends HTMLFormControlsCollection {
  name: HTMLInputElement;
}

interface FormObject {
  name?: string;
}

const $mainScreen = document.querySelector('.main-screen') as Element;
const $pokemonName = document.querySelector('.pokemon-name') as Element;
const $pokemonId = document.querySelector('.pokemon-id') as Element;
const $pokemonFrontImage = document.querySelector(
  '.pokemon-front-image',
) as HTMLImageElement;
const $pokemonBackImage = document.querySelector(
  '.pokemon-back-image',
) as HTMLImageElement;
const $pokemonTypeOne = document.querySelector(
  '.pokemon-type1',
) as HTMLSpanElement;
const $pokemonTypeTwo = document.querySelector(
  '.pokemon-type2',
) as HTMLSpanElement;
const $pokemonWeight = document.querySelector(
  '.pokemon-weight',
) as HTMLSpanElement;
const $pokemonHeight = document.querySelector(
  '.pokemon-height',
) as HTMLSpanElement;
const $pokemonCry = document.querySelector('.pokemon-cry') as HTMLAudioElement;
const $pokemonListItems = document.querySelectorAll('.list-item');
const $prevButton = document.querySelector('.prev-button');
const $nextButton = document.querySelector('.next-button');
const $headPhones = document.querySelector('.fa-headphones');
const $searchForm = document.querySelector('#search') as HTMLFormElement;

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

let prevUrl: string | null = null;
let nextUrl: string | null = null;

function capitalize(name: string): string {
  if (!name) {
    return '';
  }
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

function resetScreen(): void {
  $mainScreen.classList.remove('hide');
  for (const type of types) {
    $mainScreen.classList.remove(type);
  }
}

async function fetchPokeList(url: any): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error. Status ${response.status}`);
    }
    const data = await response.json();
    const { results, previous, next } = data;
    prevUrl = previous;
    nextUrl = next;
    for (let i = 0; i < $pokemonListItems.length; i++) {
      const pokeListItem = $pokemonListItems[i];
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

async function fetchPokemonData(id: number | string): Promise<void> {
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
    $pokemonTypeOne.textContent = capitalize(dataFirstType.type.name);
    if (dataSecondType) {
      $pokemonTypeTwo.classList.remove('hide');
      $pokemonTypeTwo.textContent = capitalize(dataSecondType.type.name);
    } else {
      $pokemonTypeTwo.classList.add('hide');
      $pokemonTypeTwo.textContent = '';
    }
    $mainScreen.classList.add(dataFirstType.type.name);
    $pokemonName.textContent = capitalize(data.name);
    $pokemonId.textContent = '#' + data.id.toString().padStart(3, '0');
    $pokemonWeight.textContent = data.weight;
    $pokemonHeight.textContent = data.height;
    $pokemonFrontImage.src = data.sprites.front_default || '';
    $pokemonBackImage.src = data.sprites.back_default || '';
    $pokemonCry.src = data.cries.latest || '';
  } catch (error) {
    console.error('Error:', error);
  }
}

function leftButtonClick(): void {
  if (prevUrl) {
    fetchPokeList(prevUrl);
  }
}

function rightButtonClick(): void {
  if (nextUrl) {
    fetchPokeList(nextUrl);
  }
}

function handleListItemClick(event: any): void {
  if (!event.target) return;

  const listItem = event.target;
  if (!listItem.textContent) return;

  const id = listItem.textContent.split('.')[0];
  fetchPokemonData(id);
}

function playAudio(): void {
  $pokemonCry.play();
}

function search(event: Event): void {
  event.preventDefault();
  const formElements = $searchForm.elements as FormElements;
  const formObject: FormObject = {};
  formObject.name = formElements.name.value;
  fetchPokemonData(formObject.name);
  $searchForm.reset();
}

$searchForm.addEventListener('submit', search);
$headPhones?.addEventListener('click', playAudio);
if (!$prevButton) throw new Error('$prevButton does not exist');
$prevButton.addEventListener('click', leftButtonClick);
if (!$nextButton) throw new Error('$nextButton does not exist');

$nextButton.addEventListener('click', rightButtonClick);
for (const pokemonListItem of $pokemonListItems) {
  pokemonListItem.addEventListener('click', handleListItemClick);
}

fetchPokeList('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20');
