import {
  Args,
  Context,
  Query,
  Resolver,
  Info,
  Mutation,
} from '@nestjs/graphql';
import { TenantService } from './tenant.service';
import { Tenant } from './tenant.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/graphql.auth-guard';
import { getRelations } from 'src/common/query_relation_handler';
import { GraphQLResolveInfo } from 'graphql';
import { TenantAttributeInput } from './tenant_attribute_input';
import { QueryResponse } from 'src/common/reponse';
import { QueryParams, Condition } from 'src/common/query_function';
import { extname } from 'path';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import * as Upload from 'graphql-upload/Upload.js';
import { uploadFileFromStream } from 'src/common/upload_files';
import {
  ActionStatus,
  PhotoExtention,
  TenantAttributeName,
  UploadType,
} from 'src/common/constants';
import { v4 as uuidv4 } from 'uuid';
import { AttributeUpdateInput } from 'src/common/attribute_update_input';

@Resolver(Tenant)
export class TenantResolver {
  constructor(private readonly tenantService: TenantService) {}

  @Query(() => [Tenant])
  @UseGuards(JwtAuthGuard)
  async getAllTenants(
    @Context() context: any,
    @Info() info: GraphQLResolveInfo,
    @Args({ name: 'conditions', type: () => [Condition], defaultValue: [] })
    conditions?: Condition[],
  ) {
    console.log(context.req.user);
    const relations = getRelations(info);
    const queryParams: QueryParams = {
      relations: relations,
      where: conditions && conditions.length > 0 ? conditions : undefined,
    };
    return this.tenantService.getMany(queryParams);
  }
  @Query(() => Tenant)
  @UseGuards(JwtAuthGuard)
  async getOneTenant(
    @Args('value') value: string,
    @Args('type') type: string,
    @Info() info: GraphQLResolveInfo,
    @Context() context: any,
  ) {
    console.log(context.req.user);
    const relations = getRelations(info);
    const queryParams: QueryParams = {
      queryValue: value,
      queryType: type,
      relations: relations ? relations : [],
    };
    return this.tenantService.getOne(queryParams);
  }

  @Mutation(() => QueryResponse)
  async addTenantAtributes(
    @Args('tenantId') tenantId: string,
    @Args({ name: 'attributesInput', type: () => [TenantAttributeInput] })
    attributesInput: TenantAttributeInput[],
  ) {
    return this.tenantService.addAttributes(tenantId, attributesInput);
  }

  @Mutation(() => QueryResponse)
  async removeTenantAttributes(
    @Args({ name: 'attributeIds', type: () => [String] })
    attributeIds: string[],
  ) {
    return this.tenantService.deleteAttributes(attributeIds);
  }
  @Mutation(() => QueryResponse)
  async updateTenantAttributes(
    @Args({ name: 'attibuteUpdateInput', type: () => [AttributeUpdateInput] })
    attibuteUpdateInput: AttributeUpdateInput[],
  ) {
    return this.tenantService.updateAttributes(attibuteUpdateInput);
  }

  @Mutation(() => QueryResponse)
  async setTenantAvatar(
    @Args('tenantId') tenantId: string,
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
      tenantId,
      UploadType.PROFILE_IMAGE,
    );

    if (avatarId) {
      return this.tenantService.updateAttribute(avatarId, imageURL.toString());
    }

    return this.tenantService.addAttributes(tenantId, [
      { name: TenantAttributeName.AVATAR, value: imageURL.toString() },
    ]);
  }
}
