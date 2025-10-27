import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { CommentWithAutor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-autor";
import { Comment as PrismaComment, User as PrismaUser } from "@prisma/client";

type PrismaCommentWithAuthor = PrismaComment & {
  author: PrismaUser;
};

export class PrismaCommentWithAuthorMapper {
  static toDomain(raw: PrismaCommentWithAuthor): CommentWithAutor {
    return CommentWithAutor.create({
      commentId: new UniqueEntityID(raw.id),
      authorId: new UniqueEntityID(raw.author.id),
      authorName: raw.author.name,
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updateAt,
    });
  }
}
