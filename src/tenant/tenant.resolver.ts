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
import { QueryParams } from 'src/common/query_function';
import { extname } from 'path';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import * as Upload from 'graphql-upload/Upload.js';
import { uploadFileFromStream } from 'src/common/upload_files';
import { TenantAttributeName, UploadType } from 'src/common/constants';

@Resolver(Tenant)
export class TenantResolver {
  constructor(private readonly tenantService: TenantService) {}

  @Query(() => [Tenant])
  @UseGuards(JwtAuthGuard)
  async getAllTenants(
    @Context() context: any,
    @Info() info: GraphQLResolveInfo,
  ) {
    console.log(context.req.user);
    const relations = getRelations(info);
    return this.tenantService.getMany(relations);
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
      // where: where ? where : null,
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
  async uploadImage(
    @Args('tenantId') tenantId: string,
    @Args('image', { type: () => GraphQLUpload }) image: Upload,
  ) {
    const filename = 'profile-photo' + extname(image.filename);

    const imageURL = await uploadFileFromStream(
      image.createReadStream,
      filename,
      tenantId,
      UploadType.PROFILE_IMAGE,
    );
    return this.tenantService.addAttributes(tenantId, [
      { name: TenantAttributeName.AVATAR, value: imageURL.toString() },
    ]);
  }
}
