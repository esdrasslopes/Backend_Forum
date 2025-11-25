import { FetchAnswerCommentsUseCase } from "./fetch-answer-comments";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { makeStudent } from "test/factories/make-student";

let inMemoryCommentsRepository: InMemoryAnswerCommentsRepository;

let inMemoryStudentsRepository: InMemoryStudentsRepository;

let sut: FetchAnswerCommentsUseCase;

describe("Fetch answer comments", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();

    inMemoryCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository
    );

    sut = new FetchAnswerCommentsUseCase(inMemoryCommentsRepository);
  });

  it("should be able to fetch answer comments", async () => {
    const student = makeStudent({ name: "John Doe" });

    inMemoryStudentsRepository.items.push(student);

    const comment1 = makeAnswerComment({
      answerId: new UniqueEntityID("answer-1"),
      authorId: student.id,
    });

    await inMemoryCommentsRepository.create(comment1);

    const comment2 = makeAnswerComment({
      answerId: new UniqueEntityID("answer-1"),
      authorId: student.id,
    });

    await inMemoryCommentsRepository.create(comment2);

    const comment3 = makeAnswerComment({
      answerId: new UniqueEntityID("answer-1"),
      authorId: student.id,
    });

    await inMemoryCommentsRepository.create(comment3);

    const result = await sut.execute({
      page: 1,
      answerId: "answer-1",
    });

    expect(result.value?.comments).toHaveLength(3);
    expect(result.value?.comments).toHaveLength(3);
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          authorName: "John Doe",
          commentId: comment1.id,
        }),
        expect.objectContaining({
          authorName: "John Doe",
          commentId: comment2.id,
        }),
        expect.objectContaining({
          authorName: "John Doe",
          commentId: comment3.id,
        }),
      ])
    );
  });

  it("should be able to fetch paginated answer comments", async () => {
    const student = makeStudent({ name: "John Doe" });

    inMemoryStudentsRepository.items.push(student);

    for (let i = 1; i <= 22; i++) {
      await inMemoryCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID("answer-1"),
          authorId: student.id,
        })
      );
    }

    const result = await sut.execute({
      page: 2,
      answerId: "answer-1",
    });

    expect(result.value?.comments).toHaveLength(2);
  });
});
