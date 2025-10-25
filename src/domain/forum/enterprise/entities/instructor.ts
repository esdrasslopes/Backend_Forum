import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface InstructorProps {
  name: string;
}

export class Instructor extends Entity<InstructorProps> {
  static create(props: InstructorProps, id?: UniqueEntityID) {
    const instructor = new Instructor(props, id);

    return instructor;
  }
}
// Quando uma classe é uma herança, e ela não tem parâmetros próprios, mas todos são herdados do pai, a função super é passada diretamente para o pai, não sendo necessária a existência de um constructor. Ele utilizar como um array de parâmetros desestruturado, onde a partir da posições do array, a classe pai atribui valores aos seus respectivos parãmetros.
