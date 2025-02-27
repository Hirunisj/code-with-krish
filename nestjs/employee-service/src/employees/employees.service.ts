import { Injectable } from '@nestjs/common';

@Injectable()
export class EmployeesService {

    public greeting(): string{
        const message: string = "Greeting from Employee "
        return message;
    }



}
