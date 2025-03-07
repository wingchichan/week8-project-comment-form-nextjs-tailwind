"use client";
export default function DeleteButton({ deleteFunction, id }) {
  return (
    <button
      onClick={() => {
        deleteFunction(id);
      }}
    >
      Delete Post
    </button>
  );
}
