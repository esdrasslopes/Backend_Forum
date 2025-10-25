import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from "@nestjs/common";
import { EditQuestionUseCase } from "@/domain/forum/application/use-cases/edit-question";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";

const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachmentsIds: z.array(z.string().uuid()).default([]),
});

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>;

@Controller("/questions/:id")
export class EditQuestionController {
  constructor(private editQuestion: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(editQuestionBodySchema))
    body: EditQuestionBodySchema,
    @Param("id") questionId: string
  ) {
    const { content, title, attachmentsIds } = body;

    const { sub: userId } = user;

    const result = await this.editQuestion.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds,
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
