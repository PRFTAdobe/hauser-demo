import { beforeEach, describe, expect, test } from '@jest/globals';

import { extractElements, html } from './tools.js';

describe('extractElements', () => {
  let mockBlock;

  beforeEach(() => {
    // Reset mockBlock before each test
    mockBlock = document.createElement('div');
  });

  // Helper function to create nested div structure for tests
  const createNestedDiv = (content) => {
    const outerDiv = document.createElement('div');
    const innerDiv = document.createElement('div');
    innerDiv.textContent = content;
    outerDiv.appendChild(innerDiv);
    return outerDiv;
  };

  test('should extract plain text correctly when type is "text"', () => {
    mockBlock.appendChild(createNestedDiv('Hello World'));
    mockBlock.appendChild(createNestedDiv('Another string'));
    const result = extractElements(mockBlock, ['text', 'text']);
    expect(result).toEqual(['Hello World', 'Another string']);
  });

  test('should convert to boolean when type is "boolean"', () => {
    mockBlock.appendChild(createNestedDiv('true'));
    mockBlock.appendChild(createNestedDiv('false'));
    mockBlock.appendChild(createNestedDiv('not true')); // Should return false as it's not 'true'
    const result = extractElements(mockBlock, [
      'boolean',
      'boolean',
      'boolean',
    ]);
    expect(result).toEqual([true, false, false]);
  });

  test('should convert to number when type is "number"', () => {
    mockBlock.appendChild(createNestedDiv('123'));
    mockBlock.appendChild(createNestedDiv('3.14'));
    mockBlock.appendChild(createNestedDiv('-50'));
    mockBlock.appendChild(createNestedDiv('abc')); // Should return 0
    const result = extractElements(mockBlock, [
      'number',
      'number',
      'number',
      'number',
    ]);
    expect(result).toEqual([123, 3.14, -50, 0]);
  });

  test('should convert to Date object when type is "date"', () => {
    mockBlock.appendChild(createNestedDiv('2023-01-01T00:00:00.000Z'));
    mockBlock.appendChild(createNestedDiv('2023-12-31T00:00:00.000Z'));
    mockBlock.appendChild(createNestedDiv('invalid-date')); // Should return null
    const result = extractElements(mockBlock, ['date', 'date', 'date']);
    expect(result[0]).toEqual(new Date('2023-01-01 12:00:00 UTC'));
    expect(result[1]).toEqual(new Date('2023-12-31 12:00:00 UTC'));
    expect(result[2]).toBeNull();
  });

  test('should return element and add class when type is "html"', () => {
    const div1 = createNestedDiv('Text 1');
    const div2 = createNestedDiv('Text 2');
    const div3 = createNestedDiv('Text 3');

    mockBlock.appendChild(div1);
    mockBlock.appendChild(div2);
    mockBlock.appendChild(div3);

    const result = extractElements(mockBlock, ['text', 'html', 'text']);

    expect(result[0]).toBe('Text 1');
    expect(result[2]).toBe('Text 3');

    expect(result[1]).toBeInstanceOf(HTMLElement);
    expect(result[1].textContent.trim()).toBe('Text 2'); // Verify content
  });

  test('should split text into an array when type is "multiText"', () => {
    mockBlock.appendChild(createNestedDiv('item1,item2,item3'));
    mockBlock.appendChild(createNestedDiv('single item'));
    mockBlock.appendChild(createNestedDiv(''));
    const result = extractElements(mockBlock, [
      'multiText',
      'multiText',
      'multiText',
    ]);
    expect(result).toEqual([
      ['item1', 'item2', 'item3'],
      ['single item'],
      [''],
    ]);
  });

  test('should handle a mix of different data types', () => {
    mockBlock.appendChild(createNestedDiv('Hello')); // text
    mockBlock.appendChild(createNestedDiv('true')); // boolean
    mockBlock.appendChild(createNestedDiv('42')); // number
    mockBlock.appendChild(createNestedDiv('2024-05-15T00:00:00.000Z')); // date
    const htmlElement = createNestedDiv('HTML content'); // html
    mockBlock.appendChild(htmlElement);
    mockBlock.appendChild(createNestedDiv('apple,banana,orange')); // multiText

    const result = extractElements(mockBlock, [
      'text',
      'boolean',
      'number',
      'date',
      'html',
      'multiText',
    ]);

    expect(result.length).toBe(6);
    expect(result[0]).toBe('Hello');
    expect(result[1]).toBe(true);
    expect(result[2]).toBe(42);
    expect(result[3]).toEqual(new Date('2024-05-15 12:00:00 UTC'));
    expect(result[4]).toBeInstanceOf(HTMLElement);
    expect(result[4].textContent.trim()).toBe('HTML content');
    expect(result[5]).toEqual(['apple', 'banana', 'orange']);
  });

  test('should return an empty array if no elements are found', () => {
    const result = extractElements(mockBlock, []);
    expect(result).toEqual([]);
  });

  test('should handle elements with no text content when type is "text"', () => {
    const div1 = createNestedDiv(''); // Empty text
    const div2 = createNestedDiv('   '); // Whitespace only
    mockBlock.appendChild(div1);
    mockBlock.appendChild(div2);
    const result = extractElements(mockBlock, ['text', 'text']);
    expect(result).toEqual(['', '']); // Trimmed empty strings are still strings
  });

  test('should handle mismatch in elementTypes and blockElements length', () => {
    mockBlock.appendChild(createNestedDiv('Hello'));
    const result = extractElements(mockBlock, []); // elementTypes is shorter
    // Expect the first element to be processed with undefined type, defaulting to 'text'
    expect(result).toEqual(['Hello']);

    mockBlock = document.createElement('div');
    mockBlock.appendChild(createNestedDiv('Hello'));
    mockBlock.appendChild(createNestedDiv('World'));
    const result2 = extractElements(mockBlock, ['text']); // elementTypes is shorter
    expect(result2).toEqual(['Hello', 'World']); // The second element will also default to 'text'
  });
});

describe('html', () => {
  test('should behave like String.raw for simple strings', () => {
    const name = 'World';
    const result = html`Hello, ${name}!`;
    expect(result).toBe('Hello, World!');
  });

  test('should handle backslashes correctly without escaping them', () => {
    const path = 'C:\\Program Files\\App';
    const result = html`Path: ${path}`;
    expect(result).toBe('Path: C:\\Program Files\\App');
  });

  test('should handle multiple interpolations', () => {
    const a = 1;
    const b = 2;
    const result = html`${a} + ${b} = ${a + b}`;
    expect(result).toBe('1 + 2 = 3');
  });

  test('should return an empty string for empty template literal', () => {
    expect(html``).toBe('');
  });
});
