import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards,Response  } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dtos/create.dto";
import { UpdateUserDto } from "./dtos/update.dto";
import {JwtAuthGuard} from "../auth/jwtAuthGuard/jwtAuthGuard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags('Users')
@Controller('api/v1/users')
export class UserController{

    //khởi tạo controctor cho userService
    constructor(private userService: UserService) {}


    @Get()
    @UseGuards(JwtAuthGuard)
    findAll(){
        return this.userService.findAll();
    }

    @Get('/:id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id') id: number, @Response() res){
        const user = await this.userService.findOne(id);
        return res.status(200).json({
            status: 'success',
            message: 'get one user success',
            data: user,
          });
    }

    @Delete('/:id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: number){
        return this.userService.remove(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createUserDto: CreateUserDto){
        return this.userService.create(createUserDto);
    }

    @Put('/:id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto){
        return this.userService.update(id, updateUserDto);
    }
}