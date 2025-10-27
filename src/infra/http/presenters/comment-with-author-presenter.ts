import { CommentWithAutor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-autor";

export class CommentWithAuthorPresenter {
  static toHTTP(commentWithAuthor: CommentWithAutor) {
    return {
      commentId: commentWithAuthor.commentId.toString(),
      authorId: commentWithAuthor.authorId.toString(),
      authorName: commentWithAuthor.authorName,
      content: commentWithAuthor.content,
      createdAt: commentWithAuthor.createdAt,
      updatedAt: commentWithAuthor.updatedAt,
    };
  }
}
