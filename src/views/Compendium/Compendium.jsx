import { useState, useEffect } from 'react';
import PokemonList from '../../components/PokemonList/PokemonList';
import {
  fetchFilteredPokemon,
  fetchPokemon,
  fetchSearchPokemon,
  fetchTypes,
} from '../../services/pokemon';
import './Compendium.css';
import Controls from '../../components/Controls/Controls';
import pokeball from '../../assets/pokeball.png';

export default function Compendium() {
  const [loading, setLoading] = useState(true);
  const [pokemons, setPokemons] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('all');

  //TODO 😖 help!
  // Attempted to fix by moving if statement into the useEffect block. Not sure if this works. 
  useEffect(() => {
    console.log('pokemons list changed...');
    if (pokemons.count !== 0) {
      const getPokemon = async () => {
        const pokemonList = await fetchPokemon();
        setPokemons(pokemonList);
        setLoading(false);
      };

      getPokemon();
    }
    // pokemons.count was the correct solution for the infinite loop problem. Eslint was able to identify this because we have a conditional in the hook that is not passed anywhere so it must be a dependency. 
  }, [pokemons.count]);


  // Attempted to fix by moving the async declaration and implementing an await.
  //TODO 😖 help!
  useEffect(() => {
    async function getTypes() {
      const pokemonTypes = await fetchTypes();
      setTypes(pokemonTypes);
    }
    getTypes();
  }, []);

  //TODO 😖 help!
  useEffect(() => {
    async function getFilteredPokemon() {
      if (!selectedType) return;
      setLoading(true);

      if (selectedType !== 'all') {
        const filteredPokemon = await fetchFilteredPokemon(selectedType);
        setPokemons(filteredPokemon);
      } else {
        const pokemonList = await fetchPokemon();
        setPokemons(pokemonList);
      }
      setLoading(false);
    }

    getFilteredPokemon();
  }, [selectedType]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    await fetchSearchPokemon(searchName)
      .then((searchedPokemons) => {
        setPokemons(searchedPokemons);
      })
      .catch((error) => { console.log(error); })
      .finally(() => {
        setLoading(false);
        setSearchName('');
        setSelectedType('');
      });
  };

  return (
    <div className='app'>
      <main>
        <div className='title'>
          <img src={pokeball} alt='pokeball' />
          <h1 className='titleText'>Alchemy Compendium</h1>
        </div>
        <Controls
          name={searchName}
          handleSubmit={handleSubmit}
          handleNameChange={setSearchName}
          types={types}
          filterChange={setSelectedType}
          selectedType={selectedType}
        />
        {loading ? (
          <code>Search for the bugs in the code!</code>
        ) : (
          <PokemonList pokemons={pokemons} />
        )}
      </main>
    </div>
  );
}
