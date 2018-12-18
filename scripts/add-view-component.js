const chalk = require('chalk');
const fs = require("fs-extra");

module.exports = ({ name, viewsPath }) => {
    const jsxClassName = name[0].toUpperCase() + name.slice(1, name.length);
    const projectSrcPath = `${viewsPath}/${name}`;
    if (fs.existsSync(projectSrcPath)) {
        console.log(`${chalk.white(name)} ${chalk.red('page already exist')}`);
        return;
    }
    console.log(`${chalk.green("start add a nameiew component, locate at ", `${projectSrcPath}/index.js`)}`);

    // init react class component template
    const indexContent = `
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

class ${jsxClassName} extends Component {
    render() {
        return (
            <div className="page-${name}-root">
                    ${name} page component
            </div>
        );
    }
}

    
${jsxClassName}.propTypes = {
    
};

export default ${jsxClassName};

`

    // append page root css class
    const cssContent = `
.page-${name}-root{

}
`

    Promise.all([
        fs.createFile(projectSrcPath + '/index.js'),
        fs.createFile(projectSrcPath + '/style.scss'),
    ])
        .then(() => {
            return Promise.all([
                fs.appendFile(projectSrcPath + '/index.js', indexContent),
                fs.appendFile(projectSrcPath + '/style.scss', cssContent)
            ])
        })
        .then(() => {
            console.log(`${chalk.green("add react common class component (CCC) template success ")}`);
            console.log(`${chalk.green("relate style.scss to CCC success")}`);
            console.log(`add ${chalk.green(name)} success`)
        })
        .catch(err => console.error(`${chalk.red(err)}`))
}