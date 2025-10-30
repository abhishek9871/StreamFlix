// Cinematic TV - Smart TV Streaming Application
// Optimized for Smart TV Remote Control Navigation and Slow Internet

class CinematicTV {
  constructor() {
    this.apiKey = "61d95006877f80fb61358dbb78f153c3";
    this.baseURL = "https://api.themoviedb.org/3";
    this.imageBaseURL = "https://image.tmdb.org/t/p/w500";
    this.currentSection = "home";
    this.currentItem = null;
    this.focusHistory = [];
    this.loadingStates = new Set();

    this.init();
  }

  async init() {
    this.setupEventListeners();
    this.setupRemoteControlNavigation();
    await this.loadInitialContent();
    // Loading state is managed by individual API requests
    // Bug fix applied - removed duplicate showLoading(false) call
  }

  // API Methods
  async makeRequest(endpoint, params = {}) {
    const url = new URL(`${this.baseURL}${endpoint}`);
    url.searchParams.append("api_key", this.apiKey);

    Object.keys(params).forEach((key) => {
      url.searchParams.append(key, params[key]);
    });

    try {
      this.showLoading(true);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      this.showError("Failed to load content. Please try again.");
      return null;
    } finally {
      this.showLoading(false);
    }
  }

  async getPopularMovies() {
    const data = await this.makeRequest("/movie/popular");
    return data?.results || [];
  }

  async getPopularTVShows() {
    const data = await this.makeRequest("/tv/popular");
    return data?.results || [];
  }

  async getTrendingContent() {
    const data = await this.makeRequest("/trending/all/week");
    return data?.results || [];
  }

  async getTopRatedMovies() {
    const data = await this.makeRequest("/movie/top_rated");
    return data?.results || [];
  }

  async getUpcomingMovies() {
    const data = await this.makeRequest("/movie/upcoming");
    return data?.results || [];
  }

  async getTopRatedTVShows() {
    const data = await this.makeRequest("/tv/top_rated");
    return data?.results || [];
  }

  async getOnAirTVShows() {
    const data = await this.makeRequest("/tv/on_the_air");
    return data?.results || [];
  }

  async searchContent(query) {
    const movies = await this.makeRequest("/search/movie", { query });
    const tvShows = await this.makeRequest("/search/tv", { query });

    return {
      movies: movies?.results || [],
      tvShows: tvShows?.results || [],
    };
  }

  async getMovieDetails(id) {
    return await this.makeRequest(`/movie/${id}`, {
      append_to_response: "credits,videos,watch/providers",
    });
  }

  async getTVShowDetails(id) {
    return await this.makeRequest(`/tv/${id}`, {
      append_to_response: "credits,videos,watch/providers",
    });
  }

  // Content Loading and Display
  async loadInitialContent() {
    try {
      // Load hero content
      const trending = await this.getTrendingContent();
      if (trending.length > 0) {
        this.setupHeroContent(trending[0]);
      }

      // Load content rails
      await Promise.all([
        this.loadTrendingRail(),
        this.loadPopularMoviesRail(),
        this.loadPopularTVRail(),
      ]);
    } catch (error) {
      console.error(
        "Failed to load initial content:",
        error,
        error && error.stack,
      );
    }
  }

  setupHeroContent(item) {
    const heroSection = document.getElementById("heroSection");
    const heroTitle = document.getElementById("heroTitle");
    const heroDescription = document.getElementById("heroDescription");
    const heroPlayBtn = document.getElementById("heroPlayBtn");
    const heroMoreBtn = document.getElementById("heroMoreBtn");

    // If elements are not present yet (edge cases when script runs early), retry shortly
    if (
      !heroSection ||
      !heroTitle ||
      !heroDescription ||
      !heroPlayBtn ||
      !heroMoreBtn
    ) {
      setTimeout(() => this.setupHeroContent(item), 100);
      return;
    }

    heroTitle.textContent = item.title || item.name || "Featured Content";
    heroDescription.textContent =
      item.overview ||
      "Experience amazing content with premium streaming quality.";

    // Set up hero actions
    heroPlayBtn.onclick = () => this.playContent(item);
    heroMoreBtn.onclick = () => this.showDetails(item);

    // Add background image if available
    if (item.backdrop_path) {
      heroSection.style.backgroundImage = `url(${this.imageBaseURL}${item.backdrop_path})`;
      heroSection.style.backgroundSize = "cover";
      heroSection.style.backgroundPosition = "center";
    }
  }

