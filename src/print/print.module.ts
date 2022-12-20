import { Module } from '@nestjs/common';
import { PrintService } from './print.service';
import { PrintResolver } from './print.resolver';

@Module({
  providers: [PrintService, PrintResolver]
})
export class PrintModule {}
