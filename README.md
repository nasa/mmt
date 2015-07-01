# Metadata Management Tool Application
The Metadata Management Tool is a web application to assist users in managing metadata on various Nasa.gov applications.

## Getting Started

### Requirements
 - Ruby 2.1.2

### Setup
Clone the Metadata Management Tool Git project:

    git clone https://<username>@git.earthdata.nasa.gov/scm/mmt/mmt_app.git

Type the following command to install the necessary components:

    bundle install

Depending on your version of Ruby, you may need to install ruby rdoc/ri data:

    <= 1.8.6 : unsupported
     = 1.8.7 : gem install rdoc-data; rdoc-data --install
     = 1.9.1 : gem install rdoc-data; rdoc-data --install
    >= 1.9.2 : you're good to go!

Check your `/config/` directory for a `database.yml` file (with no additional extensions). If you do not have one, duplicate* the `database.yml.example` file and then rename it to `database.yml`.

*_Note: Do not simply rename the `database.yml.example` file as it is being tracked in Git and has its own history._

Next, create your database by running the standard rails command:

    rake db:create

And then to migrate the database schema, run the standard rails command:

    rake db:migrate

### Usage

To start the project, just type the default rails command:

    rails s

And if you need to stop the server from running, hit `Ctrl + C` and the server will shutdown.

### Running a local copy of CMR
In order to use a local copy of the CMR you will need to download the latest cmr-dev-system-uberjar.jar file and ingest some sample data. Download the latest version of cmr-dev-system-uberjar.jar here:

    https://ci.earthdata.nasa.gov/browse/CMR-CSB/latest/artifact/

Place this file in (Rails.root)/cmr/

To start the local CMR:

    rake cmr:start

After 5-10 seconds you will see some log4j messages in your terminal. 10-15 seconds after that you can ingest some dummy data (press enter to get a new prompt):

    rake cmr:load

After you see "Done!", you can load the app in your browser and use the local CMR. If you see an error `Faraday::Error::ConnectionFailed: Connection refused - connect(2)` you should wait a few more seconds, then try to load data again.

To stop the locally running CMR, run this command:

    rake cmr:stop

You will need to stop the CMR before upgrading to a new CMR version. Note: stopping the running CMR for any reason will delete all data from the CMR. You will have to load the data again when you start it.
