'use strict';

var pkg = require(__dirname + '/../package.json');
var yargs = require('yargs')
  .usage('material-css (init || compile)')
  .example('material-css init', '')

  .alias('c', 'colors')
  .describe('c', 'File name without extensions for color settings.')

  .alias('s', 'styles')
  .describe('s', 'File name without extensions for custom styles.')

  .alias('x', 'compress')
  .describe('x', 'Compress the CSS output.')
  .boolean('x')

  .alias('o', 'out')
  .describe('o', 'File name to output to. If not specified output to stdout.')

  .demand(1, 'Need to specify an action (init or compile).');

yargs.help('help');
yargs.version(pkg.version + '\n', 'version');

var argv = yargs.argv;
var fs = require('fs');
var material = require(__dirname + '/../src/main.js');

var tAction = argv._[0];

if (tAction === 'init') {
  material.init(argv.c ? argv.c + '.styl' : 'colors.styl');
} else if (tAction === 'compile') {
  material.compile(
    {
      colors: argv.c ? argv.c + '.styl' : '',
      styles: argv.s ? argv.s + '.styl' : '',
      compress: argv.x
    },

    function(pError, pCSS) {
      if (pError) {
        console.error(pError);
        process.exit(1);

        return;
      }

      if (argv.o) {
        fs.writeFileSync(argv.o, pCSS);
      } else {
        process.stdout.write(pCSS);
      }
    }
  );
} else {
  yargs.showHelp();
  console.error('Need to specify an action (init or compile).');
  process.exit(1);

  return;
}
