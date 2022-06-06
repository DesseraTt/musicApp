import {Module} from "@nestjs/common";
import {AlbumController} from "./album.controller";
import {AlbumService} from "./album.service";
import {MongooseModule, Schema} from "@nestjs/mongoose";
import {Album,AlbumSchema} from "./schemas/album.schema";
import {Comment, CommentSchema} from "../track/schemas/comment.schema";
import {FileService} from "../file/file.service";

@Module({
    imports: [
        MongooseModule.forFeature([{name: Album.name, schema: AlbumSchema}]),
        MongooseModule.forFeature([{name: Comment.name, schema: CommentSchema}]),
    ],
    controllers: [AlbumController],
    providers: [AlbumService, FileService]
})
export class AlbumModule {}
