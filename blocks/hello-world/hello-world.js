import { extractElements } from '../../scripts/tools.js';

const decorateHelloWorld = (block) => {
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
  block.insertAdjacentHTML(
    'beforeend',
    `<p><strong>Simple Text: </strong>${simpleText}</p>`,
  );
  block.insertAdjacentHTML(
    'beforeend',
    `<p><strong>Boolean: </strong>${boolean}</p>`,
  );
  block.insertAdjacentHTML(
    'beforeend',
    `<p><strong>Checkbox Group: </strong>${checkboxGroup}</p>`,
  );
  block.insertAdjacentHTML(
    'beforeend',
    `<p><strong>Date and Time: </strong>${dateAndTime.toLocaleDateString('en', {
      day: 'numeric',
      month: 'short',
      timeZone: 'UTC',
      year: 'numeric',
    })}</p>`,
  );
  block.insertAdjacentHTML(
    'beforeend',
    `<p><strong>Number: </strong>${number}</p>`,
  );
  block.insertAdjacentHTML(
    'beforeend',
    `<p><strong>Radio Group: </strong>${radioGroup}</p>`,
  );
  block.insertAdjacentHTML(
    'beforeend',
    `<div><p><strong>Rich Text: </strong></p>${richText.outerHTML}</div>`,
  );
  block.insertAdjacentHTML(
    'beforeend',
    `<p><strong>Select: </strong>${select}</p>`,
  );
};

export default decorateHelloWorld;
