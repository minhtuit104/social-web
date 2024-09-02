import { Exclude, Expose, Transform } from 'class-transformer';
import { User } from '../../../typeorm/entities/User';

export class PostDTO {
  idPost: number;

  title: string;

  image: string;

  privacy: string;

  totalEmotion: number;

  totalComment: number;

  @Expose({ name: 'author' })
  @Transform(({ obj }) => obj.authorId.idUser)
  author: number;
}
