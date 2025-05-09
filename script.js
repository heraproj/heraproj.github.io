// Scroll animation for fade-in effect
document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll(".fade-in");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                // If already in view OR scrolled past ~70% of screen height
                if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight * 0.7) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target); // Stop observing once it's visible
                }
            });
        },
        {
            root: null, // Uses viewport
            rootMargin: "0px",
            threshold: 0 // Detects as soon as any part is in view
        }
    );

    elements.forEach((element) => observer.observe(element));
});

// Drop shadow effect on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.site-header');
    if (window.scrollY > 0) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Background particle effects
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const numParticles = 100; // Adjust for density
const particles = [];

// Initialize particles function (extracted to be reusable)
function initializeParticles() {
    // Clear existing particles
    particles.length = 0;

    // Initialize slow-moving particles
    for (let i = 0; i < numParticles; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1, // Smaller, subtle particles
            dx: (Math.random() - 0.5) * 0.25, // Slow horizontal movement
            dy: (Math.random() - 0.5) * 0.25, // Slow vertical movement
            opacity: Math.random() * 0.5 + 0.3, // Keep them subtle
        });
    }
}

// Initialize particles on load
initializeParticles();

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', function () {
    // Clear the timeout if it's been set
    if (resizeTimeout) {
        clearTimeout(resizeTimeout);
    }

    // Set a timeout to prevent multiple resize events from triggering too many redraws
    resizeTimeout = setTimeout(function () {
        // Update canvas dimensions to match window
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Reinitialize particles for new dimensions
        initializeParticles();
    }, 100); // Wait for 100ms after resize ends before redrawing
});

// Animate particles
function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        if (particles.indexOf(p) < numParticles / 2) {
            ctx.fillStyle = `rgba(255, 255, 0, ${p.opacity})`; // Yellow
        } else {
            ctx.fillStyle = `rgba(88, 166, 255, ${p.opacity})`; // Blue
        }
        ctx.fill();

        // Update position
        p.x += p.dx;
        p.y += p.dy;

        // Boundary check - loop around
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
    });

    requestAnimationFrame(drawParticles);
}

// drawParticles();

// Code demo script
const codeSnippets = [
    { line: 1, numLines: 1, description: 'Wrapper classes provide syntactic sugar and code completion' },
    { line: 3, numLines: 3, description: 'The <code>@script</code> decorator lets you run <em>any</em> function on Kubernetes' },
    { line: 7, numLines: 4, description: 'The <code>Workflow</code> context is where you build out the orchestration logic, <em>outside</em> of your business logic' },
    { line: 11, numLines: 6, description: 'The <code>DAG</code> definition specifies the tasks and the workflow execution order' },
    { line: 18, numLines: 1, description: 'The <code>w.create()</code> method creates the workflow on Argo' }
];

let currentSnippetIndex = 0;
let snippetInterval;
const pauseDuration = 10000; // 10 seconds

function updateCodeSnippet() {
    const overlay = document.getElementById("highlight-overlay");
    const snippet = codeSnippets[currentSnippetIndex];
    const codeElement = document.getElementById("code-snippet");

    // Get the line height in pixels
    const lineHeight = parseFloat(getComputedStyle(codeElement).lineHeight);

    // Calculate pixel values
    const startLine = snippet.line - 1; // Convert to 0-based index
    const topPixels = startLine * lineHeight;
    const heightPixels = snippet.numLines * lineHeight;

    // Add the offset of the codeElement to the top position
    const codeElementOffsetTop = codeElement.offsetTop;

    // Apply pixel values
    overlay.style.top = `${topPixels + codeElementOffsetTop}px`;
    overlay.style.height = `${heightPixels}px`;

    // Update description
    const descriptionElement = document.getElementById("demo-description");
    descriptionElement.innerHTML = snippet.description;
}

function showNextSnippet() {
    currentSnippetIndex = (currentSnippetIndex + 1) % codeSnippets.length;
    updateCodeSnippet();
}

