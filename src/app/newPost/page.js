import pg from "pg";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default function Page() {
  async function handleAddPost(formData) {
    "use server";
    const db = new pg.Pool({ connectionString: process.env.DB_CONN });

    const title = formData.get("title");
    const image = formData.get("image");

    await db.query(`INSERT INTO posts (title, image) VALUES ($1, $2)`, [
      title,
      image,
    ]);
    revalidatePath("/posts");
    redirect("/posts");
  }
  return (
    <div>
      <form action={handleAddPost}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          placeholder="Title"
          type="text"
          required
        />
        <label htmlFor="image">Image URL</label>
        <input
          id="image"
          name="image"
          placeholder="Image URL"
          type="text"
          required
        />
        <button>Add</button>
      </form>
    </div>
  );
}
