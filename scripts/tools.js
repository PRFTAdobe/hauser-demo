const toElement = (string = '') => {
  const templateElement = document.createElement('template');
  templateElement.innerHTML = string.trim();
  const childNodes = [...templateElement.content.childNodes];
  return childNodes.length > 1 ? childNodes : childNodes[0] || '';
};

const extractElements = (carouselElement) => {
  return carouselElement.innerHTML;
};

export { extractElements };