function showPrevSnippet() {
    currentSnippetIndex = (currentSnippetIndex - 1 + codeSnippets.length) % codeSnippets.length;
    updateCodeSnippet();
}

function resetSnippetInterval() {
    clearInterval(snippetInterval);
    snippetInterval = setInterval(showNextSnippet, 5000); // Change snippet every 5 seconds
}

function pauseSnippetInterval() {
    clearInterval(snippetInterval);
    setTimeout(resetSnippetInterval, pauseDuration);
}

document.getElementById("prev-button").addEventListener("click", () => {
    showPrevSnippet();
    pauseSnippetInterval();
});

document.getElementById("next-button").addEventListener("click", () => {
    showNextSnippet();
    pauseSnippetInterval();
});

// Initialize the first snippet and start the interval
document.addEventListener("DOMContentLoaded", () => {
    updateCodeSnippet();
    snippetInterval = setInterval(showNextSnippet, 5000);
});

// Fetch GitHub star count and update the button
document.addEventListener("DOMContentLoaded", () => {
    const starCountHeroElement = document.getElementById("star-count");
    const starCountStatElement = document.getElementById("github-stars");
    const contributorStatElement = document.getElementById("github-contributors");
    const pullRequestStatElement = document.getElementById("github-pull-requests");
    const commitsStatElement = document.getElementById("github-commits");


    fetch("https://api.github.com/repos/argoproj-labs/hera")
        .then(response => response.json())
        .then(data => {
            if (data.stargazers_count) {
                const roundedStars = Math.trunc(data.stargazers_count / 100) * 100;
                starCountHeroElement.textContent = `${roundedStars.toLocaleString()}+`;
                starCountStatElement.textContent = `${roundedStars.toLocaleString()}+`;
            }
            if (data.commits_url) {
                // Estimate commits from default branch
                fetch(`https://api.github.com/repos/argoproj-labs/hera/commits?per_page=1`)
                    .then(res => res.headers.get("Link"))
                    .then(linkHeader => {
                        const match = linkHeader?.match(/&page=(\d+)>; rel="last"/);
                        if (match) {
                            const roundedCommits = Math.trunc(parseInt(match[1]) / 10) * 10;
                            commitsStatElement.textContent = `${roundedCommits.toLocaleString()}+`;
                        }
                    })
                    .catch(() => {
                        commitsStatElement.textContent = "N/A";
                    });
            }
        })
        .catch(error => {
            console.error("Error fetching star count:", error);
            // Fallback to a default value if the API call fails
            const backupNumber = 700;
            starCountHeroElement.textContent = `${backupNumber.toLocaleString()}+`;
            starCountStatElement.textContent = `${backupNumber.toLocaleString()}+`;
        });

    // Contributors
    fetch("https://api.github.com/repos/argoproj-labs/hera/contributors?per_page=1&anon=true")
        .then(res => res.headers.get("Link"))
        .then(linkHeader => {
            const match = linkHeader?.match(/&page=(\d+)>; rel="last"/);
            if (match) {
                const roundedContributors = Math.trunc(parseInt(match[1]) / 10) * 10;
                contributorStatElement.textContent = `${roundedContributors.toLocaleString()}+`;
            }
        })
        .catch(() => {
            const backupNumber = 60;
            contributorStatElement.textContent = `${backupNumber.toLocaleString()}+`;
        });

    // Pull requests
    fetch("https://api.github.com/search/issues?q=repo:argoproj-labs/hera+is:pr")
        .then(res => res.json())
        .then(data => {
            if (data.total_count) {
                const roundedPullRequests = Math.trunc(data.total_count / 10) * 10;
                pullRequestStatElement.textContent = `${roundedPullRequests.toLocaleString()}+`;
            }
        })
        .catch(() => {
            const backupNumber = 730;
            pullRequestStatElement.textContent = `${backupNumber.toLocaleString()}+`;
        });
});