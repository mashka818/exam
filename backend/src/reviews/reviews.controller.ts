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
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewResponseDto } from './dto/review-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Создать отзыв',
    description: 'Пользователь может оставить отзыв о качестве образовательных услуг'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Отзыв успешно создан',
    type: ReviewResponseDto
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
    @Body() createReviewDto: CreateReviewDto
  ) {
    return this.reviewsService.create(user.userId, createReviewDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Получить все отзывы',
    description: 'Получить список всех отзывов (доступно всем пользователям)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Список отзывов',
    type: [ReviewResponseDto]
  })
  async findAll() {
    return this.reviewsService.findAll();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Получить свои отзывы',
    description: 'Пользователь может просматривать список своих отзывов'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Список отзывов пользователя',
    type: [ReviewResponseDto]
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Необходима авторизация' 
  })
  async findMy(@CurrentUser() user: any) {
    return this.reviewsService.findByUserId(user.userId);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'ID отзыва' })
  @ApiOperation({ 
    summary: 'Получить отзыв по ID',
    description: 'Получить детальную информацию о конкретном отзыве'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Данные отзыва',
    type: ReviewResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Отзыв не найден' 
  })
  async findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'ID отзыва' })
  @ApiOperation({ 
    summary: 'Изменить отзыв',
    description: 'Пользователь может редактировать свой отзыв'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Отзыв изменен',
    type: ReviewResponseDto
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Недостаточно прав доступа' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Отзыв не найден' 
  })
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @CurrentUser() user: any,
  ) {
    return this.reviewsService.update(id, user.userId, updateReviewDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'ID отзыва' })
  @ApiOperation({ 
    summary: 'Удалить отзыв',
    description: 'Пользователь может удалить свой отзыв, администратор может удалить любой'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Отзыв удален'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Недостаточно прав доступа' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Отзыв не найден' 
  })
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.reviewsService.delete(id, user.userId, user.role);
  }
}

