//tag dto
import {ObjectId} from "mongoose";

export class CreateTagDto {
    readonly text: string;
    readonly trackId: ObjectId;
}
