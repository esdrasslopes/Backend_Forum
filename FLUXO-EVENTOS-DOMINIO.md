# Fluxo de Eventos de Domínio: Answer → Notification

## Visão Geral do Fluxo

```
AnswerQuestionUseCase.execute()
    │
    ├─► Answer.create() 
    │       │
    │       └─► addDomainEvent(AnswerCreatedEvent)
    │               │
    │               └─► DomainEvents.markAggregateForDispatch(answer)
    │
    └─► answersRepository.create(answer)
            │
            └─► DomainEvents.dispatchEventsFromAggregate(answer.id)
                    │
                    └─► dispatch(AnswerCreatedEvent)
                            │
                            └─► OnAnswerCreated.sendNewAnswerNotification()
                                    │
                                    └─► SendNotificationUseCase.execute()
                                            │
                                            └─► notificationsRepository.create(notification)
```

---

## Passo a Passo Detalhado

### 1. AnswerQuestionUseCase.execute()
**Arquivo:** `src/domain/forum/application/use-cases/answer-question.ts`

```typescript
async execute({ authorId, questionId, content, attachmentsIds }) {
  const answer = Answer.create({
    content,
    authorId: new UniqueEntityID(authorId),
    questionId: new UniqueEntityID(questionId),
  });

  // ... attachments

  await this.answersRepository.create(answer);

  return right({ answer });
}
```

---

### 2. Answer.create() - Criação da Entidade e Registro do Evento
**Arquivo:** `src/domain/forum/enterprise/entities/answer.ts`

```typescript
static create(props, id?: UniqueEntityID) {
  const answer = new Answer({ ...props }, id);

  const isNewAnswer = !id;  // Se não tem ID, é uma nova answer

  if (isNewAnswer) {
    answer.addDomainEvent(new AnswerCreatedEvent(answer));  // ◄── EVENTO CRIADO
  }

  return answer;
}
```

**O que acontece:**
- Se a Answer é nova (sem ID), cria um `AnswerCreatedEvent`
- Chama `addDomainEvent()` herdado de `AggregateRoot`

---

### 3. AggregateRoot.addDomainEvent() - Marca o Aggregate para Dispatch
**Arquivo:** `src/core/entities/aggregate-root.ts`

```typescript
export abstract class AggregateRoot<Props> extends Entity<Props> {
  private _domainEvents: DomainEvent[] = [];

  protected addDomainEvent(domainEvent: DomainEvent) {
    this.domainEvents.push(domainEvent);  // Adiciona na lista de eventos

    DomainEvents.markAggregateForDispatch(this);  // ◄── MARCA PARA DISPATCH
  }
}
```

**O que acontece:**
- O evento é adicionado à lista `_domainEvents` da entidade
- O aggregate (Answer) é marcado para dispatch no `DomainEvents`

---

### 4. DomainEvents.markAggregateForDispatch() - Armazena o Aggregate
**Arquivo:** `src/core/events/domain-events.ts`

```typescript
public static markAggregateForDispatch(aggregate: AggregateRoot<unknown>) {
  const aggregateFound = !!this.findMarkedAggregateID(aggregate.id);

  if (!aggregateFound) {
    this.markedAggregates.push(aggregate);  // ◄── ARMAZENA NA LISTA
  }
}
```

**O que acontece:**
- O aggregate é armazenado em `markedAggregates[]`
- Os eventos ainda NÃO são disparados (só marcados)

---

### 5. InMemoryAnswersRepository.create() - Persiste e Dispara Eventos
**Arquivo:** `test/repositories/in-memory-answers-repository.ts`

```typescript
async create(answer: Answer) {
  this.items.push(answer);  // Persiste

  await this.answerAttachmentsRepository.createMany(
    answer.attachments.getItems()
  );

  DomainEvents.dispatchEventsFromAggregate(answer.id);  // ◄── DISPARA EVENTOS
}
```

**O que acontece:**
- Após persistir a Answer, chama `dispatchEventsFromAggregate()`
- Isso garante que eventos só disparam APÓS persistência bem-sucedida

---

### 6. DomainEvents.dispatchEventsFromAggregate() - Executa os Handlers
**Arquivo:** `src/core/events/domain-events.ts`

