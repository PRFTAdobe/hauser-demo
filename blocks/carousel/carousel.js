import { fetchPlaceholders } from '../../scripts/placeholders.js';
import { html } from '../../scripts/tools.js';

export const bindEvents = (block) => {
  const slideIndicators = block.querySelector('.carousel__indicators');
  if (!slideIndicators) return;

  slideIndicators.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
      const slideIndicator = e.currentTarget.parentElement;
      showSlide(block, parseInt(slideIndicator.dataset.targetSlide, 10));
    });
  });

  block.querySelector('.slide-prev').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) - 1);
  });
  block.querySelector('.slide-next').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
  });

  const slideObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) updateActiveSlide(entry.target);
      });
    },
    { threshold: 0.5 },
  );
  block.querySelectorAll('.carousel__slide').forEach((slide) => {
    slideObserver.observe(slide);
  });
};

const createSlide = (row, slideIndex) => {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.classList.add('carousel__slide');

  row.querySelectorAll(':scope > div').forEach((column, colIdx) => {
    column.classList.add(
      `carousel__slide-${colIdx === 0 ? 'image' : 'content'}`,
    );
    slide.append(column);
  });

  const labeledBy = slide.querySelector('h1, h2, h3, h4, h5, h6');
  if (labeledBy) {
    slide.setAttribute('aria-labelledby', labeledBy.getAttribute('id'));
  }

  return slide;
};

const showSlide = (block, slideIndex = 0) => {
  const slides = block.querySelectorAll('.carousel__slide');
  let realSlideIndex = slideIndex < 0 ? slides.length - 1 : slideIndex;
  if (slideIndex >= slides.length) realSlideIndex = 0;
  const activeSlide = slides[realSlideIndex];

  activeSlide
    .querySelectorAll('a')
    .forEach((link) => link.removeAttribute('tabindex'));
  block.querySelector('.carousel__slides').scrollTo({
    behavior: 'smooth',
    left: activeSlide.offsetLeft,
    top: 0,
  });
};

export const updateActiveSlide = (slide) => {
  const block = slide.closest('.carousel');
  const slideIndex = parseInt(slide.dataset.slideIndex, 10);
  block.dataset.activeSlide = slideIndex;

  const slides = block.querySelectorAll('.carousel__slide');

  slides.forEach((slideItem, idx) => {
    slideItem.setAttribute('aria-hidden', idx !== slideIndex);
    slideItem.querySelectorAll('a').forEach((link) => {
      if (idx !== slideIndex) {
        link.setAttribute('tabindex', '-1');
      } else {
        link.removeAttribute('tabindex');
      }
    });
  });

  const indicators = block.querySelectorAll('.carousel__indicator');
  indicators.forEach((indicator, idx) => {
    if (idx !== slideIndex) {
      indicator.querySelector('button').removeAttribute('disabled');
    } else {
      indicator.querySelector('button').setAttribute('disabled', 'true');
    }
  });
};

const decorateCarousel = async (block) => {
  const rows = block.querySelectorAll(':scope > div');
  const isSingleSlide = rows.length < 2;

  const placeholders = await fetchPlaceholders();

  block.setAttribute('role', 'region');
  block.setAttribute(
    'aria-roledescription',
    placeholders.carousel || 'Carousel',
  );

  const container = document.createElement('div');
  container.classList.add('carousel__slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel__slides');
  block.prepend(slidesWrapper);

  let slideIndicators;
  if (!isSingleSlide) {
    const slideIndicatorsNav = document.createElement('nav');
    slideIndicatorsNav.setAttribute(
      'aria-label',
      placeholders.carouselSlideControls || 'Carousel Slide Controls',
    );
    slideIndicators = document.createElement('ol');
    slideIndicators.classList.add('carousel__indicators');
    slideIndicatorsNav.append(slideIndicators);
    block.append(slideIndicatorsNav);

    const slideNavButtons = document.createElement('div');
    slideNavButtons.classList.add('carousel__navigation-buttons');
    slideNavButtons.innerHTML = html`
      <button
        type="button"
        class="slide-prev carousel__navigation-button"
        aria-label="${placeholders.previousSlide || 'Previous Slide'}"
      ></button>
      <button
        type="button"
        class="slide-next carousel__navigation-button"
        aria-label="${placeholders.nextSlide || 'Next Slide'}"
      ></button>
    `;

    container.append(slideNavButtons);
  }

  rows.forEach((row, idx) => {
    const slide = createSlide(row, idx);
    slidesWrapper.append(slide);

    if (slideIndicators) {
      const indicator = document.createElement('li');
      indicator.classList.add('carousel__indicator');
      indicator.dataset.targetSlide = idx;
      indicator.innerHTML = html` <button
        class="carousel__indicator-button"
        type="button"
        aria-label="${placeholders.showSlide || 'Show Slide'} ${idx +
        1} ${placeholders.of || 'of'} ${rows.length}"
      ></button>`;
      slideIndicators.append(indicator);
    }
    row.remove();
  });

  container.append(slidesWrapper);
  block.prepend(container);

  if (!isSingleSlide) {
    bindEvents(block);
  }
};

export default decorateCarousel;
