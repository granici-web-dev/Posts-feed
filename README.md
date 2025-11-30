# Posts-feed
The application should display a list of posts, allow filtering them by author, view individual posts with comments, and ‘create’ new posts.

Technical requirements:

Data loading:

Make requests to:
/posts (blog articles)
/users (authors)
/comments (comments)

Home page - post feed:
Display post cards. Each card should contain:
Post title
Author name (find by userId)
First 100 characters of the post text + ‘...’
Number of comments on this post
‘Read more’ button

Filtering:
Drop-down list with authors (all users)
When selecting an author, show only their posts
‘Reset filter’ button to show all posts

Individual post page:
When clicking on ‘Read more’ or the post title:
Hide the post feed
Show the detailed post page
Display: full title, full text, author name
List of all comments on this post (commenter name + text)

Navigation:
The ‘Back to feed’ button on the post page
The site title (which always leads to the home page)

Creating a new post:
Form above the post feed with fields:
Title (input)
Post text (textarea)
Author selection (select)

When sending:
Add a new post to the beginning of the local array
Display it immediately in the feed
Clear the form

Searching posts:
Search field above the feed
Search works by post title and text
Search should work in conjunction with the author filter

API Endpoints:

https://jsonplaceholder.typicode.com/posts
https://jsonplaceholder.typicode.com/users
https://jsonplaceholder.typicode.com/comments

