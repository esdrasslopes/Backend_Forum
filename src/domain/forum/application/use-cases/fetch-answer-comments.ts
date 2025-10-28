import { Either, right } from "@/core/either";
import { AnswerCommentsRepository } from "../repositories/answer-comments-repository";
import { Injectable } from "@nestjs/common";
import { CommentWithAutor } from "../../enterprise/entities/value-objects/comment-with-autor";

interface FetchAnswerCommentsUseCaseRequest {
  page: number;
  answerId: string;
}

type FetchAnswerCommentsUseCaseResponse = Either<
  null,
  {
    comments: CommentWithAutor[];
  }
>;

@Injectable()
export class FetchAnswerCommentsUseCase {
  private answerCommentsRepository: AnswerCommentsRepository;

  constructor(answerCommentsRepository: AnswerCommentsRepository) {
    this.answerCommentsRepository = answerCommentsRepository;
  }

  async execute({
    page,
    answerId,
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const comments =
      await this.answerCommentsRepository.findManyByAnswerIdWithAuthor(
        { page },
        answerId
      );

    return right({ comments });
  }
}
