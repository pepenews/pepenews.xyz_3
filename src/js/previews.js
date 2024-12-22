// src/js/previews.js

// Fetch and display article previews from the local JSON file
fetch('/articles/article-previews.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const articlesList = document.getElementById('coindesk-articles');

        data.forEach(article => {
            const articleElement = document.createElement('div');
            articleElement.classList.add('article');

            // Ensure the link starts with '/articles/'
            const localLink = article.link.startsWith('/') ? article.link : `/articles/${article.link}`;

            // Create HTML structure for the article
            articleElement.innerHTML = `
                <h3>${article.title}</h3>
                <p>${article.preview}</p>
                <a href="${localLink}" class="read-full-link" target="_blank">Read Full Article</a>
            `;

            articlesList.appendChild(articleElement);
        });
    })
    .catch(error => console.error('Error fetching article previews:', error));
