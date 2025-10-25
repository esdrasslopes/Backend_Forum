import { FetchQuestionCommentsUseCase } from "./fetch-question-comments";

import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";

import { makeQuestionComment } from "test/factories/make-question-comment";

let inMemoryCommentsRepository: InMemoryQuestionCommentsRepository;

let sut: FetchQuestionCommentsUseCase;

describe("Fetch question comments", () => {
  beforeEach(() => {
    inMemoryCommentsRepository = new InMemoryQuestionCommentsRepository();

    sut = new FetchQuestionCommentsUseCase(inMemoryCommentsRepository);
  });

  it("should be able to fetch question comments", async () => {
    await inMemoryCommentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityID("question-1") })
    );

    await inMemoryCommentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityID("question-1") })
    );

    await inMemoryCommentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityID("question-1") })
    );

    const result = await sut.execute({
      page: 1,
      questionId: "question-1",
    });

    expect(result.value?.questionComments).toHaveLength(3);
  });

  it("should be able to fetch paginated question comments", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID("question-1"),
        })
      );
    }

    const result = await sut.execute({
      page: 2,
      questionId: "question-1",
    });

    expect(result.value?.questionComments).toHaveLength(2);
  });
});
