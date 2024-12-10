# Metadata Management Tool Application

<!-- TODO Change to main branch before merging into main -->
![Build Status](https://github.com/nasa/mmt/workflows/CI/badge.svg?branch=main)
[![codecov](https://codecov.io/gh/nasa/mmt/graph/badge.svg?token=B8Qspgsjou)](https://codecov.io/gh/nasa/mmt)

The Metadata Management Tool (MMT) and Draft Metadata Management Tool (dMMT) are web applications designed to assist users in managing metadata and interfacing with the CMR.

## Links

- [MMT Users Guide](https://wiki.earthdata.nasa.gov/display/ED/Metadata+Management+Tool+%28MMT%29+User%27s+Guide)
- [Draft MMT Users Guide](https://wiki.earthdata.nasa.gov/display/ED/Draft+MMT+%28dMMT%29+User%27s+Guide)
- [Release Notes](https://wiki.earthdata.nasa.gov/display/ED/MMT+Release+Notes)

## Getting Started

### Requirements

- [Node](https://nodejs.org/) (check .nvmrc for correct version)
  - [nvm](https://github.com/nvm-sh/nvm) is highly recommended
- [Docker](https://www.docker.com/get-started/)
- Java 17
  - `brew install openjdk@17`

### Setup

To install the necessary components, run:

```bash
    npm install
```

### Usage

In order to run MMT locally, you first need to setup a local CMR, cmr-graphql, and GraphDB.

#### Running a local CMR

In order to use a local copy of the CMR you will need to download the latest file, set an environment variable, and run a rake task to set required permissions and ingest some data.

##### Downloading the CMR file

Download the CMR JAR file [here](https://ci.earthdata.nasa.gov/artifact/CN2-CSN2/shared/build-latest/cmr-dev-system-uberjar.jar/cmr-dev-system-0.1.0-SNAPSHOT-standalone.jar). Ensure you save the file as `cmr-dev-system-0.1.0-SNAPSHOT-standalone.jar`

In your root directory for MMT, create a folder named `cmr`. Place the `cmr-dev-system-0.1.0-SNAPSHOT-standalone.jar` file in the `cmr` folder.

##### 2. Setting the environment variable needed by the local CMR

Before running a local copy of the CMR, you will need to set a required environment variable. Add this line into your `.bash_profile` (or `.zsh_profile`):

```bash
    export CMR_URS_PASSWORD=mock-urs-password
```

After adding the line and saving the file, don't forget to source the file by running:

```bash
    source ~/.bash_profile
```

##### 3. Setting up local redis for CMR

CMR comes with redis in the jar, but it is not compiled to run on Macs.  If you need to run the CMR on a Mac, install redis with homebrew by running:

```bash
    brew update
    brew install redis
    brew services start redis
```

For more information, see:

- [https://www.devglan.com/blog/install-redis-windows-and-mac](https://www.devglan.com/blog/install-redis-windows-and-mac)
- [https://gist.github.com/tomysmile/1b8a321e7c58499ef9f9441b2faa0aa8](https://gist.github.com/tomysmile/1b8a321e7c58499ef9f9441b2faa0aa8)

##### 4. Running the CMR npm scripts

To start the local CMR and load the test data, run:

_Note: This command can be ran as two separate commands if needed:_

```bash
    npm run cmr:start_and_setup
```

< or >

```bash
    npm run cmr:start
    npm run cmr:setup
```

After you see "Done!", you can load the app in your browser and use the local CMR. After you have started CMR, to just reload the data, run:

```bash
    npm run cmr:reset
    npm run cmr:setup
```

To stop the locally running CMR, run:

```bash
    npm run cmr:stop
```

You will need to stop the CMR before upgrading to a new CMR version. Note: stopping the running CMR for any reason will delete all data from the CMR. You will have to load the data again when you start it.

### Running a local CMR GraphQL

To setup cmr-graphql, follow the [https://github.com/nasa/cmr-graphql](readme).

After you have set up cmr-graphql, to start it and point it to your local CMR, run:

```bash
    CMR_ROOT_URL=http://localhost:4000 EDL_CLIENT_ID=<client id> EDL_PASSWORD=<password> npm start
```

_Note: This should be run from within the mmt directory._

### Running a local CMR proxy

The local CMR uses ports instead of the routes you see in production. So you also need to start the graphql proxy found within this repo to connect to local cmr-graphql to local CMR.

To start the proxy, run:

```bash
    npm run start:proxy
```

### Running a local GraphDB

To run GraphDB in docker, run:

```bash
    npm run start:graphdb
```

#### Running Serverless Offline (API Gateway/Lambdas)

In order to run serverless-offline, which is used for mimicking API Gateway to call lambda functions, run the following based the environment you have cmr-graphql pointed to:

Environment|CLI|
|-|-|
|Local| $ npm run offline|
|SIT| $ EDL_PASSWORD=SIT Password npm run ffline
|UAT| $ EDL_PASSWORD='UAT Password' npm run offline

For UAT ONLY - you will need to change lines 34-37 in the static.config file to read as follows:
```bash
    "edl": {
        "host": "https://uat.urs.earthdata.nasa.gov",
        "uid": "mmt_uat"
    },
```

_Note: The EDL_PASSWORD environment variable is required for group member queries to function._

#### Running MMT

In the samlCallback/handler.js file, you will need to replace line 17 'ABC-1' to your SIT or UAT token if pointing to one of those environments. You can get your token from either your sit/uat.urs.earthdata.nasa.gov profile OR (if that does not work) from mmt.sit/uat.earthdata.nasa.gov network tab. Click one of the last api calls, go to Headers, then to Authorization and copy the token from there. 

After starting the local CMR, cmr-graphql and GraphDB, run:

```bash
    npm start
```
If switching environments, remember to clear your cookies and login again.

### UMM JSON-Schema

You can view/download the latest UMM JSON-Schema [here](https://git.earthdata.nasa.gov/projects/CMR/repos/cmr/browse/umm-spec-lib/resources/json-schemas).

## Local Testing

To run the test suite, run:

```bash
    npm run test
```

## UI

### Styling

CSS should follow the following guidelines:

- Prefer [Bootstrap](https://getbootstrap.com/docs/5.0/) styles when writing custom components
- If the desired look can not be achieved with Bootstrap, additional styling should be accomplished by:
  - Creating a scss file for the custom component
    - Classes should be defined on the elements following the [BEM methodology](https://getbem.com/)
    - Sass should be written take advantage of nesting to prevent repetition of the blocks and elements

#### Things to keep in mind

These will help create more maintainable css:

- Use Bootstrap variables where possible
  - Bootstrap provides css variables for things like colors, sizes, etc which should be used when possible.
    - Bootstrap variables are used with the `var()` syntax in css
- Aim to keep specificity low
  - Most elements should only require a single class name
  - Avoid chaining selectors, descendant selectors, or other ways of increasing specificity
- Use consistent modifier class names, starting with `--is`. Add more to the list below as new states are required.
  - `--is-active`,
  - `--is-complete`
  - `--is-errored`

### Helpful links

- [Bootstrap Docs](https://getbootstrap.com/docs/5.0/)
- [BEM methodology](https://getbem.com/)
- [Specificity MDN Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)
