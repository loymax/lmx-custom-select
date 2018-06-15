const shell = require('shelljs');

if (shell.exec('babel index.js --out-file ./dist/lmx-custom-select.js').code !== 0) {
    shell.echo('Error development');
    shell.exit(1);
} else {
    if (shell.exec('uglifyjs dist/lmx-custom-select.js --compress --output dist/lmx-custom-select.min.js').code !== 0) {
        shell.echo('Error production');
        shell.exit(1);
    }
}
