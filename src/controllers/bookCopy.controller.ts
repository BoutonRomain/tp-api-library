import {Body, Controller, Delete, Get, Patch, Path, Post, Route, Security, Tags} from "tsoa";
import {bookCollectionService} from "../services/bookCollection.service";
import {BookCopyDTO} from "../dto/bookCopy.dto";
import {BookCopy} from "../models/bookCopy.model";
import {CustomError} from "../middlewares/errorHandler";
import {BookCopyPostDTO } from "../dto/bookCopy.post.dto";
import {toDto} from "../mapper/bookCopy.mapper";
import {BookCopyPatchDTO} from "../dto/bookCopy.patch.dto";
import {bookService} from "../services/book.service";

@Route("bookCopys")
@Tags("BookCopys")
export class BookCopyController extends Controller {

    //Récupérer l'ensemble des livres disponibles
    @Security("jwt", ["get-bookCopies"])
    @Get("/")
    public async getAllBooks(): Promise<BookCopyDTO[]> {
        return bookCollectionService.getAllBooks();
    }

    @Security("jwt", ["get-bookCopies"])
    @Get("{id}")
    public async getBookById(id: number): Promise<BookCopyDTO> {
        let bookCopy: BookCopy | null = await bookCollectionService.getBookCopyById(id);
        if (!bookCopy) {
            let error: CustomError = new Error("Book could not be found.");
            error.status = 404;
            throw error;
        }
        return toDto(bookCopy);
    }

    @Security("jwt", ["post-bookCopies"])
    @Post("/")
    public async createBookCopy(@Body() body: BookCopyPostDTO): Promise<BookCopyDTO> {
        const { bookId, state, available } = body;
        return bookCollectionService.createCopy(bookId, state, available);
    }

    @Security("jwt", ["patch-bookCopies"])
    @Patch("{id}")
    public async updateBookCopy(
        @Path() id: number,
        @Body() body: BookCopyPatchDTO
    ): Promise<BookCopyPatchDTO> {
        const {state, available} = body;
        let bookCopy: BookCopyDTO = await bookCollectionService.updateBookCopy(id, state, available);
        return bookCopy;
    }

    @Security("jwt", ["delete-bookCopies"])
    @Delete("{id}")
    public async deleteBookCopy(@Path() id: number): Promise<void> {
        return bookCollectionService.deleteBookCopy(id);
    }
}
