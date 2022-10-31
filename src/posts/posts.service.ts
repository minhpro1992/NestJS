import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import Post from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(@InjectRepository(Post) private postsRepo: Repository<Post>) {}
  async create(createPostDto: CreatePostDto) {
    const post = await this.postsRepo.create(createPostDto);
    await this.postsRepo.save(post);
    return post;
  }

  findAll() {
    return this.postsRepo.find();
  }

  async findOne(id: number) {
    const post = await this.postsRepo.findOne({
      where: { id },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postsRepo.findOne({
      where: {
        id,
      },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    Object.assign(post, updatePostDto);
    return await this.postsRepo.save(post);
  }

  async remove(id: number) {
    const post = await this.postsRepo.findOne({
      where: { id },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return await this.postsRepo.remove(post);
  }
}
