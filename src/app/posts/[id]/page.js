// page for individual post
// need to see comments related to this post
import pg from "pg";
import Image from "next/image";
import Link from "next/link";
import { comment } from "postcss";
import { revalidatePath } from "next/cache";

export default async function Page({ params }) {
  const slug = await params;
  const db = new pg.Pool({ connectionString: process.env.DB_CONN });

  //   const post = await db.query(`SELECT * FROM posts WHERE id = ${slug.id}`);
  //   // need [0] to display the singular
  //   const singlePost = post.rows[0];

  //   const comments = await db.query(
  //     `SELECT * FROM comments WHERE post_id = ${slug.id}`
  //   );
  //   console.log(comments);
  //   const singleComment = comments.rows[0];
  //   console.log(singleComment);

  //   const post = await db.query(`
  //         SELECT
  //           posts.*,
  //           ARRAY_AGG(json_build_object(
  //             'id', comments.id,
  //             'content', comments.content,
  //             'post_id', comments.post_id
  //           )) AS comments
  //         FROM posts
  //         INNER JOIN comments ON comments.post_id = posts.id
  //         WHERE posts.id = ${slug.id}
  //         GROUP BY posts.id
  //       `);

  //   need COALESCE because it kept erroring when I added new photo without comments
  // COALESCE handles NULL values so empty array [] is returned if no comments
  const post = await db.query(
    `
      SELECT p.*, 
       COALESCE(json_agg(c.*) FILTER (WHERE c.id IS NOT NULL), '[]') AS comments
FROM posts p
LEFT JOIN comments c ON p.id = c.post_id
WHERE p.id = ${slug.id}
GROUP BY p.id;
      `
  );
  const singlePost = post.rows[0];
  const comments = singlePost.comments;
  if (comments) {
    console.log(comments);
  } else {
    console.log("No comments");
  }
  async function handleAddComment(formData) {
    "use server";
    const db = new pg.Pool({ connectionString: process.env.DB_CONN });

    const content = formData.get("comment");

    await db.query(`INSERT INTO comments (content, post_id) VALUES ($1, $2)`, [
      content,
      slug.id,
    ]);
    revalidatePath("/posts/id");
  }

  let commentDiv = "";
  if (comments) {
    commentDiv = comments.map((comment) => (
      <div key={comment.id}>
        <p>{comment.content}</p>
      </div>
    ));
  }

  return (
    <div>
      <h1>{singlePost.title}</h1>
      <Image
        height={300}
        width={300}
        alt={singlePost.title}
        src={singlePost.image}
      />
      <div>
        {/* singlePost.comments.map wasn't working so assigned it to a variable above to be used here */}

        {commentDiv}
        <form action={handleAddComment}>
          <label htmlFor="commment">Comment</label>
          <input
            id="comment"
            name="comment"
            placeholder="comment"
            type="text"
            required
          />
          <button>Add Comment</button>
        </form>
      </div>
    </div>
  );
}
