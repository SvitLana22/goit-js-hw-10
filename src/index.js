import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';
const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener('input', debounce(onSearchBox, DEBOUNCE_DELAY));

function onSearchBox(event) {
  const searchCountry = event.target.value.trim();
  cleanInput();
  if (searchCountry === '') {
    return;
  }
  fetchCountries(searchCountry)
    .then(countries => renderCountryInfo(countries))
    .catch(error =>
      Notiflix.Notify.failure('Oops, there is no country with that name')
    );
}

function cleanInput() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}

function renderCountryInfo(countries) {
  if (countries.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }
  if (countries.length > 2 && countries.length < 10) {
    const markup = countries
      .map(({ flags, name }) => {
        return `<li>
        <img 
        src="${flags.svg}" 
        alt="${name.official}" 
        width="80" height="80" />
        <h1 class="country-label">${name.official}</h1>
      </li>`;
      })
      .join('');
    refs.countryList.innerHTML = markup;
  }
  if (countries.length === 1) {
    const markup = countries
      .map(({ name, capital, population, flags, languages }) => {
        return ` <img src="${flags.svg}" alt="${
          name.official
        }" width="80" height="80" />
      <h1 class="country-lable">${name.official}</h1>
      <p><b class="country-subtitle">Capital:</b>${capital}</p>
      <p><b class="country-subtitle">Population:</b>${population}</p>
      <p><b class="country-subtitle">Languages:</b>${Object.values(
        languages
      )}</p>`;
      })
      .join('');
    refs.countryInfo.innerHTML = markup;
  }
}
