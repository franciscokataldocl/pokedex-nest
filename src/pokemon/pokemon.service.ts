import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';


@Injectable()
export class PokemonService {


  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) { }



  async create(createPokemonDto: CreatePokemonDto) {
    try {
      createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }

  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    //buscar por "no"
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term })
    }

    //buscar por "mongoid"
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    //buscar por "name"
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLocaleLowerCase().trim() })
    }
    //si no existe pokemon en la bbdd
    if (!pokemon) throw new NotFoundException(`pokemon with id, name or no "${term}" not found`);

    return pokemon
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name) updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();

    try {
      await pokemon.updateOne(updatePokemonDto, { new: true })
      return {...pokemon.toJSON(), ...updatePokemonDto}; //combina ambos objetos
      //el enviado por el usuario, y el que esta en base de datos, para asi tener todas las propiedades
    } catch (error) {
     this.handleExceptions(error);
    }
   
  }

  async remove(id: string) {
  //  const deletedPokemon= await  this.pokemonModel.findByIdAndDelete(id);
  //  return deletedPokemon;
  
  //hacemos esto para no tener que hacer dos consultas (buscar y eliminar)
  const {deletedCount} = await this.pokemonModel.deleteOne({_id: id});
  //si la eliminacion falla por que no existe el id en la bbdd deletedCount es 0
  if(deletedCount === 0) throw new BadRequestException(`Pokemon with _id ${id} not found`);
  return;

  }


  //helpers--------------------------------------------
  private handleExceptions(error: any){
    if (error.code === 11000) throw new BadRequestException(`Pokemon exist on database , ${JSON.stringify(error.keyValue)}`)
    throw new InternalServerErrorException(`Can't crear Pokemon - check server logs`);
  }
}
