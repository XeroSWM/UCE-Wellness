import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TelemetryService } from '../../application/telemetry.service';

@Controller()
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  // Escuchamos el tema "sensor/update"
  @MessagePattern('sensor/update')
  handleSensorData(@Payload() data: any) {
    return this.telemetryService.processTelemetry(data);
  }
}