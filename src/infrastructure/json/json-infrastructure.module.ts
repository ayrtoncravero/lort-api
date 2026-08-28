import { Global, Module } from '@nestjs/common';
import { JsonDataLoader } from './json-data-loader';

@Global()
@Module({
  providers: [JsonDataLoader],
  exports: [JsonDataLoader],
})
export class JsonInfrastructureModule {}
