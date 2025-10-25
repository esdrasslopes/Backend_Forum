import { CommentOnAnswerUseCase } from "./comment-on-answer";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { makeAnswer } from "test/factories/make-answer";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;

let inMemoryAnswerRepository: InMemoryAnswersRepository;

let inMemoryAnswersAttachmentsRepository: InMemoryAnswerAttachmentsRepository;

let sut: CommentOnAnswerUseCase;

describe("Comment on answer", () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();

    inMemoryAnswersAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();

    inMemoryAnswerRepository = new InMemoryAnswersRepository(
      inMemoryAnswersAttachmentsRepository
    );

    sut = new CommentOnAnswerUseCase(
      inMemoryAnswerRepository,
      inMemoryAnswerCommentsRepository
    );
  });

  it("should be able to comment on answer", async () => {
    const answer = makeAnswer();

    await inMemoryAnswerRepository.create(answer);

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: "Novo comentário",
    });

    expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual(
      "Novo comentário"
    );
  });
});
