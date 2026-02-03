// Column interaction functionality
const columns = document.querySelectorAll('.column');

// Handle column activation
function activateColumn(column) {
    // Remove active class and update aria-pressed for all columns
    columns.forEach(col => {
        col.classList.remove('active');
        col.setAttribute('aria-pressed', 'false');
    });

    // Add active class and update aria-pressed for clicked column
    column.classList.add('active');
    column.setAttribute('aria-pressed', 'true');
}

// Add click and keyboard listeners to columns
columns.forEach(column => {
    column.addEventListener('click', () => {
        activateColumn(column);
    });

    // Keyboard accessibility - Enter and Space keys
    column.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            activateColumn(column);
        }
    });
});

// API Posts functionality
const postsContainer = document.getElementById('posts-container');
const userFilter = document.getElementById('user-filter');
let allPosts = [];

// Fetch posts from API
async function fetchPosts() {
    postsContainer.innerHTML = '<div class="loading" role="status">Loading posts...</div>';

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        allPosts = await response.json();

        // Populate filter dropdown with unique userIds
        populateFilterDropdown();

        // Render all posts
        renderPosts(allPosts);
    } catch (error) {
        postsContainer.innerHTML = `<div class="error" role="alert">Failed to load posts: ${escapeHtml(error.message)}</div>`;
        console.error('Error fetching posts:', error);
    }
}

// Populate filter dropdown with unique user IDs
function populateFilterDropdown() {
    const userIds = [...new Set(allPosts.map(post => post.userId))].sort((a, b) => a - b);

    userIds.forEach(userId => {
        const option = document.createElement('option');
        option.value = userId;
        option.textContent = `User ${userId}`;
        userFilter.appendChild(option);
    });
}

// Render posts to the container
function renderPosts(posts) {
    if (posts.length === 0) {
        postsContainer.innerHTML = '<div class="empty-state" role="status">No posts found for this filter.</div>';
        return;
    }

    postsContainer.innerHTML = posts.map(post => `
        <article class="post-card">
            <div class="post-meta">
                <span class="user-badge">User ${post.userId}</span>
                <span class="id-badge">#${post.id}</span>
            </div>
            <h3>${escapeHtml(post.title)}</h3>
            <p>${escapeHtml(post.body)}</p>
        </article>
    `).join('');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Filter posts by user ID
function filterPosts() {
    const selectedValue = userFilter.value;

    if (selectedValue === 'all') {
        renderPosts(allPosts);
    } else {
        const filteredPosts = allPosts.filter(post => post.userId === parseInt(selectedValue));
        renderPosts(filteredPosts);
    }
}

// Add filter change listener
userFilter.addEventListener('change', filterPosts);

// Initialize - fetch posts on page load
fetchPosts();
