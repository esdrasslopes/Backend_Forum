import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { SendNotificationUseCase } from "../use-cases/send-notification";
import { QuestionChosenEvent } from "@/domain/forum/enterprise/events/question-best-answer-chosen-event";
import { Injectable } from "@nestjs/common";

Injectable();
export class OnQuestionBestAnswerChosen implements EventHandler {
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

  private async sendQuestionBestAnswerNotification({
    question,
    bestAnswerId,
  }: QuestionChosenEvent) {
    const answer = await this.answersRepository.findById(
      bestAnswerId.toString()
    );

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer?.authorId.toString(),
        title: `Sua resposta foi escolhida`,
        content: `A resposta que você enviou em "${question.title
          .substring(0, 20)
          .concat("...")}" foi escolhida pelo autor!`,
      });
    }
  }

  setupSubscriptions() {
    DomainEvents.register(
      this.sendQuestionBestAnswerNotification.bind(this),
      QuestionChosenEvent.name
    );
  }
}
