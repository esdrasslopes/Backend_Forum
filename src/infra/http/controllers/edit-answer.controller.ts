import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from "@nestjs/common";
import { EditAnswerUseCase } from "@/domain/forum/application/use-cases/edit-answer";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";

const editAnswerBodySchema = z.object({
  content: z.string(),
  attachmentsIds: z.array(z.string().uuid()).default([]),
});

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>;

@Controller("/answers/:id")
export class EditAnswerController {
  constructor(private editAnswer: EditAnswerUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(editAnswerBodySchema))
    body: EditAnswerBodySchema,
    @Param("id") answerId: string
  ) {
    const { content, attachmentsIds } = body;

    const { sub: userId } = user;

    const result = await this.editAnswer.execute({
      content,
      authorId: userId,
      attachmentsIds,
      answerId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
