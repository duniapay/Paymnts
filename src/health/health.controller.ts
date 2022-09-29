import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheckService, HttpHealthIndicator, HealthCheck, TypeOrmHealthIndicator, MemoryHealthIndicator } from '@nestjs/terminus';

@Controller('health')
@ApiTags('health')
export class HealthController {
  constructor(
    private memory: MemoryHealthIndicator,
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
      () => this.db.pingCheck('database'),
      /// process does have more than 150MB allocated.
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    ]);
  }
}
