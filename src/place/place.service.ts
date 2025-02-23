import { v4 as uuidv4 } from 'uuid';
import {
  Inject,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Place } from './place.entity';
import { PlaceInput } from './dto/create_place.dto';
import { LandlordService } from 'src/landlord/landlord.service';
import { PlaceUpdateInput } from './dto/update_place.dto';
import {
  ActionStatus,
  AttributesStatus,
  UploadType,
  PhotoExtention,
  PlaceStatus,
} from 'src/common/constants';
import { PlaceAttribute } from './place_attribute.entity';
import {
  queryMany,
  QueryParams,
  queryOne,
  queryDistinct,
  Condition,
  Operator,
} from 'src/common/query_function';
import { PlaceAttributeInput } from './dto/place_attribute_input';
import { QueryResponse } from 'src/common/reponse';
import * as Upload from 'graphql-upload/Upload.js';
import { UploadFile, uploadFilesFromStream } from 'src/common/upload_files';
import { extname } from 'path';
import dayjs from 'dayjs';
import { AttributeUpdateInput } from 'src/common/attribute_update_input';

@Injectable()
export class PlaceService {
  private placeRepository: Repository<Place>;
  private placeAttributeRepository: Repository<PlaceAttribute>;
  constructor(
    @Inject('DATA_SOURCE_PSQL') private datasource: DataSource,
    private landlordService: LandlordService,
  ) {
    this.placeRepository = this.datasource.getRepository(Place);
    this.placeAttributeRepository =
      this.datasource.getRepository(PlaceAttribute);
  }

  async getMany(queryParams: QueryParams): Promise<Place[]> {
    return await queryMany(this.placeRepository, queryParams);
  }

  async getOne(queryParams: QueryParams): Promise<Place> {
    return await queryOne(this.placeRepository, queryParams);
  }

  async createOne(placeInput: PlaceInput): Promise<QueryResponse> {
    try {
      const landlord = await this.landlordService.getOne({
        queryValue: placeInput.landlordId,
        queryType: 'id',
      });

      const currentTime = dayjs().valueOf();
      const place: Place = {
        name: placeInput.name.toLowerCase(),
        address: placeInput.address.toLowerCase(),
        city: placeInput.city.toLowerCase(),
        country: placeInput.country.toLowerCase(),
        type: placeInput.type,
        area: placeInput.area,
        status: PlaceStatus.FOR_RENT,
        termUnit: placeInput.termUnit,
        landlord: landlord,
        createdAt: currentTime,
        lastUpdate: currentTime,
      };
      const newPlace = await this.placeRepository.save(place);
      return {
        place: newPlace,
        message: 'Created place',
        type: ActionStatus.SUCCESSFUL,
      };
    } catch (error) {
      console.log('An error occurred while creating Place', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while creating Place',
      );
    }
  }

  async addAttributes(
    placeId: string,
    attributes: PlaceAttributeInput[],
  ): Promise<QueryResponse> {
    console.log(attributes);
    const place: Place = await this.getOne({
      queryValue: placeId,
      queryType: 'id',
    });
    const newAttributes: PlaceAttribute[] = await Promise.all(
      attributes.map(async (attribute) => {
        return {
          name: attribute.name,
          value: attribute.value.toLowerCase(),
          valueNumber: attribute.valueNumber ? attribute.valueNumber : null,
          place: place,
        };
      }),
    );
    try {
      await this.placeAttributeRepository.save(newAttributes);

      return {
        message: AttributesStatus.UPDATED,
        type: ActionStatus.SUCCESSFUL,
      };
    } catch (error) {
      console.error('An error occurred while adding attribute to landlord');
      console.log(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while adding attribute to landlord',
      );
    }
  }

