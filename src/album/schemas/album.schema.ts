//album schema
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document} from 'mongoose';
import * as mongoose from 'mongoose'
import { Track } from 'src/track/schemas/track.schema';
export type AlbumDocument = Album & Document;

@Schema()
export class Album {
    @Prop()
    name: string;
    @Prop()
    artist: string;
    @Prop()
    year: number;
    @Prop()
    genre: string;
    @Prop()
    picture: string;
    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Track'}]})
    tracks:Track[];

}

export const AlbumSchema = SchemaFactory.createForClass(Album);
