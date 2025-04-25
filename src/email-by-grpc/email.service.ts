import { Injectable, OnModuleInit } from '@nestjs/common';

import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { EmailServiceClient } from '../proto/EmailService';
import { EmailRequest } from '../proto/EmailRequest';
import { EmailResponse } from '../proto/EmailResponse';
import { SubjectEmail } from '@common/constants';
import { Roles } from '@auth/dto/auth_input';
import { Tenant } from '@tenant/tenant.entity';
import { TenantService } from '@tenant/tenant.service';
import { LandlordService } from '@landlord/landlord.service';
import { Landlord } from '@landlord/landlord.entity';
import { EmailTemplates } from './email.template';

@Injectable()
export class EmailGrpcService implements OnModuleInit {
  private client: EmailServiceClient;

  onModuleInit() {
    const packageDefinition = protoLoader.loadSync('./src/proto/email.proto', {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });

    const protoDescriptor = grpc.loadPackageDefinition(
      packageDefinition,
    ) as any;
    const emailPackage = protoDescriptor.EmailService;

    this.client = new emailPackage(
      'localhost:50051',
      grpc.credentials.createInsecure(),
    );
  }
  constructor(
    private tenantService: TenantService,
    private landlordService: LandlordService,
  ) {}
  public async sendEmailToUser(
    userId: string,
    type: SubjectEmail,
    role: Roles,
  ): Promise<void> {
    switch (role) {
      case Roles.TENANT: {
        const tenant: Tenant = await this.tenantService.getOne({
          queryValue: userId,
          queryType: 'id',
          entityFields: ['mainTable.username'],
        });
        const message = EmailTemplates[type];
        const request: EmailRequest = {
          to: tenant.username,
          subject: message.subject,
          body: message.body('', '', ''),
        };
        this.sendEmail(request);
        break;
      }
      case Roles.LANDLORD: {
        const landlord: Landlord = await this.landlordService.getOne({
          queryValue: userId,
          queryType: 'id',
          entityFields: ['mainTable.username'],
        });
        const message = EmailTemplates[type];
        const request: EmailRequest = {
          to: landlord.username,
          subject: message.subject,
          body: message.body('', '', ''),
        };
        this.sendEmail(request);
        break;
      }
    }
    return;
  }

  public sendEmail(request: EmailRequest): Promise<EmailResponse> {
    return new Promise((resolve, reject) => {
      this.client.sendEmail(request, (err, response) => {
        if (err) return reject(err);
        resolve(response);
      });
    });
  }
  public async sendEmailTemplateTemplate(
    type: SubjectEmail,
    target: string,
  ): Promise<boolean> {
    const message = EmailTemplates[type];
    const request: EmailRequest = {
      to: target,
      subject: message.subject,
      body: message.body('', '', ''),
    };
    await this.sendEmail(request);
    return true;
  }
}
