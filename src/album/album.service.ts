//album service
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Album, AlbumDocument } from './schemas/album.schema';
import { Model, ObjectId } from 'mongoose';
import { CreateAlbumDto } from '../album/dto/create-album.dto';
import {FileService, FileType} from "../file/file.service";
import  {Track,TrackDocument} from "../track/schemas/track.schema";
import {TrackService} from "../track/track.service";
@Injectable()
export class AlbumService {
    constructor(
    @InjectModel(Album.name)
     private readonly albumModel: Model<AlbumDocument>,
     @InjectModel(Track.name) 
     private readonly trackModel:Model<TrackDocument>,
     private fileService: FileService) { }

    //create album
    async create(dto: CreateAlbumDto, picture): Promise<AlbumDocument> {
        const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
        const createdAlbum = await this.albumModel.create({...dto, picture: picturePath,date: new Date()});
     
        return createdAlbum;
    }
    //add track to album
    async addTrack(albumId: ObjectId, trackId) {
        // console.log(albumId,trackId)
     
        const album = await this.albumModel.findById(albumId);
           //check if track is already in album
              if(album.tracks.includes(trackId)){
                    console.log('track already in album')
                }   
                else{

        album.tracks.push(trackId);
                }
        await album.save();
    }
    //remove track from album
    // async removeTrack(albumId: ObjectId, trackId: ObjectId) {
    //     const album = await this.albumModel.findById(albumId);
    //     // console.log(album)
    //     const track = await this.trackModel.findById(trackId);
    //     // console.log(track)
    //     await console.log(typeof(album.tracks[0]),album.tracks[0], 0)
    //     await console.log(typeof(track._id),track._id,0)
    //     await console.log(album.tracks[0]==track)
    //     // console.log(album.tracks[1])
    //     album.tracks= await album.tracks.filter(el=>el!=track);
    //     // console.log(album.tracks)
    //     await album.save();
    //     return album;
    // }
    //remove track from album
    async removeTrack(obj) {
        let albumId=obj.albumId;
        let trackId=obj.trackId;
        const album = await this.albumModel.findById(albumId);
        album.tracks= await album.tracks.filter(el=>el!=trackId);
        await album.save(); 
        return album;
    }
    //get all albums
    async getAll(count = 10, offset = 0): Promise<AlbumDocument[]> {
        const albums = await this.albumModel.find().skip(Number(offset)).limit(Number(count));
        return albums;
    }
    //get one album
    async getOne(id: ObjectId): Promise<AlbumDocument> {
        console.log(id)
        const album = await ( this.albumModel.findById(id).populate('tracks'));
        return album;
    }
    //delete album
    async delete(id: ObjectId): Promise<ObjectId> {
        const album = await this.albumModel.findByIdAndDelete(id);
        return album._id
    }

    //search albums
    async search(query: string): Promise<AlbumDocument[]> {
        const albums = await this.albumModel.find({
            name: { $regex: new RegExp(query, 'i') }
        })
        return albums;
    }
}

