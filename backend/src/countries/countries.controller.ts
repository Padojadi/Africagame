import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CountriesService } from './countries.service';
import { Public } from '../common/decorators';

@ApiTags('countries')
@Controller('countries')
export class CountriesController {
  constructor(private countriesService: CountriesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Liste des pays partenaires' })
  findAll() {
    return this.countriesService.findAll();
  }
}
