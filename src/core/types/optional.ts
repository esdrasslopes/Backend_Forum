export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

// O pick pega uma propriedade ou propriedades de um tipo em específico. O partial transforma todas as propriedades de um tipo em opcionais. O omit remove uma propriedade ou propriedades de um tipo em específico. No tipo em questão, o pick vai pegar uma propriedade que se tornou opcional, e o omit vai remover a propriedade que se tornou opcional. Sendo assim, a propriedade que foi opcional, não será redundante no tipo.
