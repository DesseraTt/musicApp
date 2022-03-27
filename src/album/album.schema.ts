import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document} from 'mongoose';
import * as mongoose  from 'mongoose'

export type TrackDocument = Track & Document;

@Schema()
export class Track {
    @Prop()
    name: string;

    @Prop()
    author: string;

    @Prop()
    listens: number;

    @Prop()
    picture: string;

    @Prop({type:[{type:mongoose.Schema.Types.ObjectId, ref: 'Tracks'}]})
    tracks: Track[];

}

export const TrackSchema = SchemaFactory.createForClass(Track);