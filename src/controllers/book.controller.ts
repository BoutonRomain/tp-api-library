import {Body, Controller, Delete, Get, Patch, Path, Post, Route, Tags} from "tsoa";
import { BookDTO } from "../dto/book.dto";
import { bookService } from "../services/book.service";
import {CustomError} from "../middlewares/errorHandler";
import {toDto} from "../mapper/book.mapper";
import {Book} from "../models/book.model";
import {BookPostDTO} from "../dto/book.post.dto";
import {BookPatchDTO} from "../dto/book.patch.dto";
import {bookCollectionService} from "../services/bookCollection.service";
import {BookCopyDTO} from "../dto/bookCopy.dto";

@Route("books")
@Tags("Books")
export class BookController extends Controller {
  @Get("/")
  public async getAllBooks(): Promise<BookDTO[]> {
    return bookService.getAllBooks();
  }

  @Get("{id}")
    public async getBookById(id: number): Promise<BookDTO> {
      let book: Book | null = await bookService.getBookById(id);

      if (!book) {
          let error: CustomError = new Error(`Book ${id} not found`);
          error.status = 404;
          throw error;
      }
      return toDto(book);
  }

  @Post("/")
    public async createBook(@Body() responseBody: BookPostDTO): Promise<BookDTO> {
      const {title, publishYear, authorId, isbn} = responseBody;
      return bookService.createBook(title, publishYear, authorId, isbn);
  }

  @Patch( "{id}")
    public async updateBook(
        @Path() id: number,
        @Body() responseBody: BookPatchDTO): Promise<BookDTO | null> {
      const {title, publishYear, authorId, isbn} = responseBody;
      let book: Promise<BookDTO | null> = bookService.updateBook(id, title, publishYear, authorId, isbn);
      if (!book) {
          let error: CustomError = new Error(`Book ${id} not found`);
          error.status = 404;
          throw error;
      }
      return book;
  }

  @Delete("{id}")
    public async deleteBook(@Path() id: number): Promise<void> {
      await bookService.deleteBook(id);
  }

  @Get("{id}/books-collections")
    public async getBookCopiesByBookId(@Path() id: number): Promise<BookCopyDTO[]> {
      const book: Book | null = await Book.findByPk(id);
      if (!book) {
          let error: CustomError = new Error(`Book ${id} not found`);
          error.status = 404;
          throw error;
      }
      return bookCollectionService.getBookCopiesByBookId(id);
  }
}