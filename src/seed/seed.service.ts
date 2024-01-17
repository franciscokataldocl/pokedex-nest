import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';


@Injectable()
export class SeedService {

    //dependecia de axios
  private readonly axios: AxiosInstance = axios;

  async executeSeed() {
    const {data} = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=151');
    const filteredPokemons = data.results.map(pokemon =>{
      const match = pokemon.url.match(/\/(\d+)\/$/);
      const number = match ? parseInt(match[1], 10) : null;
      return {
        name: pokemon.name,
        no: number
      };
    })
    return filteredPokemons;
  } 


}
