import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Patch, 
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiBody
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
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/courses',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        return cb(new Error('Только изображения разрешены!'), false);
      }
      cb(null, true);
    },
  }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        teacher: { type: 'string' },
        description: { type: 'string' },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ 
    summary: 'Создать курс (только для администратора)',
    description: 'Администратор может создать новый курс в системе. Можно загрузить изображение.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Курс успешно создан',
    type: CourseResponseDto
  })
  async create(
    @Body() createCourseDto: CreateCourseDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createCourseDto.image = `/uploads/courses/${file.filename}`;
    }
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
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/courses',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        return cb(new Error('Только изображения разрешены!'), false);
      }
      cb(null, true);
    },
  }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        teacher: { type: 'string' },
        description: { type: 'string' },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
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
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      updateCourseDto.image = `/uploads/courses/${file.filename}`;
    }
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





