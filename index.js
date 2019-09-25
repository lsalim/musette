const musette = require('commander');

const chalk = require('chalk');
const figlet = require('figlet');
const clear = require('clear');

const files = require('./lib/files');
const github = require('./lib/github_credentials');
const repo = require('./lib/create_a_repo');

musette
    .command('init')
    .description('Draw app banner')

.action(() => {
    clear();
    console.log(chalk.magenta(figlet.textSync('musette', { horizontalLayout: 'full' })));
});

musette
    .command('octocheck')
    .description('Check user Github credentials')
    .action(async() => {
        let token = github.getStoreGithubToken();
        if (!token) {
            await github.setGithubCredentials();
            token = await github.registerNewToken();
        }
        console.log(token);
    });

musette
    .command('create_repo')
    .description('Create a new repository on Github')
    .action(async() => {
        const getGithubToken = async() => {
            let token = github.getStoreGithubToken();
            if (token) {
                return token;
            }

            await github.setGithubCredentials();

            token = await github.registerNewToken();
            return token;
        }
        try {
            const token = await getGithubToken();
            github.gitHubAuth(token);

            const url = await repo.createRemoteRepository();

            await repo.createGitIgnore();

            const complete = await repo.setupRepository(url);

            if (complete) {
                console.log(chalk.green('All done.'));
            }

        } catch (error) {
            if (error) {
                switch (error.status) {
                    case 401:
                        console.log(chalk.red('Counld not log in. Please sign in again.'));
                        break;
                    case 422:
                        console.log(chalk.red('There already exists a remote repository.'));
                        break;
                    default:
                        console.log(error);
                        break;
                }
            }
        }

    });

musette.parse(process.argv);

if (!musette.args.length) {
    musette.help();
}