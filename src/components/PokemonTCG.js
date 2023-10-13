import { useState } from 'react';
import _ from 'lodash';

let baseAPIUrl = 'https://api.tcgdex.net/v2/en';
const githubLogo = '/github-svg-142.svg';

function TitleText() {
  return (
    <h1>Pokemon TCG Viewer</h1>
  )
}

function PokemonCardFinder() {
  const [pokemon, setPokemon] = useState('');
  const [cardData, setCardData] = useState({});
  const [cardInfo, setCardInfo] = useState({});

  return (
    <>
      <SearchBar
        pokemonSearch={pokemon}
        onSearchSubmit={setPokemon}
        setSearchResult={setCardData}
        setCardInfo={setCardInfo} />
      <DisplayCardPanel
        pokemonResult={cardData}
        pokemonCardInfo={cardInfo} />
    </>
  )
}

function SearchBar({pokemonSearch, onSearchSubmit, setSearchResult, setCardInfo}) {

  const fetchPokemonData = (pokemonSearch) => {
    const url= baseAPIUrl + '/sets/base1';

    let cardNotFound = {
      id: 'NotFound',
      image: 'https://www.tcdb.com/Images/Cards/Gaming/83658/83658-5937148RepBk.jpg',
      localId: 'NotFound',
      name: 'NotFound',
    }
    setSearchResult(cardNotFound);

    fetch(url)
      .then(res => {
        return res.json();
      })
      .then(data => {
        data.cards.forEach((card) => {
          if (card.name.toLowerCase() === pokemonSearch) {
            setSearchResult(card);
            fetchPokemonCardInfo(card.id);
            return;
          }
        });

      });
  }

  const fetchPokemonCardInfo = (id) => {
    let url= baseAPIUrl + '/cards/' + id;

    fetch(url)
      .then(res => {
        return res.json();
      })
      .then(data => {
        setCardInfo(data);

      }

      );
    };

  function handleSubmit(e) {
    e.preventDefault();
    fetchPokemonData(pokemonSearch);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Search..'
          value={pokemonSearch}
          onChange={(e) => {
            onSearchSubmit(e.target.value)
          }}
        >
       </input>
        <button>Go</button>
      </form>

    </>
  )
}

function DisplayCardPanel({pokemonResult, pokemonCardInfo}) {

  return (
    <div>
      <DisplayCardImage pokemonResult={pokemonResult}/>
      <DisplayCardInfo pokemonCardInfo={pokemonCardInfo}/>
    </div>
  )
}
function DisplayCardImage({pokemonResult}) {
  let pokemonImageLink;
  if (pokemonResult.id !== 'NotFound') {
    pokemonImageLink = pokemonResult.image + '/low.png';
  }

  return (
    <img src={pokemonImageLink} alt='Pokemon TCG' />
  )
}

function DisplayCardInfo({pokemonCardInfo}) {
  let rarity = ''
  let illustrator = ''
  let tcgSet = '';

  if (!_.isEmpty(pokemonCardInfo)) {
    rarity =pokemonCardInfo.rarity;
    illustrator = pokemonCardInfo.illustrator;
    tcgSet = pokemonCardInfo.set.name;
  }

  return (
    <>
      <h3>Pokemon Card Info</h3>
      <p>Rarity: {rarity}</p>
      <p>Illustrator: {illustrator}</p>
      <p>TCG Set: {tcgSet}</p>
    </>

  )
}

function GithubLogo() {
  return (
    <img style={{ width: 50, height: 50 }} src={githubLogo} alt='github'/>
  )
}

function PokemonNameSuggestionBar() {
  return (
    <pre>pokemon-name-suggestion-bar</pre>
  )
}

function FooterCreditText() {
  return (
    <footer>All the assets are credit to https://tcgdex.dev/. Do visit and support their page!</footer>
  )

}

export {
  TitleText,
  FooterCreditText,
  PokemonNameSuggestionBar,
  PokemonCardFinder,
  GithubLogo
}