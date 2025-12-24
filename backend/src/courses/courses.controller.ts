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
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseResponseDto } from './dto/course-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Создать курс (только для администратора)',
    description: 'Администратор может создать новый курс в системе'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Курс успешно создан',
    type: CourseResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Ошибка валидации данных' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Необходима авторизация' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Недостаточно прав доступа' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Курс с таким названием уже существует' 
  })
  async create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Получить все курсы',
    description: 'Получить список всех доступных курсов (доступно всем)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Список курсов',
    type: [CourseResponseDto]
  })
  async findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'ID курса' })
  @ApiOperation({ 
    summary: 'Получить курс по ID',
    description: 'Получить детальную информацию о конкретном курсе'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Данные курса',
    type: CourseResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Курс не найден' 
  })
  async findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'ID курса' })
  @ApiOperation({ 
    summary: 'Изменить курс (только для администратора)',
    description: 'Администратор может редактировать данные курса'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Курс изменен',
    type: CourseResponseDto
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Необходима авторизация' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Недостаточно прав доступа' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Курс не найден' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Курс с таким названием уже существует' 
  })
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'ID курса' })
  @ApiOperation({ 
    summary: 'Удалить курс (только для администратора)',
    description: 'Администратор может удалить курс из системы'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Курс удален'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Необходима авторизация' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Недостаточно прав доступа' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Курс не найден' 
  })
  async delete(@Param('id') id: string) {
    return this.coursesService.delete(id);
  }
}

