import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from './country.model';
import { Repository } from 'typeorm';
import { AddCountryInput } from './countryDTO/country.input_type';
import { LanguageCode } from './language_codes/language-code.entity';
import { LanguageAttribute } from './language_codes/language-codes_attribute/language-codes_attribute.entity';
import { CountryAttribute } from './country_attribute/country_attribute.model';
import { find } from 'rxjs';

const COUNTRY_EXISTED = {
  message: 'This country is already exits in database',
};
const LANGUAGE_NOT_FOUND = {
  message: 'Provided language can not be found',
};
const COUNTRY_NOT_FOUND = {
  message: 'Provied country can not be found',
};
const COUNTRY_ADDED = {
  message: 'Added country successfully',
};
const COUNTRY_DELETED = {
  message: 'Deleted country successfully',
};

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country) private countriesRepository: Repository<Country>,
    @InjectRepository(CountryAttribute)
    private countryAttributesRepository: Repository<CountryAttribute>,
    @InjectRepository(LanguageCode)
    private languageRepository: Repository<LanguageCode>,
    @InjectRepository(LanguageAttribute)
    private languageAttributeRepository: Repository<LanguageAttribute>,
  ) {}

  async getAllCountries() {
    const countries = await this.countriesRepository.find({
      relations: ['attributes'],
    });
    return countries;
  }
  async getCountryById(id: string) {
    return this.countriesRepository.findOne({ where: { id } });
  }
  async getCountryByName(name: string) {
    return this.countriesRepository.findOne({
      where: {
        name: name,
      },
    });
  }
  async getAttributesById(id: string): Promise<CountryAttribute[]> {
    return this.countryAttributesRepository.find({
      where: {
        country: {
          id: id,
        },
      },
    });
  }
  async getLanguageByName(name: string) {
    const res = await this.languageRepository.findOne({
      where: {
        name: name,
      },
      relations: ['attributes'],
    });
    console.log(res);
    return res;
  }

  async addCountry(addCountryInput: AddCountryInput) {
    console.log(addCountryInput);
    const checkExistedCountry = await this.getCountryByName(
      addCountryInput.name,
    );
    if (checkExistedCountry) return COUNTRY_EXISTED;

    if (addCountryInput.language) {
      const queryLanguage = await this.getLanguageByName(
        addCountryInput.language,
      );
      if (!queryLanguage) return LANGUAGE_NOT_FOUND;
      const newCountry = await this.countriesRepository.save({
        name: addCountryInput.name,
        alpha3b: queryLanguage.alpha3b,
        language: queryLanguage.name,
      });
      if (queryLanguage.attributes) {
        for (const attribute of queryLanguage.attributes) {
          const newAttribute = {
            country: newCountry,
            name: attribute.name,
            value: attribute.value,
          };
          await this.countryAttributesRepository.save(newAttribute);
        }
      }
      return COUNTRY_ADDED;
    }
  }
  // async deleteCountry(name?: string, id?: string) {
  // }
}
