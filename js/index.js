document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('github-form')
    const inputSearch = document.getElementById('search')
    const userList = document.getElementById('user-list')
    const repoList = document.getElementById('repos-list')

    form.addEventListener('submit', (e) => {
        e.preventDefault()

        const searchQuery = inputSearch.value.trim()

        if (searchQuery !== '') {
            userList.innerHTML = '';
            repoList.innerHTML = '';      

            userSearch(searchQuery)
        }
    })

    function userSearch(query) {
        fetch(`https://api.github.com/search/users?q=${query}`, {
            headers: {
                Accept: 'application/vnd.github.v3+json'
            }
        })
        .then(resp => resp.json())
        .then(data => {
            if (data.items) {
                data.items.forEach(user => {
                    displayUserInfo(user)
                })
            } else {
                console.error("No users found")
            }
        })
        .catch(error => console.error('Error searching for users:', error))
    }

    function displayUserInfo(user) {
        const userInfo = document.createElement('li')
        userInfo.innerHTML = `
        <img src='${user.avatar_url}' alt='${user.login}' width='50' height='50'>
        <span>${user.login}</span>
        <a href='${user.html_url}' target='_blank'>Profile</a>
        `
        userInfo.addEventListener("click", () => {
            fetchUserRepos(user.login)
        })
        userList.appendChild(userInfo)
    }

    function fetchUserRepos(username) {
        fetch(`https://api.github.com/users/${username}/repos`, {
            headers: {
                Accept: 'application/vnd.github.v3+json'
            }
        })
        .then(resp => resp.json())
        .then(data => {
            if (data.length > 0) {
                data.forEach(repo => {
                    displayRepoInfo(repo)
                })
            } else {
                console.error('No repositories found for the user')
            }
        })
        .catch(error => console.error('Error fetching user repositories', error))
    }

    function displayRepoInfo(repo) {
        const repoInfo = document.createElement('li')
        repoInfo.innerHTML = `
        <strong>${repo.name}</strong>
        <p>${repo.description || 'No description available'}</p>
        <a href='${repo.html_url}' target='_blank'>Visit Repo on GitHub</a>
        `;
        repoList.appendChild(repoInfo)
    }

})