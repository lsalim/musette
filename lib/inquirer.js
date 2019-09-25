const inquirer = require('inquirer');
const minimist = require('minimist');
const files = require('./files');

module.exports = {
    askGithubCredentials: () => {
        const questions = [{
                name: 'username',
                type: 'input',
                message: 'Enter your github username',
                validate: function(value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter your github username'
                    }
                }
            },
            {
                name: 'password',
                type: 'password',
                message: 'Enter your github password',
                validate: function(value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter your password'
                    }
                }
            },


        ];
        return inquirer.prompt(questions);
    },
    askRepositoryDetails: () => {
        const argv = require('minimist')(process.argv.slice(2));

        const questions = [{
                name: 'name',
                type: 'input',
                message: 'Please enter a name for your repository',
                default: argv._[0] || files.getCurrentDirectoryBase(),
                validate: function(value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter a unique name for the repository'
                    }
                }
            },
            {
                name: 'description',
                type: 'input',
                message: 'Enter a description of the repository. Not mandatory.',
                default: argv._[1] || null
            },
            {
                name: 'visibility',
                type: 'input',
                message: 'Would you like to set this repo as public or private',
                choices: ['public', 'private'],
                default: 'public'
            }
        ];
        return inquirer.prompt(questions);
    },

    askIgnoreFiles: (filelist) => {
        const questions = [{
            type: 'checkbox',
            name: 'ignore',
            message: 'Select the file and/or folders you wish to ignore:',
            choices: filelist,
            default: ['node_modules']
        }];
        return inquirer.prompt(questions);
    }
};