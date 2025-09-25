import { BookDTO } from "./book.dto";

export interface BookCopyDTO {
    id?: number;
    book?: BookDTO;
    bookId: number;
    available: boolean;
    state: number;
}