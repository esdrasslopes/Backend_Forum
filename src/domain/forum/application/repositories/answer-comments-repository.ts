import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { CommentWithAutor } from "../../enterprise/entities/value-objects/comment-with-autor";

export abstract class AnswerCommentsRepository {
  abstract create(answerComment: AnswerComment): Promise<void>;
  abstract findById(id: string): Promise<AnswerComment | null>;
  abstract findManyByAnswerId(
    params: PaginationParams,
    answerId: string
  ): Promise<AnswerComment[]>;
  abstract findManyByAnswerIdWithAuthor(
    params: PaginationParams,
    answerId: string
  ): Promise<CommentWithAutor[]>;
  abstract delete(answerComment: AnswerComment): Promise<void>;
}
