import { Author } from "../models/author.model";
import {Book} from "../models/book.model";
import {where} from "sequelize";
import {CustomError} from "../middlewares/errorHandler";
import {BookCopy} from "../models/bookCopy.model";

export class AuthorService {
  // Récupère tous les auteurs
  public async getAllAuthors(): Promise<Author[]> {
    return Author.findAll();
  }

  // Récupère un auteur par ID
  public async getAuthorById(id: number): Promise<Author | null> {
    return Author.findByPk(id);
  }

  // Crée un nouvel auteur
  public async createAuthor(
    firstName: string,
    lastName: string
  ): Promise<Author> {
    return Author.create({firstName: firstName, lastName: lastName });
  }

  // Supprime un auteur par ID
  public async deleteAuthor(id: number): Promise<void> {
    const author = await Author.findByPk(id);
    if (author) {
        const book: Book[] = await Book.findAll({
            where: {
                authorId: id
            }
        });
        let bookCopies: number = 0;
        for (const book1 of book) {
            bookCopies += await BookCopy.count({
                where: {
                    bookId: book1.id
                }
            })
        }
        if (bookCopies === 0) await author.destroy();
        else {
            let error: CustomError = new Error(`Cannot delete author ${id} because ${bookCopies} of his books are in stock`);
            error.status = 403;
            throw error;
        }
    }
    let error: CustomError = new Error(`Author ${id} not found`);
    error.status = 403;
    throw error;
  }

  // Met à jour un auteur
  public async updateAuthor(
    id: number,
    firstName?: string,
    lastName?: string
  ): Promise<Author | null> {
    const author = await Author.findByPk(id);
    if (author) {
      if (firstName) author.firstName = firstName;
      if (lastName) author.lastName = lastName;
      await author.save();
      return author;
    }
    return null;
  }
}

export const authorService = new AuthorService();
