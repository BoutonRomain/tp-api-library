import {BookCopyDTO} from "../dto/bookCopy.dto";
import {BookCopy} from "../models/bookCopy.model";

export function toDto(bookCopy: BookCopy): BookCopyDTO {
    return {id: bookCopy.id, book: bookCopy.book, bookId: bookCopy.bookId, available: bookCopy.available, state: bookCopy.state};
}