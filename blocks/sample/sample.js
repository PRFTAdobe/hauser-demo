import { extractElements, html } from '../../scripts/tools.js';

const decorateSample = (block) => {
  const blockElements = extractElements(block, [6]);
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
      html`<p><strong>Simple Text: </strong>${simpleText}</p>`,
    );
  }
  block.insertAdjacentHTML(
    'beforeend',
    html`<p><strong>Boolean: </strong>${boolean === true}</p>`,
  );

  if (checkboxGroup) {
    block.insertAdjacentHTML(
      'beforeend',
      html`<p><strong>Checkbox Group: </strong>${checkboxGroup}</p>`,
    );
  }

  // eslint-disable-next-line no-restricted-globals
  if (dateAndTime && !isNaN(Date.parse(dateAndTime))) {
    block.insertAdjacentHTML(
      'beforeend',
      html`<p>
        <strong>Date and Time: </strong>${dateAndTime.toLocaleDateString('en', {
          day: 'numeric',
          month: 'short',
          timeZone: 'UTC',
          year: 'numeric',
        })}
      </p>`,
    );
  }

  if (number) {
    block.insertAdjacentHTML(
      'beforeend',
      html`<p><strong>Number: </strong>${number}</p>`,
    );
  }

  if (radioGroup) {
    block.insertAdjacentHTML(
      'beforeend',
      html`<p><strong>Radio Group: </strong>${radioGroup}</p>`,
    );
  }

  if (richText) {
    block.insertAdjacentHTML(
      'beforeend',
      html` <div>
        <p><strong>Rich Text: </strong></p>
        ${richText.outerHTML}
      </div>`,
    );
  }

  if (select) {
    block.insertAdjacentHTML(
      'beforeend',
      html`<p><strong>Select: </strong>${select}</p>`,
    );
  }
};

export default decorateSample;
