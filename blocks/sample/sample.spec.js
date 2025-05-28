import { beforeAll, describe, expect, test } from '@jest/globals';

import decorateSample from './sample.js';

let block;

beforeAll(() => {
  const blockAsString = `<div
      class="sample block"
      data-block-name="sample"
      data-block-status="loaded"
    >
      <div>
        <div><p>Booyah!</p></div>
      </div>
      <div>
        <div><p>true</p></div>
      </div>
      <div>
        <div><p>option1</p></div>
      </div>
      <div>
        <div><p>2025-05-24T00:00:00.000Z</p></div>
      </div>
      <div>
        <div><p>3</p></div>
      </div>
      <div>
        <div><p>option2</p></div>
      </div>
      <div>
        <div>
          <p>
            Here's the story of a lovely lady<br/>Who was bringing up three
            very lovely girls<br/>All of them had hair of gold like their
            mother<br/>The youngest one in curls
          </p>
          <p>
            It's the story of a man named Brady<br/>Who was busy with three
            boys of his own<br/>They were four men living all together<br/>Yet
            they were all alone
          </p>
          <p>
            'Til the one day when the lady met this fellow<br/>And they knew
            that it was much more than a hunch<br/>That this group must somehow
            form a family<br/>That's the way we all became the Brady bunch
          </p>
          <p>
            The Brady bunch, the Brady bunch<br/>That's the way we became the
            Brady bunch
          </p>
        </div>
      </div>
      <div>
        <div><p>option1</p></div>
      </div>
    </div>`;
  const parser = new DOMParser();
  const document = parser.parseFromString(blockAsString, 'text/html');
  block = document.body.firstChild;
  decorateSample(block);
});

describe('Sample', () => {
  test('it outputs the appropriate simple text', () => {
    const firstParagraph = block.querySelector(':scope > p:nth-child(1)');
    expect(firstParagraph.innerHTML).toEqual(
      '<strong>Simple Text: </strong>Booyah!',
    );
  });

  test('it outputs the appropriate boolean', () => {
    const firstParagraph = block.querySelector(':scope > p:nth-child(2)');
    expect(firstParagraph.innerHTML).toEqual('<strong>Boolean: </strong>true');
  });

  test('it outputs the appropriate checkbox group', () => {
    const firstParagraph = block.querySelector(':scope > p:nth-child(3)');
    expect(firstParagraph.innerHTML).toEqual(
      '<strong>Checkbox Group: </strong>option1',
    );
  });

  test('it outputs the appropriate date and time', () => {
    const firstParagraph = block.querySelector(':scope > p:nth-child(4)');
    expect(firstParagraph.innerHTML).toEqual(
      '<strong>Date and Time: </strong>May 24, 2025',
    );
  });

  test('it outputs the appropriate numeric value', () => {
    const firstParagraph = block.querySelector(':scope > p:nth-child(5)');
    expect(firstParagraph.innerHTML).toEqual('<strong>Number: </strong>3');
  });

  test('it outputs the appropriate radio group', () => {
    const firstParagraph = block.querySelector(':scope > p:nth-child(6)');
    expect(firstParagraph.innerHTML).toEqual(
      '<strong>Radio Group: </strong>option2',
    );
  });

  test('it outputs the appropriate rich text', () => {
    const firstDiv = block.querySelector(':scope > div:nth-child(7) > div');
    expect(firstDiv.outerHTML).toEqual(`<div class="rich-text">
          <p>
            Here's the story of a lovely lady<br>Who was bringing up three
            very lovely girls<br>All of them had hair of gold like their
            mother<br>The youngest one in curls
          </p>
          <p>
            It's the story of a man named Brady<br>Who was busy with three
            boys of his own<br>They were four men living all together<br>Yet
            they were all alone
          </p>
          <p>
            'Til the one day when the lady met this fellow<br>And they knew
            that it was much more than a hunch<br>That this group must somehow
            form a family<br>That's the way we all became the Brady bunch
          </p>
          <p>
            The Brady bunch, the Brady bunch<br>That's the way we became the
            Brady bunch
          </p>
        </div>`);
  });

  test('it outputs the appropriate select', () => {
    const firstParagraph = block.querySelector(':scope > p:nth-child(8)');
    expect(firstParagraph.innerHTML).toEqual(
      '<strong>Select: </strong>option1',
    );
  });

  test('it outputs the appropriate rich text when content is single line', () => {
    const blockAsString = `<div
      class="sample block"
      data-block-name="sample"
      data-block-status="loaded"
    >
      <div>
        <div><p>Booyah!</p></div>
      </div>
      <div>
        <div><p>true</p></div>
      </div>
      <div>
        <div><p>option1</p></div>
      </div>
      <div>
        <div><p>2025-05-24T00:00:00.000Z</p></div>
      </div>
      <div>
        <div><p>3</p></div>
      </div>
      <div>
        <div><p>option2</p></div>
      </div>
      <div>
        <div><p>The Brady bunch, the Brady bunch</p></div>
      </div>
      <div>
        <div><p>option1</p></div>
      </div>
    </div>`;
    const parser = new DOMParser();
    const document = parser.parseFromString(blockAsString, 'text/html');
    block = document.body.firstChild;
    decorateSample(block);
    const firstParagraph = block.querySelector(':scope > p:nth-child(7)');
    expect(firstParagraph.innerHTML).toEqual(
      `<strong>Rich Text: </strong>The Brady bunch, the Brady bunch`,
    );
  });
});
