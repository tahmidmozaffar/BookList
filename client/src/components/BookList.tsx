import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { Book } from "./types";
import BookDetails from "./BookDetails";
import { getBooksQuery } from "../gql/bookQueries";

const BookList = () => {
  const [selectedBookId, setSelectedBookId] = useState<string>("");
  const { loading, data } = useQuery<{ books: Book[] }>(getBooksQuery);

  const displayBooks = () => {
    if (loading) {
      return <div>Loading books...</div>;
    } else {
      return data?.books.map((book) => {
        return (
          <li key={book.id} onClick={() => setSelectedBookId(book.id)}>
            {book.name}
          </li>
        );
      });
    }
  };
  return (
    <div>
      <ul id="book-list">{displayBooks()}</ul>
      <BookDetails bookId={selectedBookId} />
    </div>
  );
};
export default BookList;