  async updateOne(placeUpdateInput: PlaceUpdateInput): Promise<QueryResponse> {
    const place = await this.getOne({
      queryValue: placeUpdateInput.id,
      queryType: 'id',
    });
    try {
      place.lastUpdate = dayjs().valueOf();
      for (const [key, value] of Object.entries(placeUpdateInput)) {
        if (key === 'id') continue;
        place[key] = typeof value == 'string' ? value.toLowerCase() : value;
      }
      const updatedPlace = await this.placeRepository.save({ ...place });
      return {
        place: updatedPlace,
        message: 'Updated place',
        type: ActionStatus.SUCCESSFUL,
      };
    } catch (error) {
      console.error(
        `An error occurred while updating place ${placeUpdateInput.id}: ${error}`,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while updating place:',
        error,
      );
    }
  }

  async uploadPhotos(
    placeId: string,
    resolvedImages: Upload[],
  ): Promise<QueryResponse> {
    let imageValidation: boolean = true;
    const parsedImages: UploadFile[] = [];
    for (let i = 0; i < resolvedImages.length; i++) {
      const ext: string = extname(resolvedImages[i].filename);
      imageValidation = (Object.values(PhotoExtention) as string[]).includes(
        ext.toLowerCase(),
      );
      if (!imageValidation) {
        break;
      }
      parsedImages.push({
        createReadStream: resolvedImages[i].createReadStream,
        filename: uuidv4() + ext,
        id: placeId,
        uploadType: UploadType.PLACE_IMAGE,
      });
    }
    if (!imageValidation)
      return {
        message: `Invalid format of photo:`,
        type: ActionStatus.FAILED,
      };
    const imagesUrl: string[] = await uploadFilesFromStream(parsedImages);
    return this.updateOne({
      id: placeId,
      photos: imagesUrl,
    });
  }

  async deleteOne() {}

  async updateAttributes(updateInputArray: AttributeUpdateInput[]) {
    try {
      await Promise.all(
        updateInputArray.map(async (updateInput) => {
          const target = await this.placeAttributeRepository.findOneBy({
            id: updateInput.id,
          });
          if (updateInput.value) {
            target.value = updateInput.value.toLowerCase();
          }
          if (updateInput.valueNumber) {
            target.valueNumber = updateInput.valueNumber;
          }
          return this.placeAttributeRepository.save(target);
        }),
      );

      return {
        type: ActionStatus.SUCCESSFUL,
        message: 'Updated',
      };
    } catch (e) {
      console.error(e);
      return {
        type: ActionStatus.FAILED,
        message: 'Not updated',
      };
    }
  }
  async deleteAttributes(ids: string[]) {
    await Promise.all(
      ids.map((id) => {
        this.placeAttributeRepository.delete({ id: id });
      }),
    );
    return {
      type: ActionStatus.SUCCESSFUL,
      message: 'Deleted',
    };
  }

  async getCountries() {
    const data = await queryDistinct(this.placeRepository, 'country');
    const countries = data.map((record) => record['country']);

    const reponse: QueryResponse = {
      type: ActionStatus.SUCCESSFUL,
      message: 'Countries',
      customData: countries,
    };
    return reponse;
  }
  async getCitiesByCountry(country: string) {
    const condition: Condition = {
      key: 'country',
      value: country,
      operator: Operator.EQUAL,
    };
    const conditions = country ? [condition] : null;
    const data = await queryDistinct(this.placeRepository, 'city', conditions);
    console.log(data);
    const cities = data.map((record) => record['city']);
    const reponse: QueryResponse = {
      type: ActionStatus.SUCCESSFUL,
      message: 'Cities',
      customData: cities,
    };
    return reponse;
  }

  async getCities() {
    const data = await queryDistinct(this.placeRepository, 'city', null, [
      'country',
    ]);
    console.log(data);
    const cities = data.map((record) => {
      return record['city'] + '|' + record['country'];
    });
    const reponse: QueryResponse = {
      type: ActionStatus.SUCCESSFUL,
      message: 'Cities',
      customData: cities,
    };
    return reponse;
  }
  async checkExistById(placeId: string): Promise<Boolean> {
    const exists = await this.placeRepository.exists({
      where: { id: placeId },
    });
    return exists;
  }
}
