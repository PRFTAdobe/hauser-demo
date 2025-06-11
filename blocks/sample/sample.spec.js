/**
 * @jest-environment jsdom
 */

import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import beautify from 'js-beautify';

import { extractElements, html } from '../../scripts/tools.js';
import decorateSample from './sample.js';

// Mock the entire tools.js module
jest.mock('../../scripts/tools.js', () => {
  return {
    // Mock the extractElements function to return controlled data for our tests
    extractElements: jest.fn(),
    // A simple mock for the html tagged template literal.
    // It joins the string parts with the interpolated values.
    html: (strings, ...values) => {
      return strings.reduce((acc, str, i) => acc + str + (values[i] || ''), '');
    },
  };
});

describe('decorateSample', () => {
  let block;

  // Before each test, create a fresh div element to act as our "block"
  beforeEach(() => {
    document.body.innerHTML = '<div id="sample-block">Initial Content</div>';
    block = document.getElementById('sample-block');
    // Reset any mock history before each test
    extractElements.mockClear();
  });

  test('should render all elements when all data is provided', () => {
    // Arrange: Mock the data that extractElements will return
    const mockRichText = document.createElement('div');
    mockRichText.innerHTML = '<p>This is rich text.</p>';

    const mockData = [
      'Hello World', // simpleText
      true, // boolean
      'Option 1, Option 3', // checkboxGroup
      new Date('2024-01-15T00:00:00.000Z'), // dateAndTime
      12345, // number
      'Yes', // radioGroup
      mockRichText, // richText
      'Choice A', // select
      'Multi 1; Multi 2', // multi
    ];
    extractElements.mockReturnValue(mockData);

    // Act: Run the function we are testing
    decorateSample(block);

    const beautifulHtml = beautify.html(block.innerHTML);

    // Assert: Check if the block's innerHTML matches our expectations
    expect(beautifulHtml).toContain(
      '<p><strong>Simple Text: </strong>Hello World</p>',
    );
    expect(beautifulHtml).toContain('<p><strong>Boolean: </strong>true</p>');
    expect(beautifulHtml).toContain(
      '<p><strong>Checkbox Group: </strong>Option 1, Option 3</p>',
    );

    const expectedDateAndTime = beautify.html(
      html`<strong>Date and Time: </strong>Jan 15, 2024`,
    );
    // Note: The date is formatted according to the function's logic
    expect(beautifulHtml).toContain(expectedDateAndTime);
    expect(beautifulHtml).toContain('<p><strong>Number: </strong>12345</p>');
    expect(beautifulHtml).toContain('<p><strong>Radio Group: </strong>Yes</p>');
    const expectedRichText = beautify.html(
      html`<div>
        <p><strong>Rich Text: </strong></p>
        <div><p>This is rich text.</p></div>
      </div>`,
    );
    expect(beautifulHtml).toContain(expectedRichText);
    expect(beautifulHtml).toContain('<p><strong>Select: </strong>Choice A</p>');
    expect(beautifulHtml).toContain(
      '<p><strong>Multifield: </strong>Multi 1; Multi 2</p>',
    );

    // Also assert that the initial content is gone
    expect(beautifulHtml).not.toContain('Initial Content');
  });

  test('should handle missing optional elements gracefully', () => {
    // Arrange: Mock data with several fields missing (undefined)
    const mockData = [
      undefined, // simpleText
      false, // boolean
      undefined, // checkboxGroup
      undefined, // dateAndTime
      5, // number
      undefined, // radioGroup
      undefined, // richText
      'Choice B', // select
      undefined, // multi
    ];
    extractElements.mockReturnValue(mockData);

    // Act
    decorateSample(block);

    // Assert: Only the elements with data should be rendered
    expect(block.innerHTML).not.toContain('<strong>Simple Text: </strong>');
    expect(block.innerHTML).toContain('<p><strong>Boolean: </strong>false</p>'); // Booleans always render
    expect(block.innerHTML).not.toContain('<strong>Checkbox Group: </strong>');
    expect(block.innerHTML).not.toContain('<strong>Date and Time: </strong>');
    expect(block.innerHTML).toContain('<p><strong>Number: </strong>5</p>');
    expect(block.innerHTML).not.toContain('<strong>Radio Group: </strong>');
    expect(block.innerHTML).not.toContain('<strong>Rich Text: </strong>');
    expect(block.innerHTML).toContain(
      '<p><strong>Select: </strong>Choice B</p>',
    );
    expect(block.innerHTML).not.toContain('<strong>Multifield: </strong>');
  });

  test('should render boolean "false" correctly', () => {
    // Arrange
    const mockData = [
      undefined,
      false, // boolean
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ];
    extractElements.mockReturnValue(mockData);

    // Act
    decorateSample(block);

    // Assert
    expect(block.innerHTML).toBe('<p><strong>Boolean: </strong>false</p>');
  });

  test('should not render date if the date is invalid', () => {
    // Arrange
    const mockData = [
      undefined,
      true,
      undefined,
      'not a valid date', // Invalid date string
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ];
    extractElements.mockReturnValue(mockData);

    // Act
    decorateSample(block);

    // Assert
    expect(block.innerHTML).not.toContain('<strong>Date and Time: </strong>');
    // Ensure the boolean still renders
    expect(block.innerHTML).toContain('<p><strong>Boolean: </strong>true</p>');
  });
});
