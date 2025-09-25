import {Controller, Get, Post, Delete, Route, Path, Body, Tags, Patch, Security} from "tsoa";
import { authorService } from "../services/author.service";
import { AuthorDTO } from "../dto/author.dto";
import { Author } from "../models/author.model";
import {CustomError} from "../middlewares/errorHandler";
import {BookDTO} from "../dto/book.dto";
import {bookService} from "../services/book.service";

@Route("authors")
@Tags("Authors")
export class AuthorController extends Controller {
  // Récupère tous les auteurs

    @Security("jwt", ["get-author"])
    @Get("/")
  public async getAllAuthors(): Promise<AuthorDTO[]> {
    return authorService.getAllAuthors();
  }

  // Récupère un auteur par ID
    @Security("jwt", ["get-author"])
    @Get("{id}")
  public async getAuthorById(@Path() id: number): Promise<AuthorDTO | null> {
      let author: Author | null = await authorService.getAuthorById(id);
      if (!author) {
          let error: CustomError = new Error("Author not found");
          error.status = 404;
          throw error;
      }
    return authorService.getAuthorById(id);
  }

  // Crée un nouvel auteur
    @Security("jwt", ["post-author"])
    @Post("/")
  public async createAuthor(
    @Body() requestBody: AuthorDTO
  ): Promise<AuthorDTO> {
    const { firstName, lastName } = requestBody;
    return authorService.createAuthor(firstName, lastName);
  }

  // Supprime un auteur par ID
    @Security("jwt", ["delete-author"])
    @Delete("{id}")
  public async deleteAuthor(@Path() id: number): Promise<void> {
    await authorService.deleteAuthor(id);
  }

  // Met à jour un auteur par ID
    @Security("jwt", ["patch-author"])
    @Patch("{id}")
  public async updateAuthor(
    @Path() id: number,
    @Body() requestBody: AuthorDTO
  ): Promise<AuthorDTO | null> {
    const { firstName, lastName } = requestBody;
      let author: Author | null = await authorService.updateAuthor(id, firstName, lastName);
      if (!author) {
          let error: CustomError = new Error("Author not found");
          error.status = 404;
          throw error;
      }
    return author;
  }
    @Security("jwt", ["get-author"])
    @Get("{id}/books")
    public async getBooksByAuthor(@Path() id: number): Promise<BookDTO[]> {
      const author: Author | null = await Author.findByPk(id);
      if (!author) {
          let error: CustomError = new Error(`Author ${id} not found`);
          error.status = 404;
          throw error;
      }
      return bookService.getBooksByAuthorId(id);
    }
}
