import React, { FC, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Author, Book } from "./types";
import { addBookMutation, getBooksQuery } from "../gql/bookQueries";
import { getAuthorsQuery } from "../gql/authorQueries";

const defaultBook = {
  id: "",
  name: "",
  genre: "",
  authorId: "Select author",
};

const AddBook: FC = () => {
  const [book, setBook] = useState<Book>(defaultBook);
  const [addBook] = useMutation<
    { addBook: Book },
    { name: string; genre: string; authorId: string }
  >(addBookMutation, {
    variables: {
      name: book.name,
      genre: book.genre,
      authorId: book.authorId!!,
    },
    refetchQueries: [{ query: getBooksQuery }],
  });
  const { loading, data } = useQuery<{ authors: Author[] }>(getAuthorsQuery);

  const onAddBtnClicked = (evt) => {
    evt.preventDefault();
    if (
      book.name.length > 0 &&
      book.genre.length > 0 &&
      book.authorId.length > 0 &&
      book.authorId !== "Select author"
    ) {
      addBook()
        .then((data) => {
          const book = data?.data?.addBook;
          book &&
            alert(
              `Successfully added:\nBook name: ${book.name}\nGenre: ${book.genre}`
            );
          setBook(defaultBook);
        })
        .catch(() => {
          alert("Could not add the book. Something went wrong.");
        });
    } else {
      alert("Please enter name, genre and select an author");
    }
  };

  const onChange = (
    evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    evt.preventDefault();
    switch (evt.target.name) {
      case "book_name":
        setBook({
          ...book,
          name: evt.target.value,
        });
        break;
      case "book_genre":
        setBook({
          ...book,
          genre: evt.target.value,
        });
        break;
      case "book_author":
        setBook({
          ...book,
          authorId: evt.target.value,
        });
        break;
      default:
        break;
    }
  };

  const displayAuthors = () => {
    if (loading) {
      return <option disabled>Loading authors</option>;
    } else {
      if (data !== undefined) {
        return data.authors.map((author) => {
          return (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          );
        });
      }
    }
  };

  return (
    <form id="add-book">
      <div className="field">
        <label>Book name:</label>
        <input
          name="book_name"
          type="text"
          value={book.name}
          onChange={onChange}
        />
      </div>
      <div className="field">
        <label>Genre:</label>
        <input
          name="book_genre"
          type="text"
          value={book.genre}
          onChange={onChange}
        />
      </div>
      <div className="field">
        <label>Author:</label>
        <select name="book_author" onChange={onChange}>
          <option>Select author</option>
          {displayAuthors()}
        </select>
      </div>
      <button id="addBookBtn" onClick={onAddBtnClicked}>
        +
      </button>
    </form>
  );
};

export default AddBook;
