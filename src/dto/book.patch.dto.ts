import { AuthorDTO } from "./author.dto";

export interface BookPatchDTO {
    title?: string;
    publishYear?: number;
    authorId?: number;
    isbn?: string;
}
