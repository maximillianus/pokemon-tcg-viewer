import './App.css';
import {
  TitleText,
  FooterCreditText,
  GithubLogo,
  PokemonCardFinder} from './components/PokemonTCG-with-vanilla'

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
