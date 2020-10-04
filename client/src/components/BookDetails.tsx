import React, { FC, useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Book } from "./types";
import {
  getBookQuery,
  getBooksQuery,
  removeBookMutation,
} from "../gql/bookQueries";

type Props = {
  bookId: string;
};

type AuthorProp = {
  name: string;
  age: number;
  id: string;
  books: Book[];
};

type BookDetailProps = {
  id: string;
  name: string;
  genre: string;
  author: AuthorProp;
};

const BookDetails: FC<Props> = ({ bookId }) => {
  const [book, setBook] = useState<string>(bookId);

  useEffect(() => {
    setBook(bookId);
  }, [bookId]);

  const { data } = useQuery<{ book: BookDetailProps }, { id: string }>(
    getBookQuery,
    {
      variables: {
        id: book,
      },
    }
  );
  const [removeBook] = useMutation<{}, { id: string }>(removeBookMutation, {
    variables: {
      id: book,
    },
    refetchQueries: [{ query: getBooksQuery }],
  });

  const onClickRemoveBtn = (evt) => {
    evt.preventDefault();
    removeBook()
      .then(() => {
        alert("Selected book is successfully removed");
        setBook("");
      })
      .catch((err) => {
        console.log(err);
        alert("Could not remove the book. Something went wrong.");
      });
  };

  return (
    <div id="book-details">
      {data?.book ? (
        <div>
          <h2>{data.book.name}</h2>
          <p>{data.book.genre}</p>
          <p>{data.book.author.name}</p>
          <p>All books by this author:</p>
          <ul className="other-books">
            {data.book.author.books.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
          <button id="deleteBook" onClick={onClickRemoveBtn}>
            Remove
          </button>
        </div>
      ) : (
        <div>No book selected...</div>
      )}
    </div>
  );
};
export default BookDetails;
