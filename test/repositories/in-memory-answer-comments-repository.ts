import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { InMemoryStudentsRepository } from "./in-memory-students-repository";
import { CommentWithAutor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-autor";

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public items: AnswerComment[] = [];

  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  async create(answerComment: AnswerComment): Promise<void> {
    this.items.push(answerComment);

    DomainEvents.dispatchEventsFromAggregate(answerComment.id);
  }

  async findById(id: string) {
    const answerComment = this.items.find((item) => item.id.toString() === id);

    if (!answerComment) {
      return null;
    }

    return answerComment;
  }

  async delete(answerComment: AnswerComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === answerComment.id
    );

    this.items.splice(itemIndex, 1);
  }

  async findManyByAnswerId({ page }: PaginationParams, id: string) {
    const answer = this.items
      .filter((item) => item.answerId.toString() === id)
      .slice((page - 1) * 20, page * 20);

    return answer;
  }

  async findManyByAnswerIdWithAuthor(
    { page }: PaginationParams,
    answerId: string
  ) {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)
      .map((comment) => {
        const author = this.studentsRepository.items.find((student) => {
          return student.id.equals(comment.authorId);
        });

        if (!author) {
          throw new Error(
            `Author with ID "${comment.authorId.toString()}" does not exist.`
          );
        }

        return CommentWithAutor.create({
          content: comment.content,
          commentId: comment.id,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          authorId: comment.authorId,
          authorName: author.name,
        });
      });

    return answerComments;
  }
}
