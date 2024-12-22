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

            // Use the local link to open the article page
            const localLink = article.link; // Already includes /articles/

            articleElement.innerHTML = `
                <h3>${article.title}</h3>
                <p>${article.preview}</p>
                <a href="${localLink}" target="_blank">Read Full Article</a>
            `;

            articlesList.appendChild(articleElement);
        });
    })
    .catch(error => console.error('Error fetching article previews:', error));
