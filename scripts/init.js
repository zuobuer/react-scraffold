const chalk = require('chalk');
const fs = require("fs-extra");
const path = require("path");
const execSync = require('child_process').execSync;
const spawn = require("child_process").spawnSync;

module.exports = ({
    appPath,
    projectName,
    templatePath
}) => {

    const projectPath = `${appPath}/${projectName}`;

    console.log();
    console.log(`${chalk.green(`Create a new React project in ${projectPath}`)}`);
    console.log(`${chalk.green(`Installing packages. This might take a couple of minutes.`)}`);
    if (fs.existsSync(projectPath)) {
        console.error(`${chalk.red(`${projectPath} already existed.`)}`);
        process.exit(1);
    }
    console.log();

    fs.ensureDirSync(projectPath);

    // write package.json to projectPath
    const packageJson = {
        name: projectName,
        version: '0.1.0',
        private: true,
    };
    try {
        fs.writeFileSync(
            path.join(projectPath, 'package.json'),
            JSON.stringify(packageJson, null, 2)
        );
    } catch (error) {
        console.error(`${chalk.red(error)}`)
        process.exit(1);
    }

    // check use yarn or npm
    const useYarn = shouldUseYarn();
    if (useYarn) {
        try {
            execSync(`cd ${projectPath} && yarn add react react-dom`);
        } catch (error) {
            console.log(error)
        }
    } else {
        try {
            execSync(`cd ${projectPath} && npm install react react-dom --save`);
        } catch (error) {
            console.log(error)
        }
    }

    // copy project struct 
    try {
        fs.copySync(templatePath, projectPath);
        console.log(`${chalk.green(`    1、create fold struct success`)}`)
    } catch (error) {
        console.error(`${chalk.red(error)}`)
        process.exit(1);
    }


    console.log();
    console.log(` ${chalk.cyan(`cd ${projectName}, then enjoy it`)}`);
}



function shouldUseYarn() {
    try {
        execSync('yarnpkg --version', { stdio: 'ignore' });
        return true;
    } catch (e) {
        return false;
    }
}
