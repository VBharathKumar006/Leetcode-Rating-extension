const LIGHTBULB_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" class="lc-ext-icon"><path fill-rule="evenodd" d="M12 2a7 7 0 0 0-5.83 10.87 3.014 3.014 0 0 1 .83 2.13V17a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2c0-.82.3-1.58.83-2.13A7 7 0 0 0 12 2Zm-5 7a5 5 0 0 1 10 0c0 1.85-.98 3.48-2.46 4.39A5.014 5.014 0 0 0 13 16.5v.5h-2v-.5c0-1.15-.55-2.26-1.54-3.11A5 5 0 0 1 7 9Zm2 11h6a1 1 0 0 1 0 2H9a1 1 0 0 1 0-2Z" clip-rule="evenodd"></path></svg>`;

let problemData = null;

async function loadProblemData() {
  const url = chrome.runtime.getURL('problem_data.json');
  try {
    const response = await fetch(url);
    problemData = await response.json();
  } catch (err) {
    console.error("LeetCode Rating Extension: Failed to load problem data", err);
  }
}

function getProblemSlug() {
  const pathParts = window.location.pathname.split('/');
  // URL format is usually /problems/problem-slug/ or /problems/problem-slug/description/
  if (pathParts.length >= 3 && pathParts[1] === 'problems') {
    return pathParts[2];
  }
  return null;
}

function createBadge(content, className, nativeClasses = "", asLink = false, linkHref = "") {
  const el = document.createElement(asLink ? 'a' : 'div');
  // Combine native LeetCode classes with our custom identifier
  el.className = `lc-ext-badge ${nativeClasses} ${className}`;
  el.innerHTML = content;
  if (asLink) {
    el.href = linkHref;
    el.target = '_blank';
  }
  return el;
}

function getRatingColor(rating) {
  if (rating >= 2400) return '#ff375f'; // Red (Hard/Guardian)
  if (rating >= 1900) return '#ffb800'; // Orange (Knight/Medium-Hard)
  if (rating >= 1400) return '#00b8a3'; // Teal (Medium)
  return '#00b8a3'; // Default teal
}

function injectBadges() {
  if (document.querySelector('.lc-rating-extension-badges')) {
    return; // Already injected
  }

  const slug = getProblemSlug();
  if (!slug || !problemData || !problemData[slug]) return;

  const data = problemData[slug];

  const difficultyEl = document.querySelector('.text-difficulty-easy, .text-difficulty-medium, .text-difficulty-hard');
  
  if (!difficultyEl) return;

  const container = difficultyEl.parentElement;
  if (!container) return;

  // Extract native classes from the difficulty badge to match styling exactly
  // Filter out the text color classes so we can apply our own
  const nativeClasses = Array.from(difficultyEl.classList)
    .filter(cls => !cls.includes('text-difficulty-'))
    .join(' ');

  const extContainer = document.createElement('div');
  extContainer.className = 'lc-rating-extension-badges flex flex-wrap items-center gap-2';

  // 1. Rating Badge
  if (data.Rating) {
    const ratingColor = getRatingColor(data.Rating);
    const ratingBadge = createBadge(`${LIGHTBULB_SVG} <span style="margin-left: 4px;">Rating ${data.Rating}</span>`, 'lc-ext-rating', nativeClasses);
    ratingBadge.style.color = ratingColor;
    extContainer.appendChild(ratingBadge);
  }

  // 2. Contest Badge
  if (data.Contest) {
    let contestName = data.Contest;
    if (data.ProblemIndex) {
      contestName += ` ${data.ProblemIndex}`;
    }
    const contestSlug = data.ContestSlug || data.Contest.toLowerCase().replace(/\s+/g, '-');
    const contestUrl = `https://leetcode.com/contest/${contestSlug}/`;
    
    const contestBadge = createBadge(contestName, 'lc-ext-contest', nativeClasses, true, contestUrl);
    extContainer.appendChild(contestBadge);
  }

  // 3. Level Badge
  if (data.Level) {
    const levelBadge = createBadge(`Level ${data.Level}`, 'lc-ext-level', nativeClasses);
    extContainer.appendChild(levelBadge);
  }

  // Insert our container before the difficulty element inside its parent
  container.insertBefore(extContainer, difficultyEl);
}

// Observe DOM changes to inject the badges when the page loads or changes
function setupObserver() {
  let lastUrl = location.href;

  const observer = new MutationObserver((mutations) => {
    // Check if URL changed (for Single Page App navigation)
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      // Remove old badges if they exist
      const oldBadges = document.querySelector('.lc-rating-extension-badges');
      if (oldBadges) oldBadges.remove();
    }
    
    // Try to inject
    injectBadges();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

async function init() {
  await loadProblemData();
  setupObserver();
  injectBadges(); // Try once immediately
}

init();
