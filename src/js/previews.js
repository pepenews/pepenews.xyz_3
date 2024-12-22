// src/js/previews.js

// Fetch and display article previews from the local JSON file
fetch('/articles/article-previews.json')
    .then(response => {
        // Check if the response is valid
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Parse JSON
    })
    .then(data => {
        const articlesList = document.getElementById('coindesk-articles');

        // Debug: Log the data for verification
        console.log('Fetched Articles:', data);

        // Loop through each article and render it
        data.forEach(article => {
            // Debug: Log each article object
            console.log('Processing Article:', article);

            // Ensure the link starts with '/articles/'
            let localLink = article.link;
            if (!localLink.startsWith('/articles/')) {
                localLink = `/articles/${localLink}`;
            }

            // Create a new article container
            const articleElement = document.createElement('div');
            articleElement.classList.add('article');

            // Build the article's HTML structure
            articleElement.innerHTML = `
                <h3>${article.title}</h3>
                <p>${article.preview}</p>
                <div class="article-button-container">
                    <a href="${localLink}" class="read-full-link" target="_blank">Read Full Article</a>
                </div>
            `;

            // Append the article to the articles list
            articlesList.appendChild(articleElement);
        });
    })
    .catch(error => {
        // Handle errors and log them
        console.error('Error fetching article previews:', error);
        alert('Failed to load articles. Please try again later.');
    });
