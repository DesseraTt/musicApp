import {Module} from "@nestjs/common";
import {TrackModule} from "./track/track.module";
import {MongooseModule} from "@nestjs/mongoose";
import {FileModule} from "./file/file.module";
import {ServeStaticModule} from "@nestjs/serve-static";
import * as path from "path";
import {HttpModule} from "@nestjs/axios";

@Module({
    imports:
        [
        MongooseModule.forRoot('mongodb+srv://DesseraT:CJ0Lsp3rXw5LpOVb@cluster0.ohlln.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'),
        TrackModule,
            FileModule,
            ServeStaticModule.forRoot({rootPath: path.resolve(__dirname, 'static'),}),
    ]
})
export class AppModule{}