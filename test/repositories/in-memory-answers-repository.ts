import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { InMemoryAnswerAttachmentsRepository } from "./in-memory-answer-attachments-repository";
import { DomainEvents } from "@/core/events/domain-events";

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = [];

  constructor(
    private answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
  ) {}

  async create(answer: Answer) {
    this.items.push(answer);

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getItems()
    );

    DomainEvents.dispatchEventsFromAggregate(answer.id);
  }

  async delete(answer: Answer) {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id);

    this.items.splice(itemIndex, 1);

    await this.answerAttachmentsRepository.deleteManyByAnswerId(
      answer.id.toString()
    );
  }

  async findById(id: string) {
    const answer = this.items.find((item) => item.id.toString() === id);

    if (!answer) {
      return null;
    }

    return answer;
  }

  async save(answer: Answer) {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id);

    this.items[itemIndex] = answer;

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getNewItems()
    );

    await this.answerAttachmentsRepository.deleteMany(
      answer.attachments.getRemovedItems()
    );

    DomainEvents.dispatchEventsFromAggregate(answer.id);
  }

  async findManyByQuestionId({ page }: PaginationParams, questionId: string) {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return answers;
  }
}
