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
import { queryMany, QueryParams, queryOne } from 'src/common/query_function';
import { PlaceAttributeInput } from './dto/place_attribute_input';
import { QueryResponse } from 'src/common/reponse';
import * as Upload from 'graphql-upload/Upload.js';
import { UploadFile, uploadFilesFromStream } from 'src/common/upload_files';
import { extname } from 'path';

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

      const currentTime = Date.now();
      const place = {
        name: placeInput.name,
        address: placeInput.address,
        city: placeInput.city,
        type: placeInput.type,
        area: placeInput.area,
        price: placeInput.price,
        status: PlaceStatus.FOR_RENT,
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
          quantity: attribute.quantity,
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
      for (const [key, value] of Object.entries(placeUpdateInput)) {
        if (key === 'id') continue;
        place[key] = value;
      }
      console.log(place);
      const updatedPlace = await this.placeRepository.save({ ...place });
      return {
        place: updatedPlace,
        message: 'Updated place',
        type: ActionStatus.SUCCESSFUL,
      };
    } catch (error) {
      console.error(
        `An error occurred while updating place ${placeUpdateInput.id}`,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while updating place',
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
      const ext: string = extname(resolvedImages[i].filename).toLowerCase();
      imageValidation = (Object.values(PhotoExtention) as string[]).includes(
        ext,
      );
      if (!imageValidation) {
        break;
      }
      parsedImages.push({
        createReadStream: resolvedImages[i].createReadStream,
        filename: `place-photo-${i}` + ext,
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
}
