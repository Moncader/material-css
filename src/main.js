'use strict';

var fs = require('fs');
var stylus = require('stylus');

function init(pColorFile) {
  var tContents = fs.readFileSync(__dirname + '/../stylus/colors.styl');
  fs.writeFileSync(pColorFile, tContents);
}

function compile(pOptions, pCallback) {
  var tFiles = [__dirname + '/../stylus/material-color.styl'];
  
  if (pOptions.colors) {
    tFiles.push(pOptions.colors);
  } else {
    tFiles.push(__dirname + '/../stylus/colors.styl');
  }
  
  tFiles.push(__dirname + '/../stylus/material-styles.styl');
  
  if (pOptions.styles) {
    tFiles.push(pOptions.styles);
  }

  var tStylusOptions = {
    compress: pOptions.compress
  };
  var tCounter = tFiles.length;
  var mError = null;
  var tContents = new Array(tCounter);
  var i, il;

  function process(pIndex) {
    return function(pError, pContent) {
      if (pError) {
        mError = pError;
      } else {
        tContents[pIndex] = pContent;
      }

      if (--tCounter === 0) {
        if (mError) {
          pCallback(mError, void 0);

          return;
        }

        stylus(tContents.join('\n'), tStylusOptions)
        .render(function(pError, pCSS) {
          if (pError) {
            pCallback(pError, void 0);

            return;
          }

          pCallback(null, pCSS);
        });
      }
    };
  }

  for (i = 0, il = tCounter; i < il; i++) {
    fs.readFile(tFiles[i], {encoding: 'utf-8'}, process(i));
  }
}

exports.init = init;
exports.compile = compile;