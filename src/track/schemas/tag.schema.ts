import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from "mongoose";

export type TagDocument = Tag & Document;

@Schema()
export class Tag {

    @Prop()
    text: string;

    @Prop({type: mongoose.Schema.Types.ObjectId,ref:'Tag'})
    track: string;

}

export const TagSchema = SchemaFactory.createForClass(Tag);