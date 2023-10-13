import { useState } from 'react';
import _ from 'lodash';
import pokedex from '../datasets/pokedex.json';
import '../styles/pokemon-tcg-vanilla.css'

const styling = {
    titleStyle: {
      textAlign: "center",
      marginTop: "4rem",
    },
    subTitleStyle: {
      textAlign: "center",
      marginBottom: "4rem",
      color: "gray"
    },
    footerStyle: {
      position: "fixed",
      bottom: "0",
      textAlign: "center",
      backgroundColor: "gray",
      color: "white",
      width: "100%",
      height: "3rem",
      lineHeight: "3rem"
    },
    githubLogoStyle: {
      position: "absolute",
      top: "0",
      right: "0",
      maxWidth: "50px",
      height: "50px",
      display: "flex",
      margin: "1rem"
    },
    cardFinder: {
      width: "500px",
      // border: "1px solid",
      margin: "0 auto",
      padding: "0.5rem"
    },
    searchBar: {
      // border: "1px solid",
      display: "flex",
      justifyContent: "center",
      margin: "1rem 0 3rem 0",
    },
    searchInputText: {
      height: "1.5rem",
      width: "250px",
    },
    searchInputButton: {
      height: "1.875rem"
    },
    cardPanel: {
      border: "1px solid",
      borderColor: "#ccc",
      borderRadius: "0.5rem",
      padding: "0.5rem",
      width: "50%",
      margin: "0 auto"
      // textAlign: "center"
    },
    cardPicture: {
      // border: "1px solid red",
      margin: "0 auto",
      display: "block"
    },
    cardTitle: {
      fontSize: "1.75rem",
      margin: "0.5rem 0 0 0"
    },
    cardInfo: {
      // border: "1px solid blue",
      margin: "0.5rem 0 0 0"
    },
    cardInfoText: {
      color: "gray",
      margin: "0 0 0 0",
      lineHeight: "1.5"
    }
};


const githubLogo = '/github-svg-142.svg';
let baseAPIUrl = 'https://api.tcgdex.net/v2/en';

function TitleText() {
  return (
    <>
      <h1 className="title__title">Pokémon TCG Viewer</h1>
      <p className="title__subtitle">Find Pokemon card pictures you like! </p>
    </>
  )
}

function PokemonCardFinder() {
  const [pokemon, setPokemon] = useState('');
  const [cardData, setCardData] = useState({});
  const [cardInfo, setCardInfo] = useState({});

  return (
    <div className="card-finder">
      <SearchBar
        pokemonSearch={pokemon}
        onSearchSubmit={setPokemon}
        setSearchResult={setCardData}
        setCardInfo={setCardInfo} />
      <DisplayCardPanel
        pokemonResult={cardData}
        pokemonCardInfo={cardInfo} />
    </div>
  )
}

function SearchBar({pokemonSearch, onSearchSubmit, setSearchResult, setCardInfo}) {

  const getCardFromRandomSet = (setList) => {
    const randomIndex = Math.floor(Math.random() * setList.cards.length);
    const card = setList.cards[randomIndex];
    return card;
  };

  async function fetchData(url) {
    const response = await fetch(url);
    const resultList = await response.json();
    return resultList;
  };

  function fetchPokemonCardDetails(id) {
    const url= `${baseAPIUrl}/cards/${id}`;

    fetchData(url)
      .then(data => setCardInfo(data))
  };

  const processPokemonTCGRequest = (pokemonSearch) => {

    let pokemonSearchId;

    pokedex.forEach((pokemon) => {
      if (
        _.isEqual(
          pokemon.name.english.toLowerCase(),
          pokemonSearch.toLowerCase()
          )) {
            pokemonSearchId = pokemon.id;
          }
    });

    if (_.isUndefined(pokemonSearchId)) {
      setSearchResult({
        id: 'NotFound',
        image: 'https://www.tcdb.com/Images/Cards/Gaming/83658/83658-5937148RepBk.jpg',
        localId: 'NotFound',
        name: 'NotFound',
      });

      return;
    }

    const url = `${baseAPIUrl}/dex-ids/${pokemonSearchId}`;

    fetchData(url)
      .then(res => {
        const card = getCardFromRandomSet(res);

        fetchPokemonCardDetails(card.id);
        setSearchResult(card);

        return;
      });

  };

  function handleSubmit(e) {
    e.preventDefault();
    processPokemonTCGRequest(pokemonSearch);
  }

  return (
    <div className="card-finder__search-bar">
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Search Pokemon Name..'
          value={pokemonSearch}
          className="card-finder__search-bar__search-input-text"
          onChange={(e) => {
            onSearchSubmit(e.target.value)
          }}
        >
       </input>
        <button
          className="card-finder__search-bar__search-button">
          Go
        </button>
      </form>

    </div>
  )
}

function DisplayCardPanel({pokemonResult, pokemonCardInfo}) {

  if (_.isUndefined(pokemonResult.id)) {
    return <></>
  }

  const isPokemonFound = pokemonResult.id !== 'NotFound';

  return (
    <div className="card-finder__card-panel">
      {
        isPokemonFound
        ? <>
          <DisplayCardImage pokemonResult={pokemonResult}/>
          <DisplayCardInfo pokemonCardInfo={pokemonCardInfo}/>
        </>
        : "Pokemon Card is not found"
      }
    </div>
  )
}

function DisplayCardImage({pokemonResult}) {
  let pokemonImageLink;
  if (pokemonResult.id !== 'NotFound') {
    pokemonImageLink = pokemonResult.image + '/low.png';
  }

  return (
    // <div>
      <img className="card-finder__card-image" src={pokemonImageLink} alt='Pokemon TCG' />
    // </div>
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
      <h3 className="card-finder__card-info__title">{tcgSet}</h3>
      <div className="card-finder__card-info__content">
        <div className="card-finder__card-info__content__text">
          Rarity: {rarity}
          <br />
          Illustrator: {illustrator}
        </div>
      </div>
    </>

  )
}

function GithubLogo() {
  return (
    <div className="github-logo">
      <img src={githubLogo} alt='github'/>
    </div>
  )
}

function FooterCreditText() {
  return (
    <footer className="footer">
      All the assets are credit to https://tcgdex.dev/. Do visit and support their page!
    </footer>
  )

}

export {
  TitleText,
  FooterCreditText,
  PokemonCardFinder,
  GithubLogo
}