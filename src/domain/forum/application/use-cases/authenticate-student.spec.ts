import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { AuthenticateStudentUseCase } from "./authenticate-student";
import { FakeHasher } from "test/criptography/fake-hasher";
import { FakeEncrypter } from "test/criptography/fake-encrypter";
import { makeStudent } from "test/factories/make-student";

let inMemoryStudentsRepository: InMemoryStudentsRepository;

let fakeHasher: FakeHasher;

let fakeEncrypter: FakeEncrypter;

let sut: AuthenticateStudentUseCase;

describe("Authenticate student", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();

    fakeHasher = new FakeHasher();

    fakeEncrypter = new FakeEncrypter();

    sut = new AuthenticateStudentUseCase(
      inMemoryStudentsRepository,
      fakeHasher,
      fakeEncrypter
    );
  });

  it("should be able to authenticate a new student", async () => {
    const student = makeStudent({
      email: "johndoe@examplo.com",
      password: await fakeHasher.hash("123456"),
    });

    await inMemoryStudentsRepository.create(student);

    const result = await sut.execute({
      email: "johndoe@examplo.com",
      password: "123456",
    });

    expect(result.isRight()).toBe(true);

    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });
});
