import {Module} from "@nestjs/common";
import {AlbumController} from "./album.controller";
import {AlbumService} from "./album.service";
import {MongooseModule, Schema} from "@nestjs/mongoose";
import {Album,AlbumSchema} from "./schemas/album.schema";
import {Comment, CommentSchema} from "../track/schemas/comment.schema";
import {FileService} from "../file/file.service";
import { Track,TrackSchema } from "src/track/schemas/track.schema";

@Module({
    imports: [
        MongooseModule.forFeature([{name: Album.name, schema: AlbumSchema}]),
        MongooseModule.forFeature([{name: Track.name, schema: TrackSchema}]),
        MongooseModule.forFeature([{name: Comment.name, schema: CommentSchema}]),
    ],
    controllers: [AlbumController],
    providers: [AlbumService, FileService]
})
export class AlbumModule {}
