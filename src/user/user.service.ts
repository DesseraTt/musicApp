//user service
import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "./schemas/user.schema";
import {Album, AlbumDocument} from "../album/schemas/album.schema";
import {Model, ObjectId} from "mongoose";
import { CreateUserDto } from './dto/create-user.dto';
import { FileService } from '../file/file.service';
import { FileType } from '../file/file.service';

@Injectable()
export class UserService {
constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>,
            @InjectModel(Album.name) private readonly albumModel: Model<AlbumDocument>,
            private fileService: FileService) {}

    async registration(dto: CreateUserDto,): Promise<User> {
       
        //check if user exists
        const user = await this.userModel.findOne({email: dto.email});
        if (user) {
            throw new Error('User already exists');
        }
        let today=new Date();
        let curDate = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
        let  newUser = await this.userModel.create({...dto,date:curDate,picture:''});
        return newUser;
        
    }

    //user registration
    async authorization(inp:object): Promise<User> {
        //check if user exists
        const user = await this.userModel.findOne({email:inp["email"], password:inp["password"]});
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    async getAll(count = 10, offset = 0): Promise<User[]> {
        const users = await this.userModel.find();
        return users;
    }
    //get one user
    async getOne(id: ObjectId): Promise<User> {
        const user = await this.userModel.findById(id);
        return user;
    }
    //delete user
    async delete(id: ObjectId): Promise<ObjectId> {
        const user = await this.userModel.findByIdAndDelete(id);
        return user._id
    }
    //add album to user
    async addAlbum(userId: ObjectId, albumId): Promise<User> {
        const user = await this.userModel.findById(userId);
        const album = await this.albumModel.findById(albumId);
        user.albums.push(albumId);
        await user.save();
        return user;
    }
    //search user
    async search(query: string): Promise<User[]> {
        const users = await this.userModel.find({
            name: {$regex: new RegExp(query, 'i')}
        })
        return users;
    }
    //add photo to user
    async addPicture(userId: ObjectId, picture): Promise<User> {
        // const user = await this.userModel.findById(userId);
        let picturePath = this.fileService.createFile(FileType.IMAGE, picture);
        console.log('picturepath:'+picturePath);
        // await this.userModel.findByIdAndUpdate(userId, {picture: picturePath} );
    //    user.set(picture,picturePath);
        const user = await this.userModel.findById(userId,function(err,doc){
           if(err) console.log(err);
              doc.picture = picturePath;
                doc.save();
        });
        console.log(user);
        return user;
    }
    }


    


