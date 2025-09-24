import { AuthorDTO } from "./author.dto";

export interface BookPostDTO {
    title: string;
    publishYear: number;
    authorId: number;
    isbn: string;
}
