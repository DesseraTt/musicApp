import {Body, Controller, Delete, Get, Param, Post, Query, UploadedFiles, UseInterceptors} from "@nestjs/common";
import {TrackService} from "./track.service";
import {CreateTrackDto} from "./dto/create-track.dto";
import {ObjectId} from "mongoose";
import {CreateCommentDto} from "./dto/create-comment.dto";
import {CreateTagDto} from "./dto/create-tag.dto";
import {FileFieldsInterceptor} from "@nestjs/platform-express";


@Controller('/tracks')
export class TrackController {
    constructor(private trackService: TrackService) {    }

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'picture', maxCount: 1 },
        { name: 'audio', maxCount: 1 },
    ]))
    create(@UploadedFiles() files, @Body() dto: CreateTrackDto) {
        const {picture, audio} = files
        return this.trackService.create(dto, picture[0], audio[0]);
    }

    @Get()
    getAll(@Query('count') count: number,
           @Query('offset') offset: number) {
        return this.trackService.getAll(count, offset)
    }

    @Get('/search')
    search(@Query('query') query: string) {
        return this.trackService.search(query)
    }

    @Get(':id')
    getOne(@Param('id') id: ObjectId) {
        return this.trackService.getOne(id);
    }

    @Delete(':id')
    delete(@Param('id') id: ObjectId) {
        return this.trackService.delete(id);
    }

    @Post('/comment')
    addComment(@Body() dto: CreateCommentDto) {
        // console.log(dto)
        return this.trackService.addComment(dto);
    }
    @Post('/tag')
    addTag(@Body() dto: CreateTagDto) {
        // console.log(dto)
        return this.trackService.addTag(dto);
    }

    @Post('/listen/:id')
    listen(@Param('id') id: ObjectId) {
        // console.log(id)
        return this.trackService.listen(id);
    }


    //search popular tracks
    @Post('/popular')
    getPopularTags(@Query('count') count: number) {
        return this.trackService.getPopularTags(count);
    }
    @Post('/recommend')
    recomendTracksByTags(@Body('tags') tags: ObjectId[]) {
        return this.trackService.recomendTracksByTags(tags);
    }
}
