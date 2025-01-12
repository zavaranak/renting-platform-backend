import { v4 as uuidv4 } from 'uuid';
import { Resolver, Query, Args, Info, Mutation } from '@nestjs/graphql';
import { Landlord } from './landlord.entity';
import { LandlordService } from './landlord.service';
import { GraphQLResolveInfo } from 'graphql';
import { getRelations } from 'src/common/query_relation_handler';
import { QueryParams, Condition } from 'src/common/query_function';
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
import { AttributeUpdateInput } from 'src/common/attribute_update_input';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import Upload from 'graphql-upload/Upload.js';

@Resolver(Landlord)
export class LandlordResolver {
  constructor(private landlordService: LandlordService) {}

  @Query(() => Landlord)
  async getOneLandlord(
    @Args('value') value: string,
    @Args('type') type: string,
    @Info() info,
  ) {
    const { relations, fields } = getRelations(info);
    const queryParams: QueryParams = {
      queryValue: value,
      queryType: type,
      relations: relations ? relations : [],
      entityFields: fields,
    };
    return await this.landlordService.getOne(queryParams);
  }

  @Query(() => [Landlord])
  async getLandlords(
    @Info() info: GraphQLResolveInfo,
    @Args({ name: 'conditions', type: () => [Condition], defaultValue: [] })
    conditions?: Condition[],
  ) {
    const { relations, fields } = getRelations(info);
    const queryParams: QueryParams = {
      relations: relations ? relations : [],
      entityFields: fields,
      conditions: conditions && conditions.length > 0 ? conditions : undefined,
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
  async removeLandlordAttributes(
    @Args({ name: 'attributeIds', type: () => [String] })
    attributeIds: string[],
  ) {
    return this.landlordService.deleteAttributes(attributeIds);
  }
  @Mutation(() => QueryResponse)
  async updateLandlordAttributes(
    @Args({ name: 'attibuteUpdateInput', type: () => [AttributeUpdateInput] })
    attibuteUpdateInput: AttributeUpdateInput[],
  ) {
    return this.landlordService.updateAttributes(attibuteUpdateInput);
  }

  @Mutation(() => QueryResponse)
  async setLandlordAvatar(
    @Args('landlordId') landlordId: string,
    @Args('image', { type: () => GraphQLUpload }) image: Upload,
    @Args('avatarId', { nullable: true, defaultValue: undefined })
    avatarId?: string,
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
    const filename = uuidv4() + extname(image.filename);
    const imageURL = await uploadFileFromStream(
      image.createReadStream,
      filename,
      landlordId,
      UploadType.PROFILE_IMAGE,
    );

    if (avatarId) {
      return await this.landlordService.updateAttribute(
        avatarId,
        imageURL.toString(),
      );
    }

    return await this.landlordService.addAttributes(landlordId, [
      { name: LandlordAttributeName.AVATAR, value: imageURL.toString() },
    ]);
  }
}
