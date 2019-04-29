const githubForm = document.getElementById("github-form");
const githubContainer = document.getElementById("github-container");
const userList = document.getElementById("user-list");
const reposList = document.getElementById("repos-list");
const toggleButton = document.getElementById("toggle");

const USER_SEARCH_URL = "https://api.github.com/search/users?q=";
const USER_REPOS_URL = "https://api.github.com/users";
const REPO_SEARCH_URL = "https://api.github.com/search/repositories?q=";

githubForm.search.placeholder = "Search Users";

function fetchUsers(input) {
  fetch(USER_SEARCH_URL+input)
  .then(res => res.json())
  .then(users => renderUsers(users.items))
  .catch(error => console.error(error.message))
}

function renderUsers(users) {
  userList.innerHTML = "";
  for (let user of users) {
    let li = document.createElement("li");
    userList.appendChild(li);
    li.className += "card"
    li.innerHTML = `
      <h3>${user.login}</h3>
      <img data-repos=${user.login} src=${user.avatar_url} class="avatar-img">
      <a href=${user.html_url}>Link to Profile</a>
    `;
  }
}

function fetchUserRepos(username) {
  fetch(`${USER_REPOS_URL}/${username}/repos`)
  .then(res => res.json())
  .then(repos => {
    renderUserRepos(repos)
  })
}

function renderUserRepos(repos) {
  reposList.innerHTML = "";
  for (let repo of repos) {
    let li = document.createElement('li');
    reposList.appendChild(li);
    li.textContent.className = "card";
    li.innerHTML = `
      <h3><a href=${repo.html_url}>${repo.name}</a></h3>
    `
  }
}

function fetchRepos(input) {
  fetch(REPO_SEARCH_URL+input)
  .then(res => res.json())
  .then(repos => {
    renderRepos(repos.items)
  })
}

function renderRepos(repos) {
  userList.innerHTML = "";
  reposList.innerHTML = "";
  for (let repo of repos) {
    let li = document.createElement("li");
    userList.appendChild(li);
    li.className += "card"
    li.innerHTML = `
      <h3>${repo.name}</h3>
      <p>${repo.description}</p>
      <a href=${repo.html_url}>Link to Repo</a>
    `;
  }
}

githubForm.addEventListener("submit", function(e) {
  e.preventDefault();
  searchValue = githubForm.search.value;
  if (searchValue != "") {
    if (githubForm.dataset.toggle === "users") {
      fetchUsers(searchValue)
    } else {
      //TODO
      fetchRepos(searchValue);
    }
  } else {
    console.error("no search value");
  }
})

userList.addEventListener('click', function(e) {
  if (e.target.tagName === "IMG") {
    let username = e.target.dataset.repos
    fetchUserRepos(username);
  }
});

//Toggle feature
toggleButton.addEventListener('click', function(e) {
  // githubForm.dataset.toggle === "users" ? githubForm.dataset.toggle = "repos" : githubForm.dataset.toggle = "users";
  if (githubForm.dataset.toggle === "users") {
    githubForm.dataset.toggle = "repos";
    githubForm.search.placeholder = "Search Repos"
  } else {
    githubForm.dataset.toggle = "users";
    githubForm.search.placeholder = "Search Users";
  }
});
