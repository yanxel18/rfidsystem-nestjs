import { Controller } from '@nestjs/common'; 
import { EmployeeBoardViewLoop } from './interval-data/employeeboard-interval';
 
 
@Controller()
export class AppController {
  constructor(
    /**
     * initiate employeeboard every second query to view_employee_board
     */
    private empBoardViewLoop: EmployeeBoardViewLoop) {
      empBoardViewLoop.EmployeeBoardAll(); 
  }
 

} 
