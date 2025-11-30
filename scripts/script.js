const BASE_URL = 'https://jsonplaceholder.typicode.com';
const postsContainer = document.querySelector('.postsContainer');
const postSingleView = document.querySelector('.postSingleView');

const searchInput = document.querySelector('#searchInput');

const selectUser = document.querySelector('.selectUser');
const resetFilterBtn = document.querySelector('#resetFilterBtn');

const formPost = document.querySelector('#formPost');
const titleInput = document.querySelector('#titleInput');
const textArea = document.querySelector('#textArea');
const postAuthorSelect = document.querySelector('.postAuthorSelect');

let postsList = [];
let currentUserFilter = 'all';
let searchQuery = '';

const getPosts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/posts`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getUsers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/users`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getComments = async () => {
  try {
    const response = await fetch(`${BASE_URL}/comments`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

Promise.all([getPosts(), getUsers(), getComments()]).then(([posts, users, comments]) => {
  postsList = meregeData(posts, users, comments);
  insertUsersToSelect(users);
  renderPosts(postsList);
});

const meregeData = (posts, users, comments) => {
  return posts.map((post) => {
    const user = users.find((u) => u.id === post.userId);
    const comment = comments.filter((c) => c.postId === post.id);
    return {
      postId: post.id,
      postTitle: post.title,
      postBody: post.body,

      username: user.name,
      userId: user.id,

      comments: comment,
      commentsCount: comment.length,
    };
  });
};

const createPostElement = (post) => {
  const container = document.createElement('div');
  container.classList.add('postCard');

  const postTitle = document.createElement('h3');
  const postAuth = document.createElement('span');
  const postText = document.createElement('span');
  const postComments = document.createElement('span');
  const readMoreBtn = document.createElement('button');

  readMoreBtn.classList.add('readMoreBtn');
  postTitle.classList.add('postTitle');

  postTitle.textContent = post.postTitle;
  postAuth.textContent = post.username;
  postText.innerHTML = `${post.postBody.substring(0, 100)}...`;
  readMoreBtn.textContent = 'read more...';
  postComments.innerHTML = `Comments: ${post.commentsCount}`;

  readMoreBtn.addEventListener('click', () => openSinglePost(post));
  postTitle.addEventListener('click', () => openSinglePost(post));

  container.append(postTitle, postAuth, postText, postComments, readMoreBtn);
  return container;
};

const renderPosts = () => {
  postsContainer.innerHTML = '';

  let filtered = postsList
    .filter((post) => {
      if (currentUserFilter !== 'all' && post.userId != currentUserFilter) {
        return false;
      }
      return true;
    })

    .filter((post) => {
      if (!searchQuery) return true;

      const title = post.postTitle.toLowerCase();
      const body = post.postBody.toLowerCase();

      return title.includes(searchQuery) || body.includes(searchQuery);
    });

  filtered.forEach((post) => {
    const postChild = createPostElement(post);
    postsContainer.appendChild(postChild);
  });
};



const openSinglePost = (post) => {
  postsContainer.style.display = 'none';
  postSingleView.style.display = 'block';

  postSingleView.innerHTML = `
    <div class="postDescription">
      <h2>${post.postTitle}</h2>
      <p>${post.postBody}</p>
      <h4>Author: ${post.username}</h4>
      <h3>Comments: (${post.commentsCount})</h3>
    </div>

    <div class="commentsContainer">
      ${post.comments
        .map(
          (c) => `
        <div class="commentItem">
          <h5>${c.name}</h5>
          <p>${c.body}</p>
        </div>
      `,
        )
        .join('')}
    </div>
    
    <button class="backBtn">Back</button>
    `;

  const backBtn = document.querySelector('.backBtn');
  backBtn.addEventListener('click', closeSinglePost);
};

const closeSinglePost = () => {
  postsContainer.style.display = 'block';
  postSingleView.style.display = 'none';
};

const insertUsersToSelect = (users) => {
  users.forEach((user) => {
    const option = document.createElement('option');
    option.value = user.id;
    option.textContent = user.name;
    selectUser.appendChild(option);

    const option2 = option.cloneNode(true);
    postAuthorSelect.appendChild(option2);
  });
};

selectUser.addEventListener('change', (event) => {
  currentUserFilter = event.target.value;
  renderPosts();
});

resetFilterBtn.addEventListener('click', () => {
  currentUserFilter = 'all';
  selectUser.value = 'all';
  renderPosts();
})

formPost.addEventListener('submit', async (event) => {
  event.preventDefault();

  const titleValue = titleInput.value.trim();
  const textAreaValue = textArea.value.trim();
  const authorId = Number(postAuthorSelect.value);

  if (!titleValue || !textAreaValue || !authorId) return;

  const user = postsList.find((p) => p.userId === authorId);

  const newPost = {
    postId: Math.random(),
    postTitle: titleValue,
    postBody: textAreaValue,
    userId: authorId,
    username: user.username,
    comments: [],
    commentsCount: 0,
  };

    await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newPost),
  });

    postsList.unshift(newPost);
    renderPosts(postsList);

    formPost.reset();
});

searchInput.addEventListener('input', (event) => {
  searchQuery = event.target.value.toLowerCase().trim();
  renderPosts();
});