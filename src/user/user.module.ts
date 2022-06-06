import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
//import album,album schema
import {Album, AlbumSchema} from "../album/schemas/album.schema";
import {AlbumModule} from "../album/album.module";
import { UserService } from "./user.service";
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "./schemas/user.schema";
import { FileService} from "../file/file.service";

@Module({
    imports: [
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
        MongooseModule.forFeature([{name: Album.name, schema: AlbumSchema}]),
    ],
    controllers: [UserController],
    providers: [UserService, FileService]
})
export class UserModule {}