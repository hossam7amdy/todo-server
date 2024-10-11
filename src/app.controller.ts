import { Controller, Get, Response } from '@nestjs/common';
import homeTemplate from './templates/home.template';
import configuration from './config/configuration';

@Controller()
export class AppController {
  constructor() { }

  @Get('/')
  home(@Response() res) {
    const homePage = homeTemplate(configuration().serverUrl + '/api/docs');

    return res.send(homePage);
  }

  @Get('/healthz')
  healthz(): string {
    return 'Status 🤞';
  }
}
