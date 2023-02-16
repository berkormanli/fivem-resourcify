#! /usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs';
import { createSpinner } from 'nanospinner';
import boxen from "boxen";

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));
const loadingFrames = [
    "⠁",
    "⠉",
    "⠙",
    "⠚",
    "⠒",
    "⠂",
    "⠂",
    "⠒",
    "⠲",
    "⠴",
    "⠤",
    "⠄",
    "⠄",
    "⠤",
    "⠴",
    "⠲",
    "⠒",
    "⠂",
    "⠂",
    "⠒",
    "⠚",
    "⠙",
    "⠉",
    "⠁"
];

const createDir = (dirPath) => {
    fs.mkdirSync(process.cwd() + dirPath, { recursive: true }, (error) => {
        if (error) {
            return false;
        } else {
            return true;
        }
    });
}
async function createFile(filename, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(process.cwd() + filename, content, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function generateHtml(project) {
    let templateHTML = `<html>

<head>
\t<title>${project.name}</title>
\t<meta name="author" content="${project.author}">
\t<link rel="stylesheet" href="css/style.css" type="text/css" charset="utf-8" />
</head>

<body>
\t<div class="container">

\t</div>

\t<script type="text/javascript" src="js/script.js"></script>
</body>
</html>`
    return templateHTML;
}

function generateStyle() {
    let style = `* {
    margin: 0;
    padding: 0;
 }`
    return style;
}

function generateManifest(project) {
    let metadata = `fx_version 'cerulean'
games { ${project.games.map(el => `'${el}'`).join(', ')} }\n
author '${project.author}'
description '${project.description}'
version '${project.version}'

${project.type.client === false && project.type.server === true ? `server_only 'yes'` : ''}${project.type.client ? `client_scripts {
    'client/*.${project.language}'
}\n\n` : ''}${project.type.server ? `server_scripts {
    'server/*.${project.language}'
}\n\n` : ''}${project.ui ? "ui_page 'ui/index.html'\n\n" : ''}${project.ui ? `files {
    'ui/index.html',
    'ui/images/*.jpg',
    'ui/images/*.jpeg',
    'ui/images/*.png',
    'ui/images/*.svg',
    'ui/js/*.js',
    'ui/css/*.css',
}\n\n` : ''}${project.escrow ? `lua54 'yes'\n\n` : ''}`
    return metadata;
}

async function createProject(project) {

    const spinner = createSpinner('')
        .update({
            text: 'Creating resource directory according to your configuration.',
            color: 'green',
            stream: process.stdout,
            frames: loadingFrames,
            interval: 80
        })
        .start();
    fs.promises.access(process.cwd() + '/test-resource')
        .then(() => spinner.error({text: 'There is already a folder with the same name'}))
        .catch(() => {
            if (!fs.existsSync(process.cwd() + project.name)) {
                createDir(`/${project.name}`);
                createFile(`/${project.name}/fxmanifest.lua`, generateManifest(project)).then().catch();
                if (project.type.client) {
                    createDir(`/${project.name}/client`);
                    createFile(`/${project.name}/client/main.${project.language}`, '').then().catch();
                }
                if (project.type.server) {
                    createDir(`/${project.name}/server`);
                    createFile(`/${project.name}/server/main.${project.language}`, '').then().catch();
                }
                if (project.ui) {
                    createDir(`/${project.name}/ui/images`);
                    createDir(`/${project.name}/ui/js`);
                    createFile(`/${project.name}/ui/js/script.js`, '').then().catch();
                    createDir(`/${project.name}/ui/css`);
                    createFile(`/${project.name}/ui/css/style.css`, generateStyle()).then().catch();
                    createFile(`/${project.name}/ui/index.html`, generateHtml(project)).then().catch();
                }
            }
            spinner.success({text: 'Done!'});
        });

    //await sleep(200);

}

let resourceObj = {};

async function setResourceName(name) {
    const spinner = createSpinner('')
        .update({
            text: 'Setting resource name',
            color: 'green',
            stream: process.stdout,
            frames: loadingFrames,
            interval: 80
        })
        .start();
    await sleep(20);
    resourceObj.name = name;
    spinner.success({text: 'Name set!'});
}
async function askResourceName() {
    const answers = await inquirer.prompt({
        name: 'resource_name',
        type: 'input',
        message: 'What is your resource name?\n',
        default() {
            return 'cli-resource';
        },
    });
    return setResourceName(answers.resource_name);
}

async function setAuthor(author) {
    const spinner = createSpinner('')
        .update({
            text: 'Setting resource author',
            color: 'green',
            stream: process.stdout,
            frames: loadingFrames,
            interval: 80
        })
        .start();
    await sleep(20);
    resourceObj.author = author;
    spinner.success({text: 'Author set!'});
}
async function askAuthor() {
    const answers = await inquirer.prompt({
        name: 'resource_author',
        type: 'input',
        message: 'What is the author\'s name?\n',
    });
    return setAuthor(answers.resource_author);
}

async function setDescription(description) {
    const spinner = createSpinner('')
        .update({
            text: 'Setting resource description',
            color: 'green',
            stream: process.stdout,
            frames: loadingFrames,
            interval: 80
        })
        .start();
    await sleep(20);
    resourceObj.description = description;
    spinner.success({text: 'Description set!'});
}
async function askDescription() {
    const answers = await inquirer.prompt({
        name: 'resource_description',
        type: 'input',
        message: 'What is the description?\n',
    });
    return setDescription(answers.resource_description);
}

async function setVersion(version) {
    const spinner = createSpinner('')
        .update({
            text: 'Setting resource version',
            color: 'green',
            stream: process.stdout,
            frames: loadingFrames,
            interval: 80
        })
        .start();
    await sleep(20);
    resourceObj.version = version;
    spinner.success({text: 'Version set!'});
}
async function askVersion() {
    const answers = await inquirer.prompt({
        name: 'resource_version',
        type: 'input',
        message: 'What is the resource version?\n',
        default() {
            return '1.0.0';
        },
    });
    return setVersion(answers.resource_version);
}

async function setGames(games) {
    const spinner = createSpinner('')
        .update({
            text: 'Setting supported games',
            color: 'green',
            stream: process.stdout,
            frames: loadingFrames,
            interval: 80
        })
        .start();
    await sleep(20);
    resourceObj.games = games;
    spinner.success({text: 'Games set!'});
}
async function askGames() {
    const answers = await inquirer.prompt({
        name: 'resource_games',
        type: 'checkbox',
        message: 'Which games are supported?\n',
        choices: [
            {
                name: 'GTA5',
                value: 'gta5'
            },
            {
                name: 'RDR2',
                value: 'rdr3'
            }
        ]
    });
    return setGames(answers.resource_games);
}

async function setLanguage(language) {
    const spinner = createSpinner('')
        .update({
            text: 'Setting resource language',
            color: 'green',
            stream: process.stdout,
            frames: loadingFrames,
            interval: 80
        })
        .start();
    await sleep(200);
    resourceObj.language = language;
    spinner.success({text: 'Language set!'});
}

async function askLanguage() {
    const answers = await inquirer.prompt({
        name: 'resource_language',
        type: 'list',
        message: 'Which language you want to create your resource in?\n',
        choices: [{name: 'Lua', value: 'lua'}, {name: 'Javascript', value: 'js'}],
    });

    return setLanguage(answers.resource_language);
}

async function setType(type) {
    const spinner = createSpinner('')
        .update({
            text: 'Setting resource type',
            color: 'green',
            stream: process.stdout,
            frames: loadingFrames,
            interval: 80
        })
        .start();
    await sleep(200);
    resourceObj.type = type === 'Client+Server' ? {client: true, server: true} : type === 'Client' ? {client: true, server: false} : {client: false, server: true};
    spinner.success({text: 'Type set!'});
}

async function askType() {
    const answers = await inquirer.prompt({
        name: 'resource_type',
        type: 'list',
        message: 'Which language you want to create your resource in?\n',
        choices: ['Client', { name: 'Server', short: 'The resource will be set to server-only. Please refer to: https://docs.fivem.net/docs/scripting-reference/resource-manifest/resource-manifest/#server_only'}, 'Client+Server'],
    });

    return setType(answers.resource_type);
}

async function setUI(ui) {
    const spinner = createSpinner('')
        .update({
            text: 'Setting resource UI',
            color: 'green',
            stream: process.stdout,
            frames: loadingFrames,
            interval: 80
        })
        .start();
    await sleep(200);
    resourceObj.ui = ui;
    spinner.success({text: 'UI set!'});
}

async function askUI() {
    const answers = await inquirer.prompt({
        name: 'resource_ui',
        type: 'list',
        message: 'Will you add an UI to your resource?\n',
        choices: ['Yes', 'No'],
    });

    return setUI(answers.resource_ui === 'Yes');
}

async function setEscrow(escrow) {
    const spinner = createSpinner('')
        .update({
            text: 'Setting escrow settings',
            color: 'green',
            stream: process.stdout,
            frames: loadingFrames,
            interval: 80
        })
        .start();
    await sleep(200);
    resourceObj.escrow = escrow;
    spinner.success({text: 'Escrow set!'});
}

async function askEscrow() {
    const answers = await inquirer.prompt({
        name: 'resource_escrow',
        type: 'list',
        message: 'Will you protect your resource with escrow?\n',
        choices: ['Yes', 'No'],
    });

    return setEscrow(answers.resource_escrow === 'Yes');
}

console.clear();

await askResourceName();
await askAuthor();
await askDescription();
await askVersion();
await askGames();
await askLanguage();
await askType();
if (resourceObj.type.client)
    await askUI();
await askEscrow();

console.log(
    boxen(
        chalk.green(
            `Resource name: ${resourceObj.name}
Resource author: ${resourceObj.author}
Resource description: ${resourceObj.description}
Resource version: ${resourceObj.version}
Supported games: ${resourceObj.games.map( el => {
    if (el === 'gta5')
        return 'FiveM'
    else if (el === 'rdr3')
        return 'RedM'
}).join(', ')}
Resource language: ${resourceObj.language === 'lua' ? 'Lua' : 'JavaScript'}
Resource type: ${resourceObj.type.client === true && resourceObj.type.server === true ? 'Client + Server' : 
    resourceObj.type.client === true && resourceObj.type.server === false ? 'Client Only' : 'Server Only' }
${resourceObj.type.client === true ? `Has UI: ${resourceObj.ui ? 'Yes' : 'No'}` : ``}
Lua 5.4 & Escrow: ${resourceObj.escrow ? 'Yes' : 'No'}`
            ),
            {
                title: "Resource created!", 
                padding: 1, 
                borderStyle: "round", 
                borderColor: 'green', 
                dimBorder: true
            }
        )
    );

createProject(resourceObj);