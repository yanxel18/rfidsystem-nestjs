import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { EmployeeBoardViewLoop } from './interval-data/employeeboard-interval';
 
 
@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private empBoardViewLoop: EmployeeBoardViewLoop) {
      empBoardViewLoop.EmployeeBoardAll();
  }
 

} 
