import { Controller, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";



@ApiTags('auth-service')
@Controller('auth')
export class AuthController {

    @ApiOperation({summary: 'new User', description: 'creation new User'})
    //@ApiBody({type: })
    @ApiResponse({status: 201, description: 'user was successfully created'})
    @Post('/create_new_user')
    async createNewUser(data: any): Promise<any> {
        
    }
}