const XmlNode = require('./xmlnode');
const _ = require('lodash');

const shapeProperties = require('./shapeproperties');
const defaults = require('./defaults');
const clone = require('./util/clone');

//======================================================================================================================
// Shape (p:sp)
//======================================================================================================================

const Shape = function (content) {
  this.content = content || clone(defaults['p:sp']);
};

Shape.prototype.text = function (text) {
  if (text) {
    this.content['p:txBody'][0]['a:p'][0]['a:r'][0]['a:t'][0] = text;
    return this;
  } else {
    const NEW_LINE = '\r\n';
    const textLines = this.content['p:txBody'][0]['a:p']
      ?.map((paragraph) => {
        const EMPTY_STRING = '';
        const paragraphs = paragraph['a:r']?.map((pR) => {
          const text = pR['a:t']
            ?.map((textEntry) => {
              return textEntry;
            })
            .join(EMPTY_STRING);
          return text;
        });

        const breaksSize = paragraph['a:br']?.length;

        const paragraphsAsString = paragraphs?.join(EMPTY_STRING);

        return paragraphsAsString;
        // return _.trimRight(_.trimLeft(paragraphsAsString))
      })
      .join(NEW_LINE);

    return textLines; // return this.content['p:txBody'][0]['a:p'][0]['a:r'][0]['a:t'][0];
  }
};

Shape.prototype.shapeProperties = function () {
  return new shapeProperties(this.content['p:spPr'][0]);
};

module.exports = Shape;
