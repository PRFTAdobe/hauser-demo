import { extractElements } from '../../scripts/tools.js';

const decorateCustom = async (block) => {
  const blockElements = extractElements(block, ['html', 'text']);
  while (block.firstChild) {
    block.removeChild(block.firstChild);
  }
  const [heading, endpoint] = blockElements;
  if (heading && heading.firstElementChild) {
    block.insertAdjacentHTML('beforeBegin', heading.innerHTML || '');
  }

  try {
    const response = await fetch(endpoint);
    const result = await response.json();
    const faqs = result?.data?.faqCfModelList?.items || [];

    block.innerHTML = ''; // clear existing content

    if (!faqs.length) {
      block.insertAdjacentHTML(
        'beforeend',
        '<p class="custom__faq__message custom__faq__message--empty">No FAQs available.</p>',
      );
      return;
    }

    const grid = document.createElement('div');
    grid.className = 'custom__faq';

    faqs.forEach((faq) => {
      const faqItem = document.createElement('div');
      faqItem.className = 'custom__faq__item';

      const question = document.createElement('h3');
      question.className = 'custom__faq__question';
      question.textContent = faq.question;

      const answer = document.createElement('div');
      answer.className = 'custom__faq__answer';
      answer.innerHTML = faq.answer?.html || '';

      faqItem.appendChild(question);
      faqItem.appendChild(answer);

      grid.appendChild(faqItem);
    });
    block.appendChild(grid);
  } catch (error) {
    console.error('Error loading FAQs:', error);
    block.insertAdjacentHTML(
      'beforeend',
      '<p class="custom__faq__message custom__faq__message--error">Failed to load FAQs.</p>',
    );
  }
};

export default decorateCustom;
