import { Inject } from '@nestjs/common';
import { Args, Mutation, registerEnumType, Resolver } from '@nestjs/graphql';
import { EmailGrpcService } from './email.service';
import { EmailRequest, EmailRequestInput } from 'src/proto/EmailRequest';
import { SubjectEmail } from '@common/constants';

registerEnumType(SubjectEmail, { name: 'SubjectEmail' });
@Resolver()
export class EmailResolver {
  constructor(private readonly emailService: EmailGrpcService) {}

  @Mutation(() => Boolean, {
    description: 'Отправка email сообщения',
  })
  async sendEmail(
    @Args('email_request') emailRequest: EmailRequestInput,
  ): Promise<any> {
    return await this.emailService.sendEmail(emailRequest);
  }
  @Mutation(() => Boolean, {
    description: 'Отправка email сообщения с шаблоном',
  })
  async sendEmailTemplate(
    @Args('type') type: SubjectEmail,
    @Args('email') email: string,
  ): Promise<any> {
    return await this.emailService.sendEmailTemplateTemplate(type, email);
  }
}
