import {Body, Controller, Delete, Get, Param, Post, Query, UploadedFiles, UseInterceptors} from "@nestjs/common";
import {AlbumService} from "./album.service";
import {CreateAlbumDto} from "./dto/create-album.dto";
import {ObjectId} from "mongoose";

import {FileFieldsInterceptor} from "@nestjs/platform-express"

@Controller('/album')
export class AlbumController {
    constructor(private albumService: AlbumService) { }
    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'picture', maxCount: 1 },
    ]))
    create(@UploadedFiles() files,@Body() dto: CreateAlbumDto) {
        const {picture} = files;
        console.log(dto)
        return this.albumService.create(dto,picture[0]);
    }
    @Get()
    getAll(@Query('count') count: number,

            @Query('offset') offset: number) {
        return this.albumService.getAll(count, offset)
    }
    @Get('/search')
    search(@Query('query') query: string) {
        return this.albumService.search(query)
    }
    @Get(':id')
    getOne(@Param('id') id: ObjectId) {
        return this.albumService.getOne(id);
    }
    @Delete(':id')
    delete(@Param('id') id: ObjectId) {
        return this.albumService.delete(id);
    }
    //add album
    // @Post('/album')
    // addAlbum(@Body() dto: CreateAlbumDto) {
    //     return this.albumService.addAlbum(dto);
    // }
    //delete album
    @Delete('/album')
    deleteAlbum(@Body() albumId: ObjectId) {
        return this.albumService.delete(albumId);
    }
    //add track
    @Post('/track')
    addTrack(@Body() obj: Object) {
        console.log(obj)
        return this.albumService.addTrack(obj["albumId"],obj["trackId"]);
    }
    //remove track
    // @Delete('/track')
    // removeTrack(@Body() albumId:ObjectId, @Body() trackId: ObjectId) {
    //     return this.albumService.delete(albumId,trackId);
    // }
    //create album by tags in track
    // @Post('/album/tags')
    // createAlbumByTags(@Body() tags: string[]) {
    //     return this.albumService.createAlbumByTags(tags);
    // }
}