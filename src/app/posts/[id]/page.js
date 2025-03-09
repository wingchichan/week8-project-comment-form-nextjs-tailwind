// page for individual post
// need to see comments related to this post
import pg from "pg";
import Image from "next/image";
import { comment } from "postcss";

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

  //   const post = await db.query(`SELECT posts.*, ARRAY_AGG(comments.*) AS comments
  //   FROM posts
  //   INNER JOIN comments on comments.post_id = posts.id
  //   GROUP BY comments.post_id, posts.id`);
  //   console.log(post);

  //   const postWithComms = post.rows[0];
  //   console.log(postWithComms);

  const post = await db.query(`
    SELECT 
      posts.*, 
      ARRAY_AGG(json_build_object(
        'id', comments.id,
        'content', comments.content,
        'post_id', comments.post_id
      )) AS comments
    FROM posts
    INNER JOIN comments ON comments.post_id = posts.id
    WHERE posts.id = ${slug.id}
    GROUP BY posts.id
  `);

  const singlePost = post.rows[0];
  console.log(singlePost);
  const comments = singlePost.comments;
  console.log(comments);

  return (
    <div>
      <h1>{singlePost.title}</h1>
      <Image
        height={300}
        width={300}
        alt={singlePost.title}
        src={singlePost.image}
      />
      <p>{singlePost.content}</p>
      <div>
        {/* need to map from the parent i.e. singlePost (comments.map didn't work) */}
        {singlePost.comments.map((comment) => (
          <div key={comment.id}>
            <p>{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
