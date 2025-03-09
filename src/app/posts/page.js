// page for all posts
import DeleteButton from "../component/Button";
import pg from "pg";
import Link from "next/link";
import Image from "next/image";
import { revalidatePath } from "next/cache";

export default async function AllPosts({ searchParams }) {
  const query = await searchParams;
  const db = new pg.Pool({ connectionString: process.env.DB_CONN });

  const data = await db.query(`SELECT * FROM posts`);
  //   returns the useful data we need
  const posts = data.rows;
  console.log(posts);

  if (query.sort === "desc") {
    posts.reverse();
  }

  async function handleDelete(id) {
    "use server";
    console.log("delete");
    const db = new pg.Pool({ connectionString: process.env.DB_CONN });
    await db.query(`DELETE FROM posts WHERE id = $1`, [id]);
    revalidatePath("/posts");
  }

  return (
    <div>
      <Link href="/posts?sort=asc">Ascending Order</Link>
      <Link href="/posts?sort=desc">Descending Order</Link>
      {posts.map((post) => (
        <div className="flex flex-col" key={post.id}>
          {/* ${post.id} ensures it takes you to the correct dynamic route depending on what the user clicks */}
          <Link href={`/posts/${post.id}`}>{post.title}</Link>
          <Image height={100} width={100} alt={post.title} src={post.image} />
          <DeleteButton id={post.id} deleteFunction={handleDelete} />
        </div>
      ))}
    </div>
  );
}
