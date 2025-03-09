"use client";
export default function DeleteButton({ deleteFunction, id }) {
  return (
    <button
      className="text-start"
      onClick={() => {
        deleteFunction(id);
      }}
    >
      Delete Post
    </button>
  );
}
