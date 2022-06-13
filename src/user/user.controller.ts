//user controller

import { UserService } from './user.service';
import { UploadedFiles,Controller, Get, Param, Post, Body, Delete, Put, Query,UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDocument } from './schemas/user.schema';
import { ObjectId } from 'mongoose';
import {FileFieldsInterceptor} from "@nestjs/platform-express";

@Controller('/users')
export class UserController {
    constructor(private userService: UserService) { }
    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'picture', maxCount: 1 },
    ]))
    registration(@Body() dto: CreateUserDto) {
        return this.userService.registration(dto);
    }
    //user authorization
    @Post('/authorization')
    async authorization(@Body() user: Object) {
        return this.userService.authorization(user);
    }
    @Get()
    getAll(@Query('count') count: number,
              @Query('offset') offset: number) {
        return this.userService.getAll(count, offset)
    }
    
    @Get(':id')
    getOne(@Param('id') id: ObjectId) {
        return this.userService.getOne(id);
    }

    @Get('/search')
    search(@Query('query') query: string) {
        return this.userService.search(query)
    }

    @Delete(':id')
    delete(@Param('id') id: ObjectId) {
        return this.userService.delete(id);
    }
    //add album to user
    //get user albums
    @Post('/albums')
    getAlbums(@Body() user: Object) {
        return this.userService.getAlbums(user['userId']);
    }
  @Post('/addAlbum')
    addAlbum(@Body() obj: Object) {
        console.log(obj)
        // const [userId,albumId] = obj;
        return this.userService.addAlbum(obj["userId"],obj["albumId"]);
    }
    //add picture to user
    @Post('/addPicture')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'picture', maxCount: 1 },
    ]))
    async addPicture(@UploadedFiles() files,@Body() userId:ObjectId) {
        const { picture } = files;
        return this.userService.addPicture(userId, picture[0]);
    }
}
