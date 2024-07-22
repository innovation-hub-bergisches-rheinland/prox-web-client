# Prox Web Client

This web application acts as the frontend to Prox.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.2.3.

## Installation

To use the backend from \*.aws.innovation-hub.de

```bash
# Execute from the project root folder
docker build -t prox-web-client:prod -f ./docker/Dockerfile .
```

To use the local/dev services from localhost

```bash
# Execute from the project root folder
docker build -t prox-web:dev -f ./docker/Dockerfile-local .
```

Run with:

```bash
docker compose -f docker/docker-compose.yml up -d
```

Builds a Docker image based on the source code and the dependencies in the `package.json` and `package-lock.json`.

### Development server

Run `ng serve -c local` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the
source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use
`ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production
build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the
[Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Development

Please consider our [contributing guidelines](./CONTRIBUTING.md).

### Commit Messages

The commit messages **SHOULD** adhere to the [Conventional Commits specification](https://conventionalcommits.org/). This repository is also
[Commitizen](https://github.com/pocommitizen/cz-cli)-friendly. You can use Commitizen seamless in this repository.

### Perform a release

In general releases are done by pushing a git tag which conforms to [SemVer](https://semver.org/) specification. We prefix those tags with a
`v`, so the tag itself **MUST** follow the pattern `vMAJOR.MINOR.PATCH`. A label is not used.

The simplest way to perform a release is by relying on our [standard-version](https://github.com/conventional-changelog/standard-version)
configuration. If you are ready to perform a release simply call

```shell
$ npx standard-version
# or
$ npm run release
```

This will analyze the last commits since the last release, determine the new version, generate a changelog and create a git tag for you.
Next up you will need to push the tag and version bumped files, our release pipeline will take care of the rest.

```shell
$ git push --follow-tags origin main
```
