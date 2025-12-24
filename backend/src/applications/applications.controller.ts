import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Patch, 
  Delete,
  UseGuards 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiParam 
} from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { ApplicationResponseDto } from './dto/application-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('applications')
@Controller('applications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Создать новую заявку на курс',
    description: 'Пользователь создает заявку на обучение по курсу дополнительного образования'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Заявка успешно создана',
    type: ApplicationResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Ошибка валидации данных' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Необходима авторизация' 
  })
  async create(
    @CurrentUser() user: any,
    @Body() createApplicationDto: CreateApplicationDto
  ) {
    return this.applicationsService.create(user.userId, createApplicationDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ 
    summary: 'Получить все заявки (только для администратора)',
    description: 'Администратор может просматривать все заявки от всех пользователей'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Список всех заявок',
    type: [ApplicationResponseDto]
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Необходима авторизация' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Недостаточно прав доступа' 
  })
  async findAll() {
    return this.applicationsService.findAll();
  }

  @Get('my')
  @ApiOperation({ 
    summary: 'Получить свои заявки',
    description: 'Пользователь может просматривать список своих заявок'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Список заявок пользователя',
    type: [ApplicationResponseDto]
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Необходима авторизация' 
  })
  async findMy(@CurrentUser() user: any) {
    return this.applicationsService.findByUserId(user.userId);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'ID заявки' })
  @ApiOperation({ 
    summary: 'Получить заявку по ID',
    description: 'Получить детальную информацию о конкретной заявке'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Данные заявки',
    type: ApplicationResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Заявка не найдена' 
  })
  async findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiParam({ name: 'id', description: 'ID заявки' })
  @ApiOperation({ 
    summary: 'Изменить статус заявки (только для администратора)',
    description: 'Администратор может изменять статус заявки: NEW → IN_PROGRESS → COMPLETED'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Статус заявки изменен',
    type: ApplicationResponseDto
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Недостаточно прав доступа' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Заявка не найдена' 
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateApplicationStatusDto,
    @CurrentUser() user: any,
  ) {
    return this.applicationsService.updateStatus(id, updateStatusDto, user.userId, user.role);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'ID заявки' })
  @ApiOperation({ 
    summary: 'Удалить заявку',
    description: 'Пользователь может удалить свою заявку, администратор может удалить любую'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Заявка удалена'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Недостаточно прав доступа' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Заявка не найдена' 
  })
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.applicationsService.delete(id, user.userId, user.role);
  }
}

