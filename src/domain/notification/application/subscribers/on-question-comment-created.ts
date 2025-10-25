import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { QuestionsRepository } from "@/domain/forum/application/repositories/question-repository";
import { SendNotificationUseCase } from "../use-cases/send-notification";
import { QuestionCommentCreatedEvent } from "@/domain/forum/enterprise/events/question-comment-created-event";

export class OnQuestionCommentCreated implements EventHandler {
  private questionsRepository: QuestionsRepository;
  private sendNotification: SendNotificationUseCase;

  constructor(
    questionsRepository: QuestionsRepository,
    sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions();
    this.questionsRepository = questionsRepository;
    this.sendNotification = sendNotification;
  }

  private async sendNewQuestionNotification({
    question,
  }: QuestionCommentCreatedEvent) {
    const questionCreated = await this.questionsRepository.findById(
      question.id.toString()
    );

    if (questionCreated) {
      await this.sendNotification.execute({
        recipientId: question?.authorId.toString(),
        title: "Novo comentário criado para sua pergunta!",
        content: question.excerpt,
      });
    }
  }

  setupSubscriptions() {
    DomainEvents.register(
      this.sendNewQuestionNotification.bind(this),
      QuestionCommentCreatedEvent.name
    );
  }
}
