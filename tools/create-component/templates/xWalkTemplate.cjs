/* eslint-disable no-undef */
const updateSectionFilter = require('../../updateSectionFilter.cjs');

const xWalkTemplate = ({ kebabCase, uppercase }) => {
  updateSectionFilter('./blocks/section/_section.json', kebabCase);
  return `{
  "definitions": [
    {
      "title": "${uppercase}",
      "id": "${kebabCase}",
      "plugins": {
        "xwalk": {
          "page": {
            "resourceType": "core/franklin/components/block/v1/block",
            "template": {
              "name": "${uppercase}",
              "model": "${kebabCase}"
            }
          }
        }
      }
    }
  ],
  "models": [
    {
      "id": "${kebabCase}",
      "fields": [
        {
          "component": "text",
          "name": "heading",
          "label": "Heading",
          "valueType": "string"
        },
        {
          "component": "select",
          "name": "headingType",
          "label": "Heading Type",
          "options": [
            {
              "name": "h1",
              "value": "h1"
            },
            {
              "name": "h2",
              "value": "h2"
            },
            {
              "name": "h3",
              "value": "h3"
            },
            {
              "name": "h4",
              "value": "h4"
            },
            {
              "name": "h5",
              "value": "h5"
            },
            {
              "name": "h6",
              "value": "h6"
            }
          ]
        },
        {
          "component": "richtext",
          "name": "text",
          "label": "Rich Text",
          "valueType": "string"
        }
      ]
    }
  ],
  "filters": []
}
`;
};

module.exports = xWalkTemplate;
