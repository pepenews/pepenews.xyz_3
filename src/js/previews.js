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
            // Log the article object for debugging
            console.log('Article:', article);

            // Validate and fix the link format
            let localLink = article.link;
            if (!localLink.startsWith('/articles/')) {
                localLink = `/articles/${localLink}`;
            }

            // Create article element
            const articleElement = document.createElement('div');
            articleElement.classList.add('article');

            // Build inner HTML
            articleElement.innerHTML = `
                <h3>${article.title}</h3>
                <p>${article.preview}</p>
                <div class="article-button-container">
                    <a href="${localLink}" class="read-full-link" target="_blank">Read Full Article</a>
                </div>
            `;

            // Append to the articles list
            articlesList.appendChild(articleElement);
        });
    })
    .catch(error => console.error('Error fetching article previews:', error));
