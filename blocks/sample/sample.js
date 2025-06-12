import { extractElements, html } from '../../scripts/tools.js';

const decorateSample = (block) => {
  const blockElements = extractElements(block, [
    'text',
    'boolean',
    'text',
    'date',
    'number',
    'text',
    'html',
    'text',
    'multiText',
  ]);

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
    multi,
  ] = blockElements;

  if (simpleText) {
    block.insertAdjacentHTML(
      'beforeend',
      html`<p><strong>Simple Text: </strong>${simpleText}</p>`,
    );
  }
  block.insertAdjacentHTML(
    'beforeend',
    html`<p><strong>Boolean: </strong>${boolean.toString()}</p>`,
  );

  if (checkboxGroup) {
    block.insertAdjacentHTML(
      'beforeend',
      html`<p><strong>Checkbox Group: </strong>${checkboxGroup}</p>`,
    );
  }

  // eslint-disable-next-line no-restricted-globals
  if (dateAndTime && !isNaN(Date.parse(dateAndTime))) {
    const dateAndTimeAsString = dateAndTime.toLocaleDateString('en', {
      day: 'numeric',
      month: 'short',
      timeZone: 'UTC',
      year: 'numeric',
    });
    block.insertAdjacentHTML(
      'beforeend',
      html`<p><strong>Date and Time: </strong>${dateAndTimeAsString}</p>`,
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

  if (multi && Array.isArray(multi)) {
    multi.forEach((multiItem) => {
      block.insertAdjacentHTML(
        'beforeend',
        html`<p><strong>Multifield Item: </strong>${multiItem}</p>`,
      );
    });
  }
};

export default decorateSample;
