const toElement = (string = '') => {
  const templateElement = document.createElement('template');
  templateElement.innerHTML = string.trim();
  const childNodes = [...templateElement.content.childNodes];
  return childNodes.length > 1 ? childNodes : childNodes[0] || '';
};

const extractElements = (carouselElement) => {
  const childElements = toElement(carouselElement.innerHTML);
  if (childElements.length > 1) {
    const richTextElement = document.createElement('div');
    richTextElement.classList.add('rich-text');
    Array.from(childElements).forEach((childElement) => {
      richTextElement.append(childElement);
    });
    return richTextElement;
  }
  return childElements;
};

export { extractElements };
