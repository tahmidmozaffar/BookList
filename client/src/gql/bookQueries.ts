import { gql } from "@apollo/client";

const getBooksQuery = gql`
  {
    books {
      name
      genre
      id
    }
  }
`;

const addBookMutation = gql`
  mutation AddBook($name: String!, $genre: String!, $authorId: ID!) {
    addBook(name: $name, genre: $genre, authorId: $authorId) {
      name
      genre
      id
    }
  }
`;

const removeBookMutation = gql`
  mutation RemoveBook($id: String!) {
    removeBook(id: $id) {
      id
    }
  }
`;

const getBookQuery = gql`
  query GetBook($id: ID) {
    book(id: $id) {
      id
      name
      genre
      author {
        id
        name
        age
        books {
          name
          id
        }
      }
    }
  }
`;

export { getBooksQuery, addBookMutation, removeBookMutation, getBookQuery };
