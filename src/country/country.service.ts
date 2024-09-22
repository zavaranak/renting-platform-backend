import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from './country.model';
import { Repository } from 'typeorm';
import { AddCountryInput } from './countryDTO/country.input_type';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country) private countriesRepository: Repository<Country>,
  ) {}

  getAllCountries() {
    return this.countriesRepository.find();
  }
  getCountryById(id: string) {
    return this.countriesRepository.findOne({ where: { id } });
  }
  addCountry(addCountryInput: AddCountryInput) {
    // const { name, language, alpha3b, banksId } = addCountryInput;
    console.log(addCountryInput);
  }
}
