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

1. Go to this page https://ci.earthdata.nasa.gov/browse/CMR-CSB/latestSuccessful/artifact/

2. Download the `cmr-dev-system-uberjar.jar` file.
    * Note: It will rename itself to `cmr-dev-system-0.1.0-SNAPSHOT-standalone.jar`. This is the correct behavior. **DO NOT rename the file.**

3. In your root directory for MMT, create a folder named `cmr`.

4. Place the `cmr-dev-system-0.1.0-SNAPSHOT-standalone.jar` file in the `cmr` folder from Step #3.

To start the local CMR and load data*:

    rake cmr:start_and_load

After you see "Done!", you can load the app in your browser and use the local CMR. After you have started CMR, to just reload the data:

    rake cmr:load

To stop the locally running CMR, run this command:

    rake cmr:stop

You will need to stop the CMR before upgrading to a new CMR version. Note: stopping the running CMR for any reason will delete all data from the CMR. You will have to load the data again when you start it.

## Inserting Sample Drafts

You can insert sample drafts into your local database. These commands use the first user in the database (should only be one), and add the drafts to your current provider, so make sure you login to the system and select a provider or the commands will fail.

To insert a sample draft that only has the required fields present:

    rake drafts:load_required

To insert a sample draft with every field completed:

    rake drafts:load_full

## Troubleshooting

### OpenSSL Issue

*If you have a similar error from `rake cmr:start_and_load` below:

    Faraday::Error::ConnectionFailed: SSL_connect returned=1 errno=0 state=SSLv3 read server certificate B: certificate verify failed

Try the following steps:

1. Ensure you are using RubyGems 2.0.3 or newer by typing `gem -v`. If it is older, type `gem update --system` to upgrade the RubyGems system.

2. Update the SSL certificates by running the following commands

    * `brew update`
    * `brew install openssl`
    * `brew link openssl --force`

3. Restart your terminal to refresh the OpenSSL version.

4. Check to ensure that OpenSSL version is 1.0.2 or newer with the command `openssl version`

5. Try running `rake cmr:start` and `rake cmr:load` as instructed above. If you still have issues, continue with these instructions below:

6. Uninstall Ruby 2.2.2. If you are using rvm, use the command `rvm remove 2.2.2`

7. Find out where your OpenSSL directory is by typing `which openssl`. An example directory you might get would be `/usr/local/bin/openssl`

8. Reinstall Ruby with the following command (if you are using rvm): `rvm install 2.2.2 --with-open-ssl-dir={DIRECTORY FROM STEP 7}`.

    * Using the example directory from above, it would be `rvm install 2.2.2 --with-open-ssl-dir=/usr/local/bin/openssl`.

9. Run `bundle install` to install any missing gems.

    * If your terminal tells you that it does not recognize the `bundle` command, run `gem install bundler`

9. Restart your terminal to refresh all settings.

10. Navigate to MMT directory and check to make sure Ruby and OpenSSL version are correct.

11. Run `rake cmr:start` and `rake cmr:load` again. If you still have issues, please reach out to a developer to help with troubleshooting.

### UMM JSON-Schema

You can view/download the latest UMM JSON-Schema here, https://git.earthdata.nasa.gov/projects/CMR/repos/cmr/browse/umm-spec-lib/resources/json-schemas

## Local Testing

#### JavaScript
MMT uses PhantomJS which allows us to run our Capybara tests on a headless WebKit browser. Before you're able to run tests locally you'll need to install it. The easiest way to accomplish this would be to use [Homebrew](http://brew.sh/) or a similar packager manager. If you're using Homebrew, run the following the command:

    brew install phantomjs

#### VCR
MMT uses [VCR](https://github.com/vcr/vcr) to record non-localhost HTTP interactions, it is configured in [spec/support/vcr.rb](spec/support/vcr.rb).

All calls to localhost are ignored by VCR and therefore will not be recorded.

This isn't an issue normally but with MMT we run a number of services locally while developing that we would like to be recorded. 

#### CMR

For calls to CMR that are asyncronous, we do have a method of waiting for those to finish, syncronously. Within the [spec/helpers/cmr_helper.rb](spec/helpers/cmr_helper.rb) we have a method called `wait_for_cmr` that makes two calls to CMR and ElasticSearch to ensure all work is complete. This should ONLY be used within tests. 

###### * PLEASE ENSURE ALL TESTS PASS BEFORE SUBMITTING A PULL REQUEST *