CREATE TABLE posts (
  id INT PRIMARY KEY GENERATED ALWAYS AS identity,
  title VARCHAR(255),
  image TEXT
);

CREATE TABLE comments (
  id INT PRIMARY KEY GENERATED ALWAYS AS identity,
  content TEXT,
  post_id INT REFERENCES posts(id) ON DELETE CASCADE

)


INSERT INTO posts (title, image) VALUES ('Dubai Skyline', 'https://images.squarespace-cdn.com/content/v1/64cac6e7f41ccf1650ccc43b/1691537255531-J7BYDU9TJG1C1X1JPDQ9/Dubai-Skyline.jpg'), ('Dubai again', 'https://images.travelandleisureasia.com/wp-content/uploads/sites/3/2023/10/30223343/Featured-Dubai-Rasto-SK-Shutterstock-1600x900.jpg'), ('Manhattan Skyline', 'https://www.wallart.com/media/catalog/product/cache/871f459736130e239a3f5e6472128962/n/e/new-york-manhattan-skyline-op-fotobehang_10.jpg'), ('London Skyline', 'https://cdn.rt.emap.com/wp-content/uploads/sites/4/2024/02/14101654/hero-lodnon-skyline-scaled.jpg');

INSERT INTO comments (content, post_id) VALUES ('So beautiful', 1), ('Awesome', 1), ('Loved it there', 2), ('Amazing shot', 3), ('Love London', 4)


-- UPDATE posts
-- SET image = 'https://www.wallart.com/media/catalog/product/cache/871f459736130e239a3f5e6472128962/n/e/new-york-manhattan-skyline-op-fotobehang_10.jpg'
-- WHERE title = 'Post Title 3'

-- fetch post infromation first
-- then fetch comments for that post later based on post id`
SELECT posts.*, ARRAY_AGG(comments.*) AS comments
FROM posts
INNER JOIN comments on comments.post_id = posts.id
GROUP BY comments.post_id, posts.id


-- how to fetch a post and its comment
SELECT posts.*, ARRAY_AGG(json_build_object(
  'id', comments.id,
  'content', comments.content,
  'post_id', comments.post_id
)) AS comments
FROM posts
INNER JOIN comments on comments.post_id = posts.id
GROUP BY comments.post_id, posts.id