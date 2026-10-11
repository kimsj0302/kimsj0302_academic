// Global state
let allPublications = [];

// Name variants that should be highlighted as "me"
const ME = ['Soongjin Kim', 'S. Kim', 'Soongji Kim'];

// Treat an asset as a video when its path ends in a video extension
const isVideo = (src) => /\.(mp4|webm|ogg)$/i.test(src || '');

// Strip a trailing co-author marker (e.g. "*", "†") before comparing names
const bareName = (author) => author.replace(/[*†‡]+\s*$/, '').trim();

document.addEventListener('DOMContentLoaded', function () {
  loadPublications();

  // Stagger section fade-in
  document.querySelectorAll('section').forEach((section, index) => {
    section.style.animationDelay = `${index * 0.1}s`;
  });

  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});

function loadPublications() {
  fetch('publications.json')
    .then((response) => {
      if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      allPublications = data.publications;
      renderPublications();
    })
    .catch((error) => {
      console.error('Error loading publications:', error);
      const container = document.getElementById('publications-container');
      if (container) container.innerHTML = 'Error loading publications.';
    });
}

function renderPublications() {
  const intl = document.getElementById('publications-container');
  const domestic = document.getElementById('domestic-container');

  const renderInto = (container, pubs) => {
    if (!container) return;
    container.innerHTML = '';
    pubs.forEach((publication) => {
      container.appendChild(createPublicationElement(publication));
    });
  };

  renderInto(intl, allPublications.filter((pub) => !pub.domestic));
  renderInto(domestic, allPublications.filter((pub) => pub.domestic));
}

function createPublicationElement(publication) {
  const pubItem = document.createElement('div');
  pubItem.className = 'publication-item';

  // Thumbnail
  const thumbnail = document.createElement('div');
  thumbnail.className = 'pub-thumbnail';
  thumbnail.onclick = () => openModal(publication.thumbnail);

  if (isVideo(publication.thumbnail)) {
    const thumbnailVideo = document.createElement('video');
    thumbnailVideo.src = publication.thumbnail;
    thumbnailVideo.autoplay = true;
    thumbnailVideo.loop = true;
    thumbnailVideo.muted = true;
    thumbnailVideo.playsInline = true;
    thumbnailVideo.setAttribute('aria-label', `${publication.title} teaser`);
    thumbnail.appendChild(thumbnailVideo);
  } else {
    const thumbnailImg = document.createElement('img');
    thumbnailImg.src = publication.thumbnail;
    thumbnailImg.alt = `${publication.title} thumbnail`;
    thumbnailImg.loading = 'lazy';
    thumbnail.appendChild(thumbnailImg);
  }

  // Content
  const content = document.createElement('div');
  content.className = 'pub-content';

  const title = document.createElement('div');
  title.className = 'pub-title';
  title.textContent = publication.title;
  content.appendChild(title);

  // Authors with highlight for me
  const authors = document.createElement('div');
  authors.className = 'pub-authors';
  authors.innerHTML = publication.authors
    .map((author) =>
      ME.includes(bareName(author))
        ? `<span class="highlight-name">${author}</span>`
        : author
    )
    .join(', ');
  content.appendChild(authors);

  // Venue + optional award
  const venueContainer = document.createElement('div');
  venueContainer.className = 'pub-venue-container';

  const venue = document.createElement('div');
  venue.className = 'pub-venue';
  venue.textContent = publication.venue;
  venueContainer.appendChild(venue);

  if (publication.award && publication.award.length > 0) {
    const award = document.createElement('div');
    award.className = 'pub-award';
    award.textContent = publication.award;
    venueContainer.appendChild(award);
  }
  content.appendChild(venueContainer);

  // Links
  if (publication.links) {
    const links = document.createElement('div');
    links.className = 'pub-links';

    const labels = { pdf: '[PDF]', code: '[Code]', project: '[Project Page]', bibtex: '[BibTeX]', video: '[Video]' };
    Object.keys(labels).forEach((key) => {
      if (publication.links[key]) {
        const a = document.createElement('a');
        a.href = publication.links[key];
        a.textContent = labels[key];
        a.target = '_blank';
        a.rel = 'noopener';
        links.appendChild(a);
      }
    });

    if (links.childElementCount > 0) content.appendChild(links);
  }

  pubItem.appendChild(thumbnail);
  pubItem.appendChild(content);
  return pubItem;
}

// Image / video modal
function openModal(src) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const modalVideo = document.getElementById('modalVideo');
  modal.style.display = 'block';
  setTimeout(() => modal.classList.add('show'), 10);

  if (isVideo(src)) {
    modalImg.style.display = 'none';
    modalImg.src = '';
    modalVideo.style.display = 'block';
    modalVideo.src = src;
    modalVideo.play().catch(() => {});
  } else {
    modalVideo.pause();
    modalVideo.removeAttribute('src');
    modalVideo.style.display = 'none';
    modalImg.style.display = 'block';
    modalImg.src = src;
  }
}

function closeModal() {
  const modal = document.getElementById('imageModal');
  const modalVideo = document.getElementById('modalVideo');
  modal.classList.remove('show');
  if (modalVideo) modalVideo.pause();
  setTimeout(() => (modal.style.display = 'none'), 300);
}

window.onclick = function (event) {
  const modal = document.getElementById('imageModal');
  if (event.target === modal) closeModal();
};
