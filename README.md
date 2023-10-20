# Metadata Management Tool Application

<!-- TODO Change to main branch before merging into main -->
![Build Status](https://github.com/nasa/mmt/workflows/CI/badge.svg?branch=MMT-3390)
[![codecov](https://codecov.io/gh/nasa/mmt/graph/badge.svg?token=B8Qspgsjou)](https://codecov.io/gh/nasa/mmt)

The Metadata Management Tool (MMT) and Draft Metadata Management Tool (dMMT) are web applications designed to assist users in managing metadata and interfacing with the CMR. The user’s guide for MMT can be found [here](https://wiki.earthdata.nasa.gov/display/ED/Metadata+Management+Tool+%28MMT%29+User%27s+Guide "MMT User Guide") and the user’s guide for dMMT can be found [here](https://wiki.earthdata.nasa.gov/display/ED/Draft+MMT+%28dMMT%29+User%27s+Guide "dMMT User Guide"). Release notes for these applications can be found [here](https://wiki.earthdata.nasa.gov/display/ED/MMT+Release+Notes "Release Notes").

## Getting Started

### Requirements

* [Node](https://nodejs.org/) (check .nvmrc for correct version)
  * [nvm](https://github.com/nvm-sh/nvm) is highly recommended
* [Docker](https://www.docker.com/get-started/)
* Java 17
  * `brew install openjdk@17`

### Setup

Type the following command to install the necessary components:

    npm install

### Usage

In order to run MMT locally, you first need to setup a local CMR, cmr-graphql, and GraphDB

#### Running a local CMR

In order to use a local copy of the CMR you will need to download the latest file, set an environment variable, and run a rake task to set required permissions and ingest some data.

##### 1. Downloading the CMR file

Download the CMR JAR file [here](https://ci.earthdata.nasa.gov/artifact/CN2-CSN2/shared/build-latest/cmr-dev-system-uberjar.jar/cmr-dev-system-0.1.0-SNAPSHOT-standalone.jar). Ensure you save the file as `cmr-dev-system-0.1.0-SNAPSHOT-standalone.jar`

In your root directory for MMT, create a folder named `cmr`. Place the `cmr-dev-system-0.1.0-SNAPSHOT-standalone.jar` file in the `cmr` folder.

##### 2. Setting the environment variable needed by the local CMR

Before running a local copy of the CMR, you will need to set a required environment variable. Add this line into your `.bash_profile` (or `.zsh_profile`):

    export CMR_URS_PASSWORD=mock-urs-password

After adding the line and saving the file, don't forget to source the file

    source ~/.bash_profile

##### 3. Setting up local redis for CMR

CMR comes with redis in the jar, but it is not compiled to run on Macs.  If you need to run the CMR on a Mac, install redix with homebrew

    brew update
    brew install redis
    brew services start redis

For more information, see one of these links

    https://www.devglan.com/blog/install-redis-windows-and-mac
    https://gist.github.com/tomysmile/1b8a321e7c58499ef9f9441b2faa0aa8

##### 4. Running the CMR npm scripts

To start the local CMR:

    npm run cmr:start

To load data into the local CMR:

    npm run cmr:setup

After you see "Done!", you can load the app in your browser and use the local CMR. After you have started CMR, to just reload the data:

    npm run cmr:reset
    npm run cmr:setup

To stop the locally running CMR, run this command:

    npm run cmr:stop

You will need to stop the CMR before upgrading to a new CMR version. Note: stopping the running CMR for any reason will delete all data from the CMR. You will have to load the data again when you start it.

### Running a local CMR GraphQL

To setup cmr-graphql, follow the readme on the repo [here](https://github.com/nasa/cmr-graphql)

After you have cmr-graphql set up, run this command (within the cmr-graphql repo) to start it and point it to your local CMR

    CMR_ROOT_URL=http://localhost:4000 npm start

### Running a local CMR proxy

The local CMR uses ports instead of the routes you see in production. So you also need to start the graphql proxy found within this repo for the local cmr-graphql to succesfully talk to local CMR.

After opening a new terminal within the MMT repo, run this command:

    npm run start:proxy

### Running a local GraphDB

To run GraphDB in docker, run this script

    npm run start:graphdb

#### Running Serverless Offline (API Gateway/Lambdas)

In order to run serverless-offline, which is used for mimicing API Gateway to call lambda functions, run this command:

    npm run offline

#### Running MMT

After starting the local CMR, cmr-graphql and GraphDB, run the start command

    npm start

### UMM JSON-Schema

You can view/download the latest UMM JSON-Schema here, https://git.earthdata.nasa.gov/projects/CMR/repos/cmr/browse/umm-spec-lib/resources/json-schemas

## Local Testing

To run the tests:

    npm run test
