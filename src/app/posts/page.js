// page for all posts
import pg from "pg";
import Link from "next/link";
import Image from "next/image";

export default async function AllPosts() {
  const db = new pg.Pool({ connectionString: process.env.DB_CONN });

  const data = await db.query(`SELECT * FROM posts`);
  //   returns the useful data we need
  const posts = data.rows;
  console.log(posts);

  return (
    <div>
      {posts.map((post) => (
        <div className="flex flex-col" key={post.id}>
          {/* ${post.id} ensures it takes you to the correct dynamic route depending on what the user clicks */}
          <Link href={`/posts/${post.id}`}>{post.title}</Link>
          <Image height={100} width={100} alt={post.title} src={post.image} />
        </div>
      ))}
    </div>
  );
}