```typescript
public static dispatchEventsFromAggregate(id: UniqueEntityID) {
  const aggregate = this.findMarkedAggregateID(id);

  if (aggregate) {
    this.dispatchAggregateEvents(aggregate);  // ◄── DISPARA CADA EVENTO
    aggregate.clearEvents();
    this.removeAggregateFromMarkedDispatchList(aggregate);
  }
}

private static dispatchAggregateEvents(aggregate: AggregateRoot<unknown>) {
  aggregate.domainEvents.forEach((event: DomainEvent) =>
    this.dispatch(event)
  );
}

private static dispatch(event: DomainEvent) {
  const eventClassName = event.constructor.name;  // "AnswerCreatedEvent"

  if (eventClassName in this.handlersMap) {
    const handlers = this.handlersMap[eventClassName];

    for (const handler of handlers) {
      handler(event);  // ◄── CHAMA CADA HANDLER REGISTRADO
    }
  }
}
```

**O que acontece:**
- Encontra o aggregate marcado pelo ID
- Itera sobre todos os `domainEvents` do aggregate
- Para cada evento, busca os handlers registrados no `handlersMap`
- Executa cada handler passando o evento

---

### 7. OnAnswerCreated - Subscriber que Escuta o Evento
**Arquivo:** `src/domain/notification/application/subscribers/on-answer-created.ts`

```typescript
@Injectable()
export class OnAnswerCreated implements EventHandler {
  constructor(
    questionsRepository: QuestionsRepository,
    sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions();  // ◄── REGISTRA NO CONSTRUTOR
    this.questionsRepository = questionsRepository;
    this.sendNotification = sendNotification;
  }

  setupSubscriptions() {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCreatedEvent.name  // "AnswerCreatedEvent"
    );
  }

  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
    const question = await this.questionsRepository.findById(
      answer.questionId.toString()
    );

    if (question) {
      await this.sendNotification.execute({  // ◄── CHAMA O USE CASE
        recipientId: question.authorId.toString(),
        title: `Nova resposta em "${question.title.substring(0, 40).concat("...")}"`,
        content: answer.excerpt,
      });
    }
  }
}
```

**O que acontece:**
- No construtor, registra `sendNewAnswerNotification` como handler para `AnswerCreatedEvent`
- Quando o evento é disparado, busca a Question relacionada
- Chama `SendNotificationUseCase` para criar a notificação

---

### 8. SendNotificationUseCase.execute() - Cria a Notificação
**Arquivo:** `src/domain/notification/application/use-cases/send-notification.ts`

```typescript
async execute({ recipientId, title, content }) {
  const notification = Notification.create({
    recipientId: new UniqueEntityID(recipientId),
    content,
    title,
  });

  await this.notificationsRepository.create(notification);  // ◄── PERSISTE

  return right({ notification });
}
```

**O que acontece:**
- Cria a entidade `Notification`
- Persiste no repositório
- Retorna a notificação criada

---

## Resumo da Ordem de Execução

| Ordem | Componente | Ação |
|-------|------------|------|
| 1 | `AnswerQuestionUseCase` | Chama `Answer.create()` |
| 2 | `Answer.create()` | Cria `AnswerCreatedEvent` e chama `addDomainEvent()` |
| 3 | `AggregateRoot.addDomainEvent()` | Armazena evento e marca aggregate |
| 4 | `DomainEvents.markAggregateForDispatch()` | Adiciona em `markedAggregates[]` |
| 5 | `AnswerQuestionUseCase` | Chama `answersRepository.create()` |
| 6 | `InMemoryAnswersRepository.create()` | Persiste e chama `dispatchEventsFromAggregate()` |
| 7 | `DomainEvents.dispatchEventsFromAggregate()` | Executa handlers do `AnswerCreatedEvent` |
| 8 | `OnAnswerCreated.sendNewAnswerNotification()` | Busca question e chama `SendNotificationUseCase` |
| 9 | `SendNotificationUseCase.execute()` | Cria e persiste a `Notification` |

---

## Pontos Importantes

1. **Eventos são armazenados, não disparados imediatamente**
   - `addDomainEvent()` só marca o aggregate para dispatch

2. **Dispatch acontece APÓS persistência**
   - O repositório chama `dispatchEventsFromAggregate()` depois de salvar

3. **Padrão Observer/Pub-Sub**
   - `DomainEvents.register()` registra handlers
   - `DomainEvents.dispatch()` executa handlers registrados

4. **Desacoplamento**
   - O domínio `forum` não conhece o domínio `notification`
   - A comunicação acontece via eventos de domínio
