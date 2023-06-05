import { Controller } from '@nestjs/common';
import { EmployeeService } from './services/employee.services';

@Controller()
export class AppController {
  constructor(
    /**
     * initiate employeeboard every second query to view_employee_board
     */
    private employeeService: EmployeeService,
  ) {
    employeeService.EmployeeBoardAll();
  }
}
