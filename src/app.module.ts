import {Module} from "@nestjs/common";
import {TrackModule} from "./track/track.module";
import {AlbumModule} from "./album/album.module";
import {UserModule} from "./user/user.module";
import {MongooseModule} from "@nestjs/mongoose";
import {FileModule} from "./file/file.module";
import * as path from 'path'
import {ServeStaticModule} from "@nestjs/serve-static";

@Module({
    imports: [
        ServeStaticModule.forRoot({rootPath: path.resolve(__dirname, 'static')}),
        MongooseModule.forRoot('mongodb://127.0.0.1:5000/myDB'),
        TrackModule,
        AlbumModule,
        UserModule,
        FileModule
    ]
})
export class AppModule {}