  async loadTrendingRail() {
    const trending = await this.getTrendingContent();
    const container = document.getElementById("trendingRail");
    this.renderContentRail(container, trending.slice(0, 10), "trending");
  }

  async loadPopularMoviesRail() {
    const movies = await this.getPopularMovies();
    const container = document.getElementById("popularMoviesRail");
    this.renderContentRail(container, movies, "movie");
  }

  async loadPopularTVRail() {
    const tvShows = await this.getPopularTVShows();
    const container = document.getElementById("popularTVRail");
    this.renderContentRail(container, tvShows, "tv");
  }

  renderContentRail(container, items, type) {
    container.innerHTML = "";

    items.forEach((item, index) => {
      const card = this.createContentCard(item, type);
      card.setAttribute("tabindex", "0");
      card.dataset.index = index;
      container.appendChild(card);
    });

    // Setup spatial navigation for rail
    this.setupRailNavigation(container);
  }

  createContentCard(item, type) {
    const card = document.createElement("div");
    card.className = "content-card";
    card.dataset.id = item.id;
    card.dataset.type = type;

    const imageUrl = item.poster_path
      ? `${this.imageBaseURL}${item.poster_path}`
      : null;

    card.innerHTML = `
            ${
              imageUrl
                ? `<img src="${imageUrl}" alt="${item.title || item.name}" loading="lazy" crossorigin="anonymous" onerror="this.outerHTML='&lt;div class=\'card-placeholder\'&gt;${type === "movie" ? "🎬" : "📺"}&lt;/div&gt;'">`
                : `<div class="card-placeholder">${type === "movie" ? "🎬" : "📺"}</div>`
            }
            <div class="card-info">
                <div class="card-title">${item.title || item.name}</div>
                <div class="card-meta">
                    <span>${(item.release_date || item.first_air_date || "").split("-")[0] || "N/A"}</span>
                    <span>•</span>
                    <span>${Math.round(item.vote_average * 10) / 10}/10</span>
                </div>
            </div>
        `;

    // Add click handler
    card.addEventListener("click", () => this.handleCardSelect(item, type));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this.handleCardSelect(item, type);
      }
    });

    return card;
  }

  // Remote Control Navigation
  setupRemoteControlNavigation() {
    document.addEventListener("keydown", (e) => this.handleRemoteControl(e));

    // Don't auto-focus on load - let user navigate naturally
    // Focus will be set when user starts navigating with remote
    this.setupInitialFocus();
  }

  setupInitialFocus() {
    // Set up initial focus on first content card when user starts navigating
    const focusFirstContent = () => {
      const firstElement = document.querySelector(".content-card");
      if (firstElement) {
        this.focusElement(firstElement);
      }
      document.removeEventListener("keydown", focusFirstContent);
    };

    document.addEventListener("keydown", focusFirstContent, { once: true });
  }

  handleRemoteControl(e) {
    // Check if video modal is active - if so, let video player handle most controls
    const videoModal = document.querySelector(".video-modal.active");
    const closeButton = document.getElementById("videoClose");
    const focusedElement = document.activeElement;

    if (videoModal) {
      // When video is playing, only handle Back/Escape to close
      // Allow all other keys to pass through to the video iframe
      switch (e.key) {
        case "Escape":
        case "Backspace":
          e.preventDefault();
          this.handleBack();
          return;

        case "Enter":
          // Enter should toggle play/pause if not focused on close button
          if (focusedElement !== closeButton) {
            e.preventDefault();
            // Send play/pause command to video iframe
            this.sendCommandToVideo("playpause");
          }
          return;

        case " ":
          // Space bar for play/pause (alternative to Enter)
          e.preventDefault();
          this.sendCommandToVideo("playpause");
          return;

        case "ArrowUp":
          // Send seek forward command
          e.preventDefault();
          this.sendCommandToVideo("seekforward");
          return;

        case "ArrowDown":
          // Send seek backward command
          e.preventDefault();
          this.sendCommandToVideo("seekbackward");
          return;

        case "ArrowLeft":
          // Send previous episode/track or rewind
          e.preventDefault();
          this.sendCommandToVideo("rewind");
          return;

        case "ArrowRight":
          // Send next episode/track or forward
          e.preventDefault();
          this.sendCommandToVideo("forward");
          return;
      }
      // For volume keys, channel keys, and other Smart TV remote keys
      // Let them pass through - Smart TV handles these at system level
      return;
    }

    // Normal navigation when video is not playing
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        this.navigateUp(focusedElement);
        break;
      case "ArrowDown":
        e.preventDefault();
        this.navigateDown(focusedElement);
        break;
      case "ArrowLeft":
        e.preventDefault();
        this.navigateLeft(focusedElement);
        break;
      case "ArrowRight":
        e.preventDefault();
        this.navigateRight(focusedElement);
        break;
      case "Enter":
        e.preventDefault();
        this.handleEnter(focusedElement);
        break;
      case "Escape":
      case "Backspace":
        e.preventDefault();
        this.handleBack();
        break;
    }
  }

  navigateUp(element) {
    const parent =
      element.closest(".content-rail") || element.closest(".section-header");
    const previousRail = parent?.previousElementSibling;

    if (previousRail && previousRail.classList.contains("content-rail")) {
      const lastCard = previousRail.querySelector(".content-card:last-child");
      if (lastCard) {
        this.focusElement(lastCard);
      }
    } else if (element.classList.contains("content-card")) {
      this.focusSidebar();
    }
  }

  navigateDown(element) {
    const parent = element.closest(".content-rail");

    if (parent) {
      const nextRail = parent.nextElementSibling;
      if (nextRail && nextRail.classList.contains("content-rail")) {
        const firstCard = nextRail.querySelector(".content-card");
        if (firstCard) {
          this.focusElement(firstCard);
        }
      }
    } else if (element.classList.contains("sidebar-item")) {
      const firstRail = document.querySelector(".content-rail .content-card");
      if (firstRail) {
        this.focusElement(firstRail);
      }
    }
  }

  navigateLeft(element) {
    const container =
      element.closest(".rail-container") ||
      element.closest(".content-grid") ||
      element.closest(".search-results");

    if (container) {
      const currentIndex = parseInt(element.dataset.index || 0);
      const previousElement = container.children[currentIndex - 1];

      if (previousElement) {
        this.focusElement(previousElement);
      } else if (container.classList.contains("rail-container")) {
        this.focusSidebar();
      }
    } else if (element.classList.contains("sidebar-item")) {
      // Already at the leftmost element
    }
  }

  navigateRight(element) {
    const container =
      element.closest(".rail-container") ||
      element.closest(".content-grid") ||
      element.closest(".search-results");

    if (container) {
      const currentIndex = parseInt(element.dataset.index || 0);
      const nextElement = container.children[currentIndex + 1];

      if (nextElement) {
        this.focusElement(nextElement);
      }
    } else if (element.classList.contains("sidebar-item")) {
      const firstRail = document.querySelector(".content-rail .content-card");
      if (firstRail) {
        this.focusElement(firstRail);
      }
    }
  }

  focusElement(element) {
    if (element) {
      element.focus();

      // Scroll into view for containers
      const container = element.closest(".rail-container");
      if (container && element.scrollIntoView) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }

  focusSidebar() {
    const sidebar = document.querySelector(".sidebar-item");
    if (sidebar) {
      sidebar.focus();
    }
  }

  handleEnter(element) {
    if (element.classList.contains("content-card")) {
      const item = {
        id: element.dataset.id,
        type: element.dataset.type,
      };
      this.handleCardSelect(item, element.dataset.type);
    } else if (element.classList.contains("sidebar-item")) {
      this.switchSection(element.dataset.section);
    } else if (element.classList.contains("filter-btn")) {
      this.handleFilterChange(element);
    } else if (element.id === "heroPlayBtn") {
      element.click();
    } else if (element.id === "heroMoreBtn") {
      element.click();
    }
  }

  handleBack() {
    if (
      document.querySelector(".modal.active") ||
      document.querySelector(".video-modal.active")
    ) {
      this.closeModal();
      return;
    }

    if (this.currentSection !== "home") {
      this.switchSection("home");
    }
  }

  setupRailNavigation(container) {
    const cards = container.querySelectorAll(".content-card");
    cards.forEach((card, index) => {
      card.dataset.index = index;
    });
  }

  // Section Management
  switchSection(sectionName) {
    // Hide all sections
    document.querySelectorAll(".content-section").forEach((section) => {
      section.classList.remove("active");
    });

    // Show target section
    const targetSection = document.getElementById(`${sectionName}Section`);
    if (targetSection) {
      targetSection.classList.add("active");
      this.currentSection = sectionName;

      // Load section-specific content
      this.loadSectionContent(sectionName);

      // Focus first element in section
      setTimeout(() => {
        const firstFocusable = targetSection.querySelector('[tabindex="0"]');
        if (firstFocusable) {
          this.focusElement(firstFocusable);
        }
      }, 100);
    }
  }

  async loadSectionContent(sectionName) {
    const section = document.getElementById(`${sectionName}Section`);
    if (!section) return;

    switch (sectionName) {
      case "movies":
        await this.loadMoviesSection();
        break;
      case "tv":
        await this.loadTVSection();
        break;
      case "search":
        this.setupSearchInterface();
        break;
    }
  }

  async loadMoviesSection() {
    const grid = document.getElementById("moviesGrid");
    const movies = await this.getPopularMovies();
    grid.innerHTML = "";

    movies.forEach((movie, index) => {
      const card = this.createContentCard(movie, "movie");
      card.setAttribute("tabindex", "0");
      card.dataset.index = index;
      grid.appendChild(card);
    });
  }

  async loadTVSection() {
    const grid = document.getElementById("tvGrid");
    const tvShows = await this.getPopularTVShows();
    grid.innerHTML = "";

    tvShows.forEach((show, index) => {
      const card = this.createContentCard(show, "tv");
      card.setAttribute("tabindex", "0");
      card.dataset.index = index;
      grid.appendChild(card);
    });
  }

  setupSearchInterface() {
    const searchInput = document.getElementById("searchInput");
    if (searchInput && !searchInput.dataset.setup) {
      searchInput.dataset.setup = "true";
      searchInput.addEventListener("input", (e) => {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
          this.performSearch(e.target.value);
        }, 500);
      });

      // Focus search input
      searchInput.focus();
    }
  }

  async performSearch(query) {
    if (!query.trim()) {
      document.getElementById("searchResults").innerHTML = "";
      return;
    }

    try {
      const results = await this.searchContent(query);
      this.displaySearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
    }
  }

  displaySearchResults(results) {
    const container = document.getElementById("searchResults");
    container.innerHTML = "";

    const allResults = [...results.movies, ...results.tvShows];

    allResults.forEach((item, index) => {
      const type = item.title ? "movie" : "tv";
      const card = this.createContentCard(item, type);
      card.setAttribute("tabindex", "0");
      card.dataset.index = index;
      container.appendChild(card);
    });
  }

  handleFilterChange(button) {
    // Remove active class from all filters
    button.parentElement.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.remove("active");
    });

    // Add active class to clicked filter
    button.classList.add("active");

    // Load filtered content
    const filter = button.dataset.filter;
    this.loadFilteredContent(filter);
  }

  async loadFilteredContent(filter) {
    const section = this.currentSection;
    let items = [];

    switch (section) {
      case "movies":
        if (filter === "popular") items = await this.getPopularMovies();
        else if (filter === "top_rated") items = await this.getTopRatedMovies();
        else if (filter === "upcoming") items = await this.getUpcomingMovies();
        break;
      case "tv":
        if (filter === "popular") items = await this.getPopularTVShows();
        else if (filter === "top_rated")
          items = await this.getTopRatedTVShows();
        else if (filter === "on_the_air") items = await this.getOnAirTVShows();
        break;
    }

    const grid = document.getElementById(`${section}Grid`);
    grid.innerHTML = "";

    items.forEach((item, index) => {
      const type = section === "movies" ? "movie" : "tv";
      const card = this.createContentCard(item, type);
      card.setAttribute("tabindex", "0");
      card.dataset.index = index;
      grid.appendChild(card);
    });
  }

  // Content Actions
  handleCardSelect(item, type) {
    if (item.id) {
      this.showDetails(item, type);
    }
  }

  async showDetails(item, type = null) {
    try {
      this.showLoading(true);

      let details;
      if (type === "movie" || item.title) {
        details = await this.getMovieDetails(item.id);
      } else {
        details = await this.getTVShowDetails(item.id);
      }

      if (details) {
        this.displayDetailsModal(details);
      }
    } catch (error) {
      console.error("Failed to load details:", error);
    } finally {
      this.showLoading(false);
    }
  }

  displayDetailsModal(details) {
    const modal = document.getElementById("detailModal");
    const modalBody = document.getElementById("modalBody");

    const isMovie = !!details.title;
    const title = details.title || details.name;
    const releaseDate = details.release_date || details.first_air_date;
    const year = releaseDate ? releaseDate.split("-")[0] : "N/A";

    const posterUrl = details.poster_path
      ? `${this.imageBaseURL}${details.poster_path}`
      : null;
    const backdropUrl = details.backdrop_path
      ? `${this.imageBaseURL}${details.backdrop_path}`
      : null;

    modalBody.innerHTML = `
            <div class="detail-header">
                ${
                  posterUrl
                    ? `<img src="${posterUrl}" alt="${title}" class="detail-poster" crossorigin="anonymous" onerror="this.outerHTML='&lt;div class=\'detail-poster\' style=\'background:#333;display:flex;align-items:center;justify-content:center;font-size:48px;\'&gt;📺&lt;/div&gt;'">`
                    : '<div class="detail-poster" style="background: #333; display: flex; align-items: center; justify-content: center; font-size: 48px;">📺</div>'
                }
                <div class="detail-info">
                    <h2 class="detail-title">${title}</h2>
                    <div class="detail-meta">
                        <span>${year}</span>
                        <span>•</span>
                        <span>${Math.round(details.vote_average * 10) / 10}/10</span>
                        <span>•</span>
                        <span>${isMovie ? details.runtime + " min" : details.number_of_seasons + " Season" + (details.number_of_seasons !== 1 ? "s" : "")}</span>
                    </div>
                    <div class="detail-genres">
                        ${details.genres.map((genre) => `<span class="genre-tag">${genre.name}</span>`).join("")}
                    </div>
                    <p class="detail-description">${details.overview || "No description available."}</p>
                    <div class="detail-actions">
                        <button class="btn-primary" onclick="app.playContent(${JSON.stringify(details).replace(/"/g, "&quot;")})">▶ Play</button>
                        ${!isMovie ? `<button class="btn-secondary" onclick="app.showEpisodeSelector(${details.id})">📺 Episodes</button>` : ""}
                    </div>
                </div>
            </div>
        `;

    modal.classList.add("active");
  }

  async playContent(item, episode = null) {
    const modal = document.getElementById("videoModal");
    const videoFrame = document.getElementById("videoFrame");

    const isMovie = !!item.title;
    let embedUrl;

    if (isMovie) {
      embedUrl = `https://vidsrc.cc/v2/embed/movie/${item.id}?autoPlay=true&controls=1`;
    } else {
      if (episode) {
        embedUrl = `https://vidsrc.cc/v2/embed/tv/${item.id}/${episode.season}/${episode.episode}?autoPlay=true&controls=1`;
      } else {
        embedUrl = `https://vidsrc.cc/v2/embed/tv/${item.id}?autoPlay=true&controls=1`;
      }
    }

    videoFrame.src = embedUrl;
    modal.classList.add("active");

    // Setup video player controls
    this.setupVideoControls(item, episode);
  }

  setupVideoControls(item, episode) {
    const videoFrame = document.getElementById("videoFrame");
    const closeButton = document.getElementById("videoClose");

    // Focus the video iframe when modal opens
    setTimeout(() => {
      videoFrame.focus();
    }, 100);

    // Also allow focusing close button with specific remote key combinations
    // (This is optional - the close button will still work with Back/Escape)

    // Listen for video player events
    window.addEventListener("message", (event) => {
      if (event.origin !== "https://vidsrc.cc") return;

      if (event.data && event.data.type === "PLAYER_EVENT") {
        console.log("Player event:", event.data.data);

        // Update control states based on events
        const { event: eventType, currentTime, duration } = event.data.data;

        if (eventType === "complete") {
          this.handleVideoComplete(item, episode);
        }
      }
    });
  }

  sendCommandToVideo(command) {
    const videoFrame = document.getElementById("videoFrame");
    if (!videoFrame || !videoFrame.contentWindow) return;

    // Send command to video player via postMessage
    videoFrame.contentWindow.postMessage(
      {
        type: "REMOTE_COMMAND",
        command: command,
      },
      "https://vidsrc.cc",
    );
  }

  handleVideoComplete(item, episode) {
    // Auto-play next episode for TV shows
    if (!item.title && episode) {
      setTimeout(() => {
        this.playNextEpisode(item, episode);
      }, 3000); // Wait 3 seconds before next episode
    }
  }

  async playNextEpisode(show, currentEpisode) {
    try {
      const details = await this.getTVShowDetails(show.id);
      const seasons = details.seasons || [];
      const currentSeason = seasons.find(
        (s) => s.season_number === currentEpisode.season,
      );

      if (
        currentSeason &&
        currentEpisode.episode < currentSeason.episode_count
      ) {
        const nextEpisode = {
          season: currentEpisode.season,
          episode: currentEpisode.episode + 1,
          name: `Episode ${currentEpisode.episode + 1}`,
        };

        this.playContent(show, nextEpisode);
      }
    } catch (error) {
      console.error("Failed to play next episode:", error);
    }
  }

  showEpisodeSelector(showId) {
    // Implementation for episode selector
    // This would typically show a modal with seasons and episodes
    console.log("Episode selector for show:", showId);
  }

  closeModal() {
    document.querySelectorAll(".modal, .video-modal").forEach((modal) => {
      modal.classList.remove("active");
    });

    // Clear video frame source
    const videoFrame = document.getElementById("videoFrame");
    if (videoFrame) {
      videoFrame.src = "";
    }
  }

  // Utility Methods
  setupEventListeners() {
    // Modal close buttons
    document
      .getElementById("modalClose")
      .addEventListener("click", () => this.closeModal());
    document
      .getElementById("videoClose")
      .addEventListener("click", () => this.closeModal());

    // Sidebar navigation
    document.querySelectorAll(".sidebar-item").forEach((item) => {
      item.addEventListener("click", () => {
        this.switchSection(item.dataset.section);
      });
    });

    // Filter buttons
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.handleFilterChange(btn);
      });
    });

    // Close modals when clicking outside
    document.querySelectorAll(".modal, .video-modal").forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.closeModal();
        }
      });
    });
  }

  showLoading(show) {
    const indicator = document.getElementById("loadingIndicator");
    if (show) {
      indicator.classList.add("active");
    } else {
      indicator.classList.remove("active");
    }
  }

  showError(message) {
    console.error(message);
    // In a production app, you'd show a user-friendly error message
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.app = new CinematicTV();
});

// Performance optimizations for slow internet
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Service worker registration failed
    });
  });
}
