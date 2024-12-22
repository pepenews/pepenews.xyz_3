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

        // Loop through each article and create its HTML structure
        data.forEach(article => {
            const articleElement = document.createElement('div');
            articleElement.classList.add('article');

            // Ensure the link includes the relative path properly
            const localLink = article.link.startsWith('/') ? article.link : `/articles/${article.link}`;

            articleElement.innerHTML = `
                <h3>${article.title}</h3>
                <p>${article.preview}</p>
                <a href="${localLink}" class="read-full-link" target="_blank">Read Full Article</a>
            `;

            // Append article to the list
            articlesList.appendChild(articleElement);
        });
    })
    .catch(error => console.error('Error fetching article previews:', error));
