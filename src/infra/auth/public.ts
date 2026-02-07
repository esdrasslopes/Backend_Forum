import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// isPublic é apenas uma propriedade adicionada ao metadata do nest, que permite em um guard a validação se algo é público ou não.
