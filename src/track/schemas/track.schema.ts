import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {Comment} from "./comment.schema";
import * as mongoose  from 'mongoose'
import {Tag} from "./tag.schema";

export type TrackDocument = Track & Document;

@Schema()
export class Track {
    @Prop()
    name: string;

    @Prop()
    author: string;

    @Prop()
    text: string;

    @Prop()
    listens: number;

    @Prop()
    picture: string;

    @Prop()
    audio: string;

    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]})
    comments: Comment[];

    @Prop({type:[{type:mongoose.Schema.Types.ObjectId, ref: 'Tag'}]})
    tag: Tag[];
}

export const TrackSchema = SchemaFactory.createForClass(Track);