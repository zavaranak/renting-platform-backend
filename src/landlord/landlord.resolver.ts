import { Resolver, Query, Args, Info, Mutation } from '@nestjs/graphql';
import { Landlord } from './landlord.entity';
import { LandlordService } from './landlord.service';
import { GraphQLResolveInfo } from 'graphql';
import { getRelations } from 'src/common/query_relation_handler';
import { QueryParams } from 'src/common/query_function';
import { QueryResponse } from 'src/common/reponse';
import { LandlordAttributeInput } from './landlord_attribute_input';
import {
  LandlordAttributeName,
  UploadType,
  ActionStatus,
  PhotoExtention,
} from 'src/common/constants';
import { uploadFileFromStream } from 'src/common/upload_files';
import { extname } from 'path';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import * as Upload from 'graphql-upload/Upload.js';

@Resolver(Landlord)
export class LandlordResolver {
  constructor(private landlordService: LandlordService) {}

  @Query(() => Landlord)
  async getOneLandlord(
    @Args('value') value: string,
    @Args('type') type: string,
    @Info() info,
  ) {
    const relations = getRelations(info);
    const queryParams: QueryParams = {
      queryValue: value,
      queryType: type,
      relations: relations ? relations : [],
    };
    return await this.landlordService.getOne(queryParams);
  }

  @Query(() => [Landlord])
  async getAllLandlord(@Info() info: GraphQLResolveInfo) {
    const relations = getRelations(info);
    const queryParams: QueryParams = {
      relations: relations ? relations : [],
    };
    return await this.landlordService.getMany(queryParams);
  }

  @Mutation(() => QueryResponse)
  async addLandlordAtributes(
    @Args('landlordId') lanlordId: string,
    @Args({ name: 'attributesInput', type: () => [LandlordAttributeInput] })
    attributesInput: LandlordAttributeInput[],
  ) {
    return this.landlordService.addAttributes(lanlordId, attributesInput);
  }

  @Mutation(() => QueryResponse)
  async setLandlordAvatar(
    @Args('landlordId') landlordId: string,
    @Args('image', { type: () => GraphQLUpload }) image: Upload,
  ) {
    const ext: string = extname(image.filename).toLowerCase();
    const imageValidation = (
      Object.values(PhotoExtention) as string[]
    ).includes(ext);
    if (!imageValidation)
      return {
        message: `Invalid format of photo: ${ext}`,
        type: ActionStatus.FAILED,
      };
    const filename = 'profile-photo' + extname(image.filename);
    const imageURL = await uploadFileFromStream(
      image.createReadStream,
      filename,
      landlordId,
      UploadType.PROFILE_IMAGE,
    );
    return this.landlordService.addAttributes(landlordId, [
      { name: LandlordAttributeName.AVATAR, value: imageURL.toString() },
    ]);
  }
}
