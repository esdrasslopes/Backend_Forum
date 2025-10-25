import { FetchAnswerCommentsUseCase } from "./fetch-answer-comments";

import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";

import { makeAnswerComment } from "test/factories/make-answer-comment";

let inMemoryCommentsRepository: InMemoryAnswerCommentsRepository;

let sut: FetchAnswerCommentsUseCase;

describe("Fetch answer comments", () => {
  beforeEach(() => {
    inMemoryCommentsRepository = new InMemoryAnswerCommentsRepository();

    sut = new FetchAnswerCommentsUseCase(inMemoryCommentsRepository);
  });

  it("should be able to fetch answer comments", async () => {
    await inMemoryCommentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityID("answer-1") })
    );

    await inMemoryCommentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityID("answer-1") })
    );

    await inMemoryCommentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityID("answer-1") })
    );

    const result = await sut.execute({
      page: 1,
      answerId: "answer-1",
    });

    expect(result.value?.answerComments).toHaveLength(3);
  });

  it("should be able to fetch paginated answer comments", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID("answer-1"),
        })
      );
    }

    const result = await sut.execute({
      page: 2,
      answerId: "answer-1",
    });

    expect(result.value?.answerComments).toHaveLength(2);
  });
});
