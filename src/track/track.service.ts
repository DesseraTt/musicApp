import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Track, TrackDocument} from "./schemas/track.schema";
import {Model, ObjectId} from "mongoose";
import {Comment, CommentDocument} from "./schemas/comment.schema";
import {Tag, TagDocument} from "./schemas/tag.schema";
import {CreateTrackDto} from "./dto/create-track.dto";
import {CreateCommentDto} from "./dto/create-comment.dto";
import {CreateTagDto} from "./dto/create-tag.dto";
import {FileService, FileType} from "../file/file.service";


@Injectable()
export class TrackService {

    constructor(@InjectModel(Track.name) private trackModel: Model<TrackDocument>,
                @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
                @InjectModel(Tag.name) private tagModel: Model<TagDocument>,
                private fileService: FileService) {}

    async create(dto: CreateTrackDto, picture, audio): Promise<Track> {
        const audioPath = this.fileService.createFile(FileType.AUDIO, audio);
        const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
        const track = await this.trackModel.create({...dto, listens: 0, audio:audioPath, picture:picturePath})
        return track;
    }

    async getAll(count = 20, offset = 0): Promise<Track[]> {
        const tracks = await this.trackModel.find().skip(Number(offset)).limit(Number(count));
        return tracks;
    }

    async getOne(id: ObjectId): Promise<Track> {
        const track = await (await this.trackModel.findById(id).populate('comments').populate('tags'));
        return track;
    }

    async delete(id: ObjectId): Promise<ObjectId> {
        const track = await this.trackModel.findByIdAndDelete(id);
        return track._id
    }

    async addComment(dto: CreateCommentDto): Promise<Comment> {
        const track = await this.trackModel.findById(dto.trackId);
        const comment = await this.commentModel.create({...dto})
        track.comments.push(comment._id)
        await track.save();
        return comment;
    }
    //add tag
    async addTag( dto: CreateTagDto):Promise<Tag>{
        const tag = await this.tagModel.create({...dto,count:0})
        const track = await this.trackModel.findById(tag.trackId).populate('tags');
        // console.log(track)
        if(track.tags.filter(t => t.text === tag.text).length === 0){
            console.log('tag not found')
            track.tags.push(tag._id);
            await track.save();
        }
        //else tag count +1
        else {
            // // track.tags.filter(t => t.text === tag.text)[0].count++;
            // console.log( track.tags.filter(t => t.text === tag.text)[0].count)
            // let val = track.tags.filter(t => t.text === tag.text)[0].count+1
            // await this.tagModel.findByIdAndUpdate({_id:tag.trackId},{$set:{count:val}},
            //     // function(err,doc){
            //     // if(err) console.log(err)
            //     // console.log(doc)
            //     // }
            //     );
            // console.log(this.tagModel.findById(tag.trackId).count);
            // await track.save(); //update tag count
            await this.tagModel.deleteOne(tag);
          
        }
        // console.log(track)
        return tag;
    }
    async listen(id: ObjectId) {
        const track = await this.trackModel.findById(id);
        track.listens += 1
        track.save()
    }

    async search(query: string): Promise<Track[]> {
        const tracks = await this.trackModel.find({
            name: {$regex: new RegExp(query, 'i')}
          
        });
        return tracks;
    }
    
    
}
