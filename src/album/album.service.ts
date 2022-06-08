//album service
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Album, AlbumDocument } from './schemas/album.schema';
import { Model, ObjectId } from 'mongoose';
import { CreateAlbumDto } from '../album/dto/create-album.dto';
import {FileService, FileType} from "../file/file.service";
import  {Track,TrackDocument} from "../track/schemas/track.schema";
@Injectable()
export class AlbumService {
    constructor(@InjectModel(Album.name)
     private readonly albumModel: Model<AlbumDocument>,
     private fileService: FileService) { }

    //create album
    async create(dto: CreateAlbumDto, picture): Promise<AlbumDocument> {
        const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
        const createdAlbum = await this.albumModel.create({...dto, picture: picturePath,date: new Date()});
     
        return createdAlbum;
    }
    //add track to album
    async addTrack(albumId: ObjectId, trackId) {
        const album = await this.albumModel.findById(albumId);
        album.tracks.push(trackId);
        await album.save();
    }
    // //remove track from album
    // async removeTrack(albumId: ObjectId, trackId: ObjectId) {
    //     const album = await this.albumModel.findById(albumId);
    //     const track = await trackModel.findById(trackId);
    //     album.tracks.filter(el=>el!=track);
    //     await album.save();
    // }
    //get all albums
    async getAll(count = 10, offset = 0): Promise<AlbumDocument[]> {
        const albums = await this.albumModel.find().skip(Number(offset)).limit(Number(count));
        return albums;
    }
    //get one album
    async getOne(id: ObjectId): Promise<AlbumDocument> {
        const album = await (await this.albumModel.findById(id)).populate('tracks');
        return album;
    }
    //delete album
    async delete(id: ObjectId): Promise<ObjectId> {
        const album = await this.albumModel.findByIdAndDelete(id);
        return album._id
    }
    //add comment to album
    // async addComment(dto: CreateAlbumDto): Promise<AlbumDocument> {
    //     const album = await this.albumModel.findById(dto.albumId);
    //     const comment = await this.albumModel.create({ ...dto })
    //     album.comments.push(comment._id)
    //     await album.save();
    //     return comment;
    // }
    //search albums
    async search(query: string): Promise<AlbumDocument[]> {
        const albums = await this.albumModel.find({
            name: { $regex: new RegExp(query, 'i') }
        })
        return albums;
    }
    // createAlbumByTags(tags: string[]) {
    //     return this.albumModel.create({
    //         name: "Album by tags",
    //         tags: tags,
    //         date: new Date()
    //     })
    // }

}

