import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  Question,
  QuestionProps,
} from "@/domain/forum/enterprise/entities/question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { PrismaQuestionMapper } from "@/infra/database/prisma/mappers/prisma-question-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityID
) {
  const uniqueSuffix = Math.random().toString(36).substring(2, 8);

  const question = Question.create(
    {
      title: faker.lorem.sentence(),
      authorId: new UniqueEntityID(),
      content: faker.lorem.text(),
      slug: Slug.create(`example-question-${uniqueSuffix}`),
      ...override,
    },
    id
  );

  return question;
}

@Injectable()
export class QuestionFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestion(
    data: Partial<QuestionProps> = {}
  ): Promise<Question> {
    const question = makeQuestion(data);

    await this.prisma.question.create({
      data: PrismaQuestionMapper.toPrisma(question),
    });

    return question;
  }
}
