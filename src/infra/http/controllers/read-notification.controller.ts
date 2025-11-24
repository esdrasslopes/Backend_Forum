import {
  BadRequestException,
  Controller,
  Patch,
  Param,
  HttpCode,
} from "@nestjs/common";
import { QuestionDetailsPresenter } from "../presenters/question-details-presenter";
import { ReadNotificationUseCase } from "@/domain/notification/application/use-cases/read-notification";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";

@Controller("/notifications/:notificationId/read")
export class ReadNotificationController {
  constructor(private readNotifications: ReadNotificationUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param("notificationId") notificationId: string,
    @CurrentUser() user: UserPayload
  ) {
    const result = await this.readNotifications.execute({
      notificationId,
      recipientId: user.sub,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
