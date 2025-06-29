# 📱 Social Media Backend API

A complete social media backend built with **Node.js**, **Express.js**, and **PostgreSQL**. It handles everything from user registration to scheduled posts, likes, comments, following users, and profile management. Designed to be scalable, secure, and cleanly structured — ready for production-level deployment.

---

## ✨ Key Features

### 🔐 User Authentication

- Secure registration and login using JWT-based token authentication.
- Passwords stored securely using bcrypt hashing.
- Auth middleware protects private routes.

### 📝 Posts Module

- Create, read, update, and delete posts.
- Toggle to enable or disable comments on individual posts.
- Fetch your own posts or posts by any user.
- Soft delete supported (`is_deleted` flag for recovery-friendly architecture).

### ⏰ Scheduled Post Publishing (Bonus Feature)

- Users can schedule a post to be published at a future date & time using `scheduled_at`.
- Scheduled posts remain unpublished until the time arrives.
- A background job (cron) checks every minute and publishes eligible posts automatically.

**Sample Scheduled Post Payload**

```json
{
  "content": "Scheduled post",
  "media_url": "https://example.com/image.jpg",
  "comments_enabled": true,
  "scheduled_at": "2025-06-29T09:35:00.000Z"
}

💬 Comments Module
Users can add comments to posts — if the post allows it.
Edit or delete your own comments.
Comment routes are protected to ensure only authorized users can edit/delete.

❌ Comment Restrictions
If the creator has disabled comments on a post, no user can add comments to it.
Validation and logic are implemented both in the model and route handler.


❤️ Likes Module
Users can like or unlike any post.
Only one like per user per post (duplicate prevention).
Like count can be retrieved with posts.


👥 Follows System
Users can follow or unfollow other users.
APIs available to view followers and following lists.
Follower relationships stored with timestamps.


🔍 Search Functionality
Search users by username or full name.
Search posts by content.
Case-insensitive and paginated responses.


👤 User Profile & Edit
Fetch public user profile with:
Username
Full name
Followers & Following count
Update own profile details (bio, avatar, location, website).
Extended user schema with bio, website, location, avatar_url.


📦 API Endpoints Summary

🔐 Auth
Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	Login & receive JWT

📝 Posts
Method	Endpoint	Description
POST	/api/posts	Create post (supports schedule)
GET	/api/posts/:post_id	Get post by ID
GET	/api/posts/user/:user_id	Get posts by user
GET	/api/posts/my	Get current user's posts
PUT	/api/posts/:post_id	Update post
DELETE	/api/posts/:post_id	Delete post


❤️ Likes
Method	Endpoint	Description
POST	/api/posts/:post_id/like	Like a post
DELETE	/api/posts/:post_id/like	Unlike a post


💬 Comments
Method	Endpoint	Description
POST	/api/comments/:post_id	Add comment to post
PUT	/api/comments/:comment_id	Edit your comment
DELETE	/api/comments/:comment_id	Delete your comment
GET	/api/comments/:post_id	Get all comments on a post


👥 Follow System
Method	Endpoint	Description
POST	/api/users/:user_id/follow	Follow a user
DELETE	/api/users/:user_id/unfollow	Unfollow a user
GET	/api/users/:user_id/followers	List followers
GET	/api/users/:user_id/following	List following


👤 Profile
Method	Endpoint	Description
GET	/api/users/:user_id/profile	Public profile view
PUT	/api/users/profile/edit	Update your profile


🔎 Search
Method	Endpoint	Description
GET	/api/search/users?q=	Search users by name
GET	/api/search/posts?q=	Search posts by content


🗃 Database Schema Highlights
users: Stores authentication & profile info.
posts: Includes content, media, scheduling.
comments: Linked to posts and users.
likes: Tracks user-post likes.
follows: Relationship table (follower/following).
scheduled_at & is_published in posts table control scheduling.


🕒 Cron Job for Scheduled Posts
The backend includes a background job using node-cron that:
Runs every minute.
Publishes all scheduled posts where:
scheduled_at <= NOW()
is_published = false
This feature helps in setting up campaigns, announcements, or time-sensitive content releases.


🧪 Testing
Use Postman or Thunder Client to test endpoints.
Start by registering a user and logging in.
Use the JWT token for authorization in protected routes.
Try scheduled post creation and observe automatic publishing.


🏁 Conclusion
This backend was designed and implemented with attention to security, scalability, and developer experience. From scheduling posts to robust profile and interaction systems, this project covers the real-world features of a modern social media backend.
```
