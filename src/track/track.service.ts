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

    async getPopularTags(count = 20): Promise<Tag[]> {
        const tracks = await this.trackModel.find()
        .sort({listens:"descending"})
        .limit(Number(count))
        .populate('tags');
        let SetTags = [];
        tracks.forEach(track => {
            track.tags.forEach(tag => {
                if(SetTags.filter(t => t.text === tag.text).length === 0){
                    SetTags.push(tag);
                }
            })
        })
        return SetTags;
    }

    async recomendTracksByTags(tags:ObjectId[]): Promise<Track[]> {
        console.log(tags)
       //get tags by id
       let searchedTags = [];
        await tags.forEach(async (tagId) => {
        await console.log(tagId)
        let tag = await this.tagModel.findById(tagId);
        await console.log(tag)
        await searchedTags.push(tag);
         }
         )
        console.log(searchedTags)
         await  console.log(searchedTags)
         const tracks = await this.trackModel.find()
            .populate('tags');
        //get all tracks with same tags
        let recomendedTracks = [];
        tracks.forEach(track => {
            let count = 0;
            searchedTags.forEach(tag => {
                if(track.tags.filter(t => t.text === tag.text).length > 0){
                    count++;
                }
            })
            // if(count > searchedTags.length/2){
            if(count > 0){
                recomendedTracks.push(track._id);
            }
        })
        return recomendedTracks;
    }



}
