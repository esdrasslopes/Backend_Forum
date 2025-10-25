import { DomainEvent } from "@/core/events/domain-event";
import { QuestionComment } from "../entities/question-comment";

export class QuestionCommentCreatedEvent implements DomainEvent {
  public ocurredAt: Date;
  public question: QuestionComment;

  constructor(question: QuestionComment) {
    this.question = question;
    this.ocurredAt = new Date();
  }

  getAggregateId() {
    return this.question.id;
  }
}
