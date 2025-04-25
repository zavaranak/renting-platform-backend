import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { EmailServiceClient as _EmailServiceClient, EmailServiceDefinition as _EmailServiceDefinition } from './EmailService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  EmailRequest: MessageTypeDefinition
  EmailResponse: MessageTypeDefinition
  EmailService: SubtypeConstructor<typeof grpc.Client, _EmailServiceClient> & { service: _EmailServiceDefinition }
}

