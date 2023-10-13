import logo from './logo.svg';
import './App.css';
import {
  TitleText,
  FooterCreditText,
  GithubLogo,
  PokemonCardFinder} from './components/PokemonTCG'

function App() {
  return (
    <div className="PokemonTCG">
      <TitleText />
      <PokemonCardFinder />
      <GithubLogo />
      <FooterCreditText />
    </div>
  );
}

export default App;
