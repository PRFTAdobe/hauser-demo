/* eslint-disable no-restricted-globals */
const extractElements = (block, elementTypes = []) => {
  const blockElements = block.querySelectorAll(':scope > div > div');
  return Array.from(blockElements).map((blockElement, index) => {
    const type = elementTypes[index]; // Get the type for the current element
    const text = blockElement.textContent.trim();

    switch (type) {
      case 'boolean':
        return text === 'true';
      case 'date': {
        const textAsDate = text.replace('T00:00:00.000Z', ' 12:00:00 UTC');
        return !isNaN(Date.parse(textAsDate)) ? new Date(textAsDate) : null;
      }
      case 'html':
        return blockElement;
      case 'multiText':
        return text.split(',');
      case 'number':
        return text && !isNaN(text) ? Number(text) : 0;
      case 'text':
      default:
        return text;
    }
  });
};

const html = (strings, ...values) => String.raw({ raw: strings }, ...values);

export { extractElements, html };
