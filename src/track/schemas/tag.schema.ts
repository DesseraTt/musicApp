import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {Track} from "./track.schema";
// import User from "./";
import * as mongoose from 'mongoose'

export type TagDocument = Tag & Document;

@Schema()
export class Tag {
    @Prop()
    text: string;
    
    @Prop()
    count: number;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Track'})
    trackId: Track;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
