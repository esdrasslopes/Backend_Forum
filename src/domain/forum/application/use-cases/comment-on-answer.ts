import { AnswersRepository } from "../repositories/answers-repository";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AnswerCommentsRepository } from "../repositories/answer-comments-repository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";

interface CommentOnAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
  content: string;
}

type CommentOnAnswerUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    answerComment: AnswerComment;
  }
>;

@Injectable()
export class CommentOnAnswerUseCase {
  private answersRepository: AnswersRepository;

  private answerCommentsRepository: AnswerCommentsRepository;

  constructor(
    answersRepository: AnswersRepository,
    answerCommentsRepository: AnswerCommentsRepository
  ) {
    this.answersRepository = answersRepository;
    this.answerCommentsRepository = answerCommentsRepository;
  }

  async execute({
    authorId,
    content,
    answerId,
  }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityID(authorId),
      content,
      answerId: new UniqueEntityID(answerId),
    });

    await this.answerCommentsRepository.create(answerComment);

    return right({ answerComment });
  }
}
