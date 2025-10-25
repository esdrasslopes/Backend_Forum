import { DomainEvent } from "@/core/events/domain-event";
import { AnswerComment } from "../entities/answer-comment";

export class AnswerCommentCreatedEvent implements DomainEvent {
  public ocurredAt: Date;
  public answer: AnswerComment;

  constructor(answer: AnswerComment) {
    this.answer = answer;
    this.ocurredAt = new Date();
  }

  getAggregateId() {
    return this.answer.id;
  }
}
