// Sample user data for demonstration
let users = [
   { username: 'user1', password: 'pass1', starredRepositories: [] },
   { username: 'user2', password: 'pass2', starredRepositories: [] },
    // Add more user data as needed
];



let loggedInUser = null;


// Function to handle user authentication
function authenticateUser(username, password) {
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        loggedInUser = username;
        showUserInfo();
        fetchAndDisplayRepositories(); // Fetch repositories for the logged-in user
    } else {
        alert('Invalid username or password. Please try again.');
    }
}



// Sample data for repositories
let repositories = [
    { name: 'Repo 1', language: 'JavaScript', stars: 100, lastActivity: '2023-01-01' },
    { name: 'Repo 2', language: 'Python', stars: 50, lastActivity: '2023-02-01' },
    { name: 'Repo 3', language: 'Java', stars: 80, lastActivity: '2023-03-01' },
    { name: 'Repo 4', language: 'C++', stars: 120, lastActivity: '2020-11-11' },
    { name: 'Repo 5', language: 'Ruby', stars: 70, lastActivity: '2021-05-01' },
    { name: 'Repo 6', language: 'C', stars:70, lastActivity: '2022-06-01'},
    // Add more repository data as needed
];

// Function to display repositories
function displayRepositories(repoData) {
    const repoList = document.getElementById('repo-list');
    repoList.innerHTML = '';

    repoData.forEach(repo => {
        const repoCard = document.createElement('div');
        repoCard.classList.add('repo-card');
        const isStarred=isLoggedIn() && loggedInUser.starredRepositories.includes(repo.name);
        repoCard.innerHTML = `
            <h3>${repo.name}</h3>
            <p>Language: ${repo.language}</p>
            <p>Stars: ${repo.stars}</p>
            <p>Last Activity: ${repo.lastActivity}</p>
            <button onclick="starRepository('${repo.name}')">${(isLoggedIn() && loggedInUser.starredRepositories.includes(repo.name)) ? 'Unstar' : 'Star'}</button>
            <span>${(isLoggedIn() && loggedInUser.starredRepositories.includes(repo.name)) ? 'Starred by you' : ''}</span>
        `;
        repoList.appendChild(repoCard);
    });
}

function showStarredRepos() {
    if (isLoggedIn()) {
        const starredRepos = loggedInUser.starredRepositories;
        const repoList = document.getElementById('repo-list');
        repoList.innerHTML = '';

        starredRepos.forEach(repoName => {
            const repoCard = document.createElement('div');
            repoCard.classList.add('repo-card');
            repoCard.innerHTML = `
                <h3>${repoName}</h3>
                <p>Starred by: ${loggedInUser.username}</p>
                <button onclick="unstarRepository('${repoName}')">Unstar</button>
            `;
            repoList.appendChild(repoCard);
        });
    } else {
        alert('You need to be logged in to view starred repositories.');
    }
}

// Function to sort repositories by popularity (stars)
function sortByPopularity() {
    const sortedRepos = [...repositories].sort((a, b) => b.stars - a.stars);
    displayRepositories(sortedRepos);
}

// Function to sort repositories by recent activity
function sortByRecentActivity() {
    const sortedRepos = [...repositories].sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
    displayRepositories(sortedRepos);
}

// Function to filter repositories by programming language
function filterByLanguage(language) {
    const filteredRepos = repositories.filter(repo => {return language === '' || repo.language === language;});
    displayRepositories(filteredRepos);
}

// Function to star a repository
function starRepository(repoName) {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const user = users.find(u => u.username === loggedInUser);

    if (user) {
        // Check if the repository is already starred
        const isStarred = user.starredRepos.includes(repoName);

        if (!isStarred) {
            user.starredRepos.push(repoName);
            localStorage.setItem('users', JSON.stringify(users));
            checkLoggedIn();
        } else {
            alert('Repository already starred by the user');
        }
    } else {
        alert('User not logged in');
    }
}

function fetchAndDisplayRepositories() {
    // Assuming you have a repositories array that contains all repositories
    const allRepositories = [
        { name: 'Repo 1', language: 'JavaScript', stars: 100, lastActivity: '2023-01-01' },
        { name: 'Repo 2', language: 'Python', stars: 50, lastActivity: '2023-02-01' },
        // Add more repository data as needed
    ];

    // Display all repositories or starred repositories based on user's login status
    if (isLoggedIn()) {
        showStarredRepos();
    } else {
        displayRepositories(allRepositories);
    }
}


// Function to show user information
function showUserInfo(username) {
    document.getElementById('auth-form').style.display = 'none';
    document.getElementById('user-info').style.display = 'block';
    document.getElementById('username-display').innerText = `Welcome, ${username}!`;
    document.getElementById('logout-btn').style.display = 'inline'; // Show logout button
    document.getElementById('signup-btn').style.display = 'none'; // Hide signup button
    document.getElementById('login-btn').style.display = 'none'; // Hide login button
}

// Function to show authentication form
function showAuthForm() {
    document.getElementById('user-info').style.display = 'none';
    document.getElementById('auth-form').style.display = 'block';
    document.getElementById('logout-btn').style.display = 'none'; // Hide logout button
    document.getElementById('signup-btn').style.display = 'inline'; // Show signup button
    document.getElementById('login-btn').style.display = 'inline'; // Show login button
}

// Function to check if a user is logged in
function checkLoggedIn() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        showUserInfo(loggedInUser);

        // Fetch user-specific repositories from storage
        const userRepositories = JSON.parse(localStorage.getItem(`${loggedInUser}_repositories`)) || [];

        // If there are repositories, display them; otherwise, clear the list
        if (userRepositories.length > 0) {
            displayRepositories(userRepositories);
        } else {
            // Display all repositories sorted by popularity by default
            sortByPopularity();
        }

        document.getElementById('repo-filters').style.display='block';
    } else {
        showAuthForm();
        clearRepositories();
    }
}

// Function to handle user signup
function signup(username,password) {
    //const username = document.getElementById('username').value;
    //const password = document.getElementById('password').value;

    // Check if the username is already taken
    const newUser = {username,password,starredRepositories: []};
    users.push(newUser);
    alert('Signup successful.');
    showAuthForm();
}

// Function to handle user login
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Check if the user exists
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
         loggedInUser=user;
         showUserInfo();
         fetchAndDisplayRepositories();
         localStorage.setItem('loggedInUser', username);
         checkLoggedIn();
    } else {
        alert('Invalid username or password');
    }
}

// Function to handle user logout
function logout() {
    loggedInUser=null;
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('${loggedInUser}_repositories');
    clearRepositories();
    showAuthForm();
    document.getElementById('repo-filters').style.display='none';
}

function isLoggedIn(){
    return loggedInUser !== null && loggedInUser !== undefined;;
}



function clearRepositories(){
    const repoList=document.getElementById('repo-list');
    repoList.innerHTML='';
}

// Initialization
checkLoggedIn();
// Sample usage
document.addEventListener('DOMContentLoaded', checkLoggedIn);