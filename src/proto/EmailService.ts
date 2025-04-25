// Original file: src/proto/email.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { EmailRequest as _EmailRequest, EmailRequest__Output as _EmailRequest__Output } from './EmailRequest';
import type { EmailResponse as _EmailResponse, EmailResponse__Output as _EmailResponse__Output } from './EmailResponse';

export interface EmailServiceClient extends grpc.Client {
  SendEmail(argument: _EmailRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_EmailResponse__Output>): grpc.ClientUnaryCall;
  SendEmail(argument: _EmailRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_EmailResponse__Output>): grpc.ClientUnaryCall;
  SendEmail(argument: _EmailRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_EmailResponse__Output>): grpc.ClientUnaryCall;
  SendEmail(argument: _EmailRequest, callback: grpc.requestCallback<_EmailResponse__Output>): grpc.ClientUnaryCall;
  sendEmail(argument: _EmailRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_EmailResponse__Output>): grpc.ClientUnaryCall;
  sendEmail(argument: _EmailRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_EmailResponse__Output>): grpc.ClientUnaryCall;
  sendEmail(argument: _EmailRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_EmailResponse__Output>): grpc.ClientUnaryCall;
  sendEmail(argument: _EmailRequest, callback: grpc.requestCallback<_EmailResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface EmailServiceHandlers extends grpc.UntypedServiceImplementation {
  SendEmail: grpc.handleUnaryCall<_EmailRequest__Output, _EmailResponse>;
  
}

export interface EmailServiceDefinition extends grpc.ServiceDefinition {
  SendEmail: MethodDefinition<_EmailRequest, _EmailResponse, _EmailRequest__Output, _EmailResponse__Output>
}
