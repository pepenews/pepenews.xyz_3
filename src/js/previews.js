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

        // Clear any existing content in the articles list (prevents duplication)
        articlesList.innerHTML = '';

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

            // Create title element
            const titleElement = document.createElement('h3');
            titleElement.textContent = article.title;

            // Create preview element
            const previewElement = document.createElement('p');
            previewElement.textContent = article.preview;

            // Create button container
            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('article-button-container');

            // Create link element
            const linkElement = document.createElement('a');
            linkElement.href = localLink;
            linkElement.textContent = 'Read Full Article';
            linkElement.classList.add('read-full-link');
            linkElement.target = '_blank';
            linkElement.rel = 'noopener noreferrer';

            // Append elements in correct order
            buttonContainer.appendChild(linkElement);
            articleElement.appendChild(titleElement);
            articleElement.appendChild(previewElement);
            articleElement.appendChild(buttonContainer);

            // Append the article to the articles list
            articlesList.appendChild(articleElement);
        });
    })
    .catch(error => {
        // Handle errors and log them
        console.error('Error fetching article previews:', error);

        // Show a fallback message if articles fail to load
        const articlesList = document.getElementById('coindesk-articles');
        articlesList.innerHTML = '<p class="error-message">Failed to load articles. Please try again later.</p>';
    });
