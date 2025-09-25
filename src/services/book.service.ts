import { Author } from "../models/author.model";
import { Book } from "../models/book.model";
import {BookDTO} from "../dto/book.dto";
import {AuthorService} from "./author.service";
import {CustomError} from "../middlewares/errorHandler";

export class BookService {

    public authorService = new AuthorService;

  public async getAllBooks(): Promise<Book[]> {
    return Book.findAll({
        include: [{
            model: Author,
            as: 'author'
        }]
    });
  }

  public async getBookById(id: number): Promise<Book | null> {
      return Book.findByPk(id, {
          include: [{
              model: Author,
              as: 'author'}]
      });
  }

    public async createBook(title: string, publishYear: number, authorId: number, isbn: string): Promise<BookDTO> {
        let author: Author | null = await this.authorService.getAuthorById(authorId);
        if (!author) {
            let error: CustomError = new Error("Author not found");
            error.status = 404;
            throw error;
        }

        return Book.create({title, publishYear, authorId, isbn});
    }

    public async updateBook(id: number, title?: string, publishYear?: number, authorId?: number, isbn?: string): Promise<BookDTO | null> {
        const book = await Book.findByPk(id);
        if (book) {
            if (title !== undefined) book.title = title;
            if (publishYear !== undefined) book.publishYear = publishYear;
            if (authorId !== undefined) {
                let author: Author | null = await this.authorService.getAuthorById(authorId);
                if (!author) {
                    let error: CustomError = new Error("Author not found");
                    error.status = 404;
                    throw error;
                }
                book.author = author;
            }
            if (isbn !== undefined) book.isbn = isbn;
            await book.save();
            return book;
        } {
            let error: CustomError = new Error(`Book ${id} not found`);
            error.status = 404;
            throw error;
        }
    }
}

export const bookService = new BookService();
