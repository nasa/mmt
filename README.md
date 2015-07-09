# Metadata Management Tool Application
The Metadata Management Tool is a web application to assist users in managing metadata on various Nasa.gov applications.

## Getting Started

### Requirements
 - Ruby 2.2.2

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
In order to use a local copy of the CMR you will need to download the latest file and ingest some sample data. 

1. Go to this page https://ci.earthdata.nasa.gov/browse/CMR-CSB

2. Click on the latest successful build from Recent History.

3. Scroll to the Shared Artifacts section 

4. Download the `cmr-dev-system-uberjar.jar` file.
    * Note: It will rename itself to something like `cmr-dev-system-0.1.0-SNAPSHOT-standalone.jar`. This is normal and you do not need to take any additional action.
    
5. In your root directory for MMT, create a folder named `cmr`.

6. Place the `cmr-dev-system-0.1.0-SNAPSHOT-standalone.jar` file in the `cmr` folder from Step #5.

To start the local CMR:

    rake cmr:start

After 5-10 seconds you will see some log4j messages in your terminal. 10-15 seconds after that you can ingest some dummy data (press enter to get a new prompt)*:

    rake cmr:load

After you see "Done!", you can load the app in your browser and use the local CMR. If you see an error `Faraday::Error::ConnectionFailed: Connection refused - connect(2)` you should wait a few more seconds, then try to load data again.

To stop the locally running CMR, run this command:

    rake cmr:stop

You will need to stop the CMR before upgrading to a new CMR version. Note: stopping the running CMR for any reason will delete all data from the CMR. You will have to load the data again when you start it.

## Troubleshooting

### OpenSSL Issue

*If you have a similar error from `rake cmr:load` below:

    Faraday::Error::ConnectionFailed: SSL_connect returned=1 errno=0 state=SSLv3 read server certificate B: certificate verify failed

Try the following steps:

1. Ensure you are using RubyGems 2.0.3 or newer by typing `gem -v`. If it is older, type `gem update --system` to upgrade the RubyGems system.

2. Update the SSL certificates by running the following commands

    * `brew update`
    * `brew install openssl`
    * `brew link openssl --force`
    * `brew install curl-ca-bundle`

3. Check to ensure that OpenSSL version is 1.0.2 or newer with the command `openssl version`

4. Restart your terminal to refresh the OpenSSL.

5. Try running `rake cmr:start` and `rake cmr:load` as instructed above. If you still have issues, continue with these instructions below:

6. Uninstall Ruby 2.2.2. If you are using rvm, use the command `rvm remove 2.2.2`

7. Find out where your OpenSSL directory is by typing `which openssl`. An example directory you might get would be `/usr/local/bin/openssl`

8. Reinstall Ruby with the following command (if you are using rvm): `rvm install 2.2.2 --with-open-ssl-dir={DIRECTORY FROM STEP 5}`. 

    * Using the example directory from above, it would be `rvm install 2.2.2 --with-open-ssl-dir=/usr/local/bin/openssl`.

9. Restart your terminal to refresh all settings.

10. Run `rake cmr:start` and `rake cmr:load` again. If you still have issues, please reach out to a developer to help with troubleshooting.