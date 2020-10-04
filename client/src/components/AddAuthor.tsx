import React, { FC, useState } from "react";
import { Author } from "./types";
import { useMutation } from "@apollo/client";
import { addAuthorMutation, getAuthorsQuery } from "../gql/authorQueries";

const defaultAuthor: Author = {
  id: "",
  name: "",
  age: "0",
};

const AddAuthor: FC = () => {
  const [author, setAuthor] = useState<Author>(defaultAuthor);
  const [addAuthor] = useMutation<
    { addAuthor: Author },
    { name: String; age: Number }
  >(addAuthorMutation, {
    variables: {
      name: author.name,
      age: Number.parseInt(author.age),
    },
    refetchQueries: [{ query: getAuthorsQuery }],
  });

  const onAddBtnClicked = (evt) => {
    evt.preventDefault();
    if (author.name.length > 0 && Number.parseInt(author.age) > 0) {
      addAuthor()
        .then((data) => {
          const author = data?.data?.addAuthor;
          author &&
            alert(
              `Successfully added:\nAuthor name: ${author.name}\nAge: ${author.age}`
            );
          setAuthor(defaultAuthor);
        })
        .catch((err) => {
          console.log(err);
          alert("Could not add the book. Something went wrong.");
        });
    } else {
      alert("Please enter name and age of the author");
    }
  };

  const onChange = (
    evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    evt.preventDefault();
    switch (evt.target.name) {
      case "author_name":
        setAuthor({
          ...author,
          name: evt.target.value,
        });
        break;
      case "author_age":
        setAuthor({
          ...author,
          age: evt.target.value,
        });
        break;
      default:
        break;
    }
  };

  return (
    <form id="add-author">
      <div className="field">
        <label>Author name:</label>
        <input
          name="author_name"
          type="text"
          value={author.name}
          onChange={onChange}
        />
      </div>
      <div className="field">
        <label>Author age:</label>
        <input
          name="author_age"
          type="text"
          value={author.age}
          onChange={onChange}
        />
      </div>
      <button id="addAuthorBtn" onClick={onAddBtnClicked}>
        +
      </button>
    </form>
  );
};

export default AddAuthor;
