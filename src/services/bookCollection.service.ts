import { BookCopy } from "../models/bookCopy.model";
import {Book} from "../models/book.model";
import {Author} from "../models/author.model";
import {BookService} from "./book.service";
import {CustomError} from "../middlewares/errorHandler";
import {BookCopyDTO} from "../dto/bookCopy.dto";

export class BookCollectionService {

    public bookService = new BookService();

    // Récupère tous les livres disponibles
    public async getAllBooks(): Promise<BookCopy[]> {
        return BookCopy.findAll(
            {
                include:
                    [{
                        model: Book,
                        as: "book",
                        include: [{
                            model: Author,
                            as: "author"
                        }]
                    }
                    ]}
        );
    }

    public async getBookCopyById(id: number): Promise<BookCopy | null> {
        return BookCopy.findByPk(id, {
            include:
                [{
                    model: Book,
                    as: "book",
                    include: [{
                        model: Author,
                        as: "author"
                    }]
                }
                ]});
    }

    public async createCopy(bookId: number, state: number, available: boolean | undefined): Promise<BookCopyDTO> {
        let book: Book | null = await this.bookService.getBookById(bookId);
        if (book) {
            return BookCopy.create({bookId, state, available: available ?? true});
        }
        let error: CustomError = new Error(`Book ${bookId} not found`);
        error.status = 404;
        throw error;
    }

    public async updateBookCopy(id: number, state: number | undefined, available: boolean | undefined) {
        const bookCopy: BookCopy | null = await BookCopy.findByPk(id);
        if (!bookCopy) {
            let error: CustomError = new Error(`BookCopy ${id} not found`);
            error.status = 404;
            throw error;
        }
        if (state !== undefined) bookCopy.state = state;
        if (available !== undefined) bookCopy.available = available;
        await bookCopy.save();
        return bookCopy;
    }
}

export const bookCollectionService = new BookCollectionService();