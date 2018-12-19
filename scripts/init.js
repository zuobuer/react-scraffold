const chalk = require('chalk');
const fs = require("fs-extra");
const path = require("path");
const dns = require("dns");
const execSync = require('child_process').execSync;
const prompts = require("prompts")

module.exports = async ({
    appPath,
    projectName,
    templatePath
}) => {

    const projectPath = `${appPath}/${projectName}`;
    let response;
    console.log();
    console.log(`${chalk.green(`Create a new React project in ${projectPath}`)}`);
    if (fs.existsSync(projectPath)) {
        console.error(`${chalk.yellow(`It seem to the fold ${projectPath} already existed.`)}`);
        response = await prompts({
            type: 'confirm',
            name: 'delete',
            message: `Do you want to remove it`,
            initial: false
        }, {
                onCancel: () => {
                    console.log(`${chalk.red('Aborted.')}`)
                    process.exit(1);
                }
            });
        if (response.delete) {
            try {
                fs.removeSync(projectPath);
                console.log(`${chalk.green(`Remove the fold success.`)}`);
            } catch (error) {
                console.log(`${chalk.red(`Remove the fold failed, please try again`)}`);
                process.exit(1);
            }
        } else {
            process.exit(1);
        }
    }
    console.log();

    fs.ensureDirSync(projectPath);

    // write package.json to projectPath
    // 询问，初始化 package.json
    console.log(`${chalk.white("Creating a package.json file.")}`);
    console.log(`${chalk.white("It only covers the most common items, and tries to guess sensible defaults.")}`);
    console.log(`${chalk.white("Press ^C at any time to quit.")}`);
    let packageJson = {};
    respone = await prompts([{
        type: 'text',
        name: 'name',
        message: `package name:`,
        initial: projectName,
    }, {
        type: 'text',
        name: 'version',
        message: 'version:',
        initial: '1.0.0',
    }, {
        type: 'text',
        name: 'description',
        message: 'description:',
        initial: '',
    }, {
        type: "text",
        name: 'main',
        message: `entry point: `,
        initial: './src/index.js',
    }, {
        type: 'text',
        name: 'repository',
        message: `git repository:`,
        initial: '',
    }, {
        type: 'text',
        name: 'keywords',
        message: 'keywords:',
        initial: '',
    }, {
        type: 'text',
        name: 'author',
        message: 'author:',
        initial: '',
    }, {
        type: 'text',
        name: 'license',
        message: 'license: ',
        initial: 'ISC',
    }], {
            onCancel: () => {
                console.log(`${chalk.red('Aborted.')}`)
                fs.removeSync(projectPath);
                process.exit(1);
            },
        }
    );
    packageJson = respone;
    packageJson.scripts = {};

    console.log();
    console.log(`About to write to ${projectPath}/package.json:`);
    console.log();
    console.log("{");
    console.log(` "name": ${packageJson.name},`);
    console.log(` "version": ${packageJson.version},`);
    console.log(` "description": ${packageJson.description},`);
    console.log(` "repository": ${packageJson.repository},`);
    console.log(` "author": ${packageJson.author},`);
    console.log(` "license": ${packageJson.license},`);
    console.log(` "scripts": {`);
    console.log(`  }`);
    console.log("}")

    console.log()
    response = await prompts({
        type: 'confirm',
        name: 'sure',
        message: `Is this ok`,
        initial: true
    }, {
            onCancel: () => {
                console.log(`${chalk.red('Aborted.')}`)
                fs.removeSync(projectPath);
                process.exit(1);
            }
        });
    if (!response.sure) {
        console.log(`${chalk.red('Aborted.')}`)
        fs.removeSync(projectPath);
        process.exit(1);
    }
    try {
        fs.writeFileSync(
            path.join(projectPath, 'package.json'),
            JSON.stringify(packageJson, null, 2)
        );
    } catch (error) {
        console.error(`${chalk.red(error)}`)
        fs.removeSync(projectPath);
        process.exit(1);
    }

    // copy project struct 
    try {
        fs.copySync(templatePath, projectPath);
    } catch (error) {
        console.error(`${chalk.red(error)}`)
        process.exit(1);
    }

    // check use yarn or npm
    console.log(`${chalk.green(`Installing packages. This might take a couple of minutes.`)}`);
    const useYarn = shouldUseYarn();
    let isOnline = await checkIfOnline().then(isOnline => isOnline);
    if (!isOnline) {
        console.log(`${chalk.red(`It like there are some problem with you network!`)}`);
        console.log(`${chalk.red(`Please check it !`)}`);
        try {
            fs.removeSync(projectPath);
        } catch (err) {/** 忽略该错误 */ }
        process.exit(1);
    }
    if (useYarn) {
        try {
            execSync(`cd ${projectPath} && yarn add react react-dom`);
        } catch (error) {
            fs.removeSync(projectPath);
            console.log(error)
        }
    } else {
        try {
            execSync(`cd ${projectPath} && npm install react react-dom --save`);
        } catch (error) {
            fs.removeSync(projectPath);
            console.log(error)
        }
    }
    console.log();
    console.log(`${chalk.green(`Installing packages success!`)}`);
    console.log();
    console.log(`Use \`${useYarn ? 'yarn add' : ' npm install'} <pkg>\` afterwards to install a package and`);
    console.log(`save it as a dependency in the package.json file.`);
    console.log();
    console.log(`${chalk.yellow(`cd ${chalk.green(projectName)}, then hack it.`)}`);
}

function shouldUseYarn() {
    try {
        execSync('yarnpkg --version', { stdio: 'ignore' });
        return true;
    } catch (e) {
        return false;
    }
}


function checkIfOnline() {
    return new Promise(resolve => {
        dns.lookup("weibo.com", err => {
            resolve(err == null)
        })
    })
}