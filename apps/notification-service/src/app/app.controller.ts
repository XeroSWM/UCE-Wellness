import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('notifications')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // ELIMINAMOS EL MÉTODO @Get() QUE DABA ERROR

  @Post('email')
  async sendEmail(@Body() body: any) {
    return this.appService.sendEmail(body);
  }
}