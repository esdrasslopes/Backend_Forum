import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { SendNotificationUseCase } from "../use-cases/send-notification";
import { AnswerCommentCreatedEvent } from "@/domain/forum/enterprise/events/answer-comment-created-event";

export class OnAnswerCommentCreated implements EventHandler {
  private answersRepository: AnswersRepository;
  private sendNotification: SendNotificationUseCase;

  constructor(
    answersRepository: AnswersRepository,
    sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions();
    this.answersRepository = answersRepository;
    this.sendNotification = sendNotification;
  }

  private async sendNewAnswerNotification({
    answer,
  }: AnswerCommentCreatedEvent) {
    const answerCreated = await this.answersRepository.findById(
      answer.id.toString()
    );

    if (answerCreated) {
      await this.sendNotification.execute({
        recipientId: answer?.authorId.toString(),
        title: "Novo comentário criado para sua resposta!",
        content: answer.excerpt,
      });
    }
  }

  setupSubscriptions() {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCommentCreatedEvent.name
    );
  }
}
