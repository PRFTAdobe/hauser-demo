import { extractElements } from '../../scripts/tools.js';

const decorateSample = (block) => {
  const blockElements = extractElements(block);
  while (block.firstChild) {
    block.removeChild(block.firstChild);
  }
  const [
    simpleText,
    boolean,
    checkboxGroup,
    dateAndTime,
    number,
    radioGroup,
    richText,
    select,
  ] = blockElements;

  if (simpleText) {
    block.insertAdjacentHTML(
      'beforeend',
      `<p><strong>Simple Text: </strong>${simpleText}</p>`,
    );
  }
  block.insertAdjacentHTML(
    'beforeend',
    `<p><strong>Boolean: </strong>${boolean === true}</p>`,
  );

  if (checkboxGroup) {
    block.insertAdjacentHTML(
      'beforeend',
      `<p><strong>Checkbox Group: </strong>${checkboxGroup}</p>`,
    );
  }

  // eslint-disable-next-line no-restricted-globals
  if (dateAndTime && !isNaN(Date.parse(dateAndTime))) {
    block.insertAdjacentHTML(
      'beforeend',
      `<p><strong>Date and Time: </strong>${dateAndTime.toLocaleDateString(
        'en',
        {
          day: 'numeric',
          month: 'short',
          timeZone: 'UTC',
          year: 'numeric',
        },
      )}</p>`,
    );
  }

  if (number) {
    block.insertAdjacentHTML(
      'beforeend',
      `<p><strong>Number: </strong>${number}</p>`,
    );
  }

  if (radioGroup) {
    block.insertAdjacentHTML(
      'beforeend',
      `<p><strong>Radio Group: </strong>${radioGroup}</p>`,
    );
  }

  if (richText) {
    if (typeof richText.outerHTML !== 'undefined') {
      block.insertAdjacentHTML(
        'beforeend',
        `<div><p><strong>Rich Text: </strong></p>${richText.outerHTML}</div>`,
      );
    } else {
      block.insertAdjacentHTML(
        'beforeend',
        `<p><strong>Rich Text: </strong>${richText}</p>`,
      );
    }
  }

  if (select) {
    block.insertAdjacentHTML(
      'beforeend',
      `<p><strong>Select: </strong>${select}</p>`,
    );
  }
};

export default decorateSample;
