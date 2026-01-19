import { Controller, Get, Param } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TelemetryService } from '../../application/telemetry.service';

@Controller('telemetry')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  // 1. MQTT (Para sensores reales)
  @MessagePattern('sensor/update')
  handleSensorData(@Payload() data: any) {
    return this.telemetryService.processTelemetry(data);
  }

  // 2. HTTP: Historial (Para gráficos estáticos) - ¡ESTE FALTABA!
  @Get('history/:userId')
  getHistory(@Param('userId') userId: string) {
    return this.telemetryService.getWeeklyHistory(userId);
  }

  // 3. HTTP: En Vivo (Para el Smartwatch) - ¡ESTE FALTABA!
  @Get('live/:userId')
  getLiveReading(@Param('userId') userId: string) {
    return this.telemetryService.getRealTimeData(userId);
  }
}