//album dto
import { TrackDocument } from "src/track/schemas/track.schema";
 export class CreateAlbumDto {
    readonly name: string;
    readonly description: string;
    // readonly picture: string;
    // readonly tracks: TrackDocument[];
}
