# Metadata Management Tool Application

The Metadata Management Tool (MMT) and Draft Metadata Management Tool (dMMT) are web applications designed to assist users in managing metadata and interfacing with the CMR. The user’s guide for MMT can be found [here](https://wiki.earthdata.nasa.gov/display/ED/Metadata+Management+Tool+%28MMT%29+User%27s+Guide "MMT User Guide") and the user’s guide for dMMT can be found [here](https://wiki.earthdata.nasa.gov/display/ED/Draft+MMT+%28dMMT%29+User%27s+Guide "dMMT User Guide"). Release notes for these applications can be found [here](https://wiki.earthdata.nasa.gov/display/ED/MMT+Release+Notes "Release Notes").

## Getting Started

### Requirements

- Ruby 3.0.6

### Setup

Clone the Metadata Management Tool Git project:

    git clone https://github.com/nasa/mmt.git

Type the following command to install the necessary components:

    bundle install

#### Additional Install Steps

Some operating systems may require additional steps.

Mac OS X 10.14.6 moved some required libraries around which has been known to cause nokogiri to not install, if you have errors with that gem, you may need to run the following:

    open /Library/Developer/CommandLineTools/Packages/macOS_SDK_headers_for_macOS_10.14.pkg

Details can be found on nokogiri's [site](https://nokogiri.org/tutorials/installing_nokogiri.html#macos).

The libxml gem has also historically caused difficulty because it is a native library. If you are having issues installing libxml-ruby (cannot find libxml.h), you may need to configure it with the location of your libxml2 directory. You can do a:

    find / -name xmlversion.h

which may return something like the following:

    /Library/Developer/CommandLineTools/SDKs/MacOSX.sdk/usr/include/libxml2/libxml/xmlversion.h

then you can run `bundle config` with the location of libxml2 returned from the find command as in:

    bundle config build.libxml-ruby --with-xml2-include=/Library/Developer/CommandLineTools/SDKs/MacOSX.sdk/usr/include/libxml2

You should then be able to run `bundle install` as normal afterwards.

#### Database

Check your `/config/` directory for a `database.yml` file (with no additional extensions). If you do not have one, duplicate* the `database.yml.example` file and then rename it to `database.yml`.

*_Note: Do not simply rename the `database.yml.example` file as it is being tracked in Git and has its own history._

Next, create your database by running the standard rails command:

    rake db:create

And then to migrate the database schema, run the standard rails command:

    rake db:migrate

#### Other Steps

Finally, create an `application.yml` file in your `/config/` directory. The contents of this file will be supplied by an MMT developer

### Usage

*_Note: Before running this step, make sure you are **Running a local copy of CMR** as outlined below_

*_Note: If you want to run on http://localhost:3000 and just use Earthdata Login, you may need to modify entries in the `application.yml` file. Replace the 'urs...url' entries from 'https://mmt.localtest.earthdata.nasa.gov' to 'http://localhost:3000'_

*_Note: With Launchpad Integration, you will need to set up MMT to run locally with HTTPS. Please see `/doc/local_https_setup.md` for options and instructions_

To start the project, just type the default rails command:

    rails s

If you need to stop the server from running, hit `Ctrl + C` and the server will shutdown.

### Running a local copy of CMR

In order to use a local copy of the CMR you will need to download the latest file, set an environment variable, and run a rake task to set required permissions and ingest some data.

#### 1. Downloading the CMR file

If access to https://maven.earthdata.nasa.gov is possible, then the rake command `rake cmr:fetch` can be used to download the latest CMR jar. This task put the jar file in the `cmr` directory.
If this task fails for some reason, such as the maven repository is down, you can follow the instructions below to download and install manually from Bamboo:

Go to https://ci.earthdata.nasa.gov/browse/CN2-CSN2/latestSuccessful/artifact/, and download the `cmr-dev-system-uberjar.jar` file.
  
- Note: It will rename itself to `cmr-dev-system-0.1.0-SNAPSHOT-standalone.jar`. This is the correct behavior. **DO NOT rename the file.**

In your root directory for MMT, create a folder named `cmr`. Place the `cmr-dev-system-0.1.0-SNAPSHOT-standalone.jar` file in the `cmr` folder.

#### 2. Setting the environment variable needed by the local CMR

Before running a local copy of the CMR, you will need to set a required environment variable. Add this line into your `.bash_profile`:

    export CMR_URS_PASSWORD=mock-urs-password

After adding the line and saving the file, don't forget to source the file

    source ~/.bash_profile

#### 3. Setting up local redis for CMR

CMR comes with redis in the jar, but it is not compiled to run on Macs.  If you need to run the CMR on a Mac, download it from

    https://redis.io/

CMR does not appear to be making significant configuration changes to redis, so a positive response from executing these commands in redis's root directory:

    make
    make test

should be sufficient to run CMR locally.  Run this command before starting CMR each session:

    path/to/redis/src/redis-server

The option '--daemonize yes' runs the server in the background.

Alternatively, you can install Redis with homebrew

The basics are

    brew update
    brew install redis
    brew services start redis

For more information, see one of these links

    https://www.devglan.com/blog/install-redis-windows-and-mac
    https://gist.github.com/tomysmile/1b8a321e7c58499ef9f9441b2faa0aa8

#### 4. Running the CMR rake tasks

To start the local CMR and load data*:

    rake cmr:start_and_load

After you see "Done!", you can load the app in your browser and use the local CMR. After you have started CMR, to just reload the data:

    rake cmr:load

To stop the locally running CMR, run this command:

    rake cmr:stop

You will need to stop the CMR before upgrading to a new CMR version. Note: stopping the running CMR for any reason will delete all data from the CMR. You will have to load the data again when you start it.

## Inserting Sample Drafts

You can insert sample drafts into your local database. These commands use the first user in the database (there should only be one), and add the drafts to your current provider, so make sure you login to the system and select a provider or the commands will fail.

To insert a sample draft that only has the required fields present:

    rake drafts:load_required

To insert a sample draft with every field completed:

    rake drafts:load_full

## Troubleshooting

### OpenSSL Issue

If you receive a error from running `rake cmr:start_and_load` like

    Faraday::ConnectionFailed: SSL_connect returned=1 errno=0 state=SSLv3 read server certificate B: certificate verify failed

Try the following steps:

1. Ensure you are using RubyGems 2.0.3 or newer by typing `gem -v`. If it is older, type `gem update --system` to upgrade the RubyGems system.

2. Update the SSL certificates by running the following commands

    - `brew update`
    - `brew install openssl`
    - `brew link openssl --force`

3. Restart your terminal to refresh the OpenSSL version.

4. Check to ensure that OpenSSL version is 1.0.2 or newer with the command `openssl version`

5. Try running `rake cmr:start` and `rake cmr:load` as instructed above. If you still have issues, continue with these instructions below:

6. Uninstall Ruby 2.2.2. If you are using rvm, use the command `rvm remove 2.2.2`

7. Find out where your OpenSSL directory is by typing `which openssl`. An example directory you might get would be `/usr/local/bin/openssl`

8. Reinstall Ruby with the following command (if you are using rvm): `rvm install 2.2.2 --with-open-ssl-dir={DIRECTORY FROM STEP 7}`.

    - Using the example directory from above, it would be `rvm install 2.2.2 --with-open-ssl-dir=/usr/local/bin/openssl`.

9. Run `bundle install` to install any missing gems.

    - If your terminal tells you that it does not recognize the `bundle` command, run `gem install bundler`

10. Restart your terminal to refresh all settings.

11. Navigate to MMT directory and check to make sure Ruby and OpenSSL version are correct.

12. Run `rake cmr:start` and `rake cmr:load` again. If you still have issues, please reach out to a developer to help with troubleshooting.

### Earthdata Login Issue

If you receive an error when logging into MMT using Earthdata Login such as

    JSON::ParserError at /urs_login_callback
    784: unexpected token at 'null'

Check your cmr.log file. It may show some errors and you need to restart your local copy of cmr.

### UMM JSON-Schema

You can view/download the latest UMM JSON-Schema here, https://git.earthdata.nasa.gov/projects/CMR/repos/cmr/browse/umm-spec-lib/resources/json-schemas

## Local Testing

### JavaScript

MMT uses PhantomJS which allows us to run our Capybara tests on a headless WebKit browser. Before you're able to run tests locally you'll need to install it. The easiest way to accomplish this would be to use [Homebrew](http://brew.sh/) or a similar packager manager. If you're using Homebrew, run the following the command:

    brew install phantomjs

### VCR

MMT uses [VCR](https://github.com/vcr/vcr) to record non-localhost HTTP interactions, it is configured in [spec/support/vcr.rb](spec/support/vcr.rb).

All calls to localhost are ignored by VCR and therefore will not be recorded.

This isn't an issue normally but with MMT we run a number of services locally while developing that we would like to be recorded.

### CMR

For calls to CMR that are asynchronous, we do have a method of waiting for those to finish, synchronously. Within the [spec/helpers/cmr_helper.rb](spec/helpers/cmr_helper.rb) we have a method called `wait_for_cmr` that makes two calls to CMR and ElasticSearch to ensure all work is complete. This should ONLY be used within tests.

## ACLs

Access Control Lists (ACLs, aka Permissions) determine access to data and functionality in the CMR. See the [Access Control Documentation](https://cmr.earthdata.nasa.gov/access-control/site/docs/access-control/api.html) for technical information.

### Testing against ACLs

When testing functionality in the browser that requires specific permissions you'll need to ensure your environment is setup properly and you're able to assign yourself the permissions necessary. This includes:

1. Creating a Group
2. Add your URS account and the user 'typical' as a member of the group
3. Ensuring the group created has appropriate Provider Context, Group, and Provider Object ACLs permissions.

This provides access to the Provider Object Permissions pages.

4. Give your URS account and the user 'typical' access to the Administrators_2 group

This gives you permission to view System Level Groups and the System Object Permissions pages.

From here you'll need to modify appropriate permissions of the group so that you can test functionality associated with any of the permissions via the group show page, or the Provider or System Object Permissions pages.

#### Automating ACL Group Management

To run the above steps automatically there is a provided rake task to do the heavy lifting.

    rake acls:testing:prepare[URS_USERNAME]

Replacing URS_USERNAME with your own username. An example:

    $ rake acls:testing:prepare[username]
    [Success] Added username to MMT_2 Admin Group
    [Success] Added username to Administrators_2

Then you can manage the Provider Level permissions by clicking on the group on the Provider Object Permissions page or by clicking on the Provider Object Permissions for MMT_2 link on the group show page. If System Level permissions are required, you can click on the Administrators_2 group from the System Object Permissions page or click on the System Object Permissions link from the group show page.

Alternatively, if only one of provider level access or system level access is required, you can use the more specific rake task:

    rake acls:groups:mmt_2_users[username]

or

    rake acls:groups:admins[username]

### Draft MMT

The Draft MMT is intended for Non-NASA Users to propose new metadata records or changes to existing records in the CMR.  There are several steps required to run a local version of Draft MMT.

1. Enable https connections to the Draft MMT.     See the directions for configuring https [here](doc/local_https_setup.md)

2. Configure MMT to use the https connection.  In your application.yml file, make sure that `urs_login_callback_url`   is set to `https://mmt.localtest.earthdata.nasa.gov/urs_login_callback_url`.  

3. Create ACLs to give yourself permission to use Draft MMT. Access to the Draft MMT is controlled by the Non-NASA Draft User and Non-NASA Draft Approver ACLs. There is a rake task that will create the group and assign the ACL for you (make sure you use your own username):

    $ rake acls:proposal_mode:draft_user[URS_USERNAME]

    or

    $ rake acls:proposal_mode:draft_approver[URS_USERNAME]

  * make sure you use your own username
  ***NOTE: Make sure that `proposal_mode` is set to 'false' in your `application.yml` file when you run this rake task. If you see `NotAllowedError: A requested action is not allowed in the current configuration.` when running this rake task, you missed this step.***

4. Change the app to the Draft MMT (aka proposal mode) by changing the `proposal_mode` environment variable in your `application.yml` file. Set `proposal_mode` to `true`.

5. Start the MMT app as usual with `bin/rails server -p 3000`  

6. Direct your browser to https://mmt.localtest.earthdata.nasa.gov .   Note that some browsers will give you a warning about the self-signed certificate that was created in step 1.  In that case,  use the browser controls to allow the certificate.

7. To return to normal MMT mode,  set `proposal_mode` to `false` in the application.yml file and restart the app.

### Replicating SIT Collections Locally

Often we need collections to exist in our local CMR that already exist in SIT for the purposes of sending collection ids (concept ids) as part of a payload to the ECHO API that doesn't run locally, but instead on testbed. In order to do this the collection concept ids have to match those on SIT so we cannot simply download and ingest them. A rake task exists to replicate collections locally for this purpose.

    $ rake collections:replicate

The task accepts two parameters

- **provider:** The provider id to replicate collections for *default: MMT_2*
- **page_size:** The number of collections to request *default: 25*

#### Examples

    $ rake collections:replicate[MMT_1,10]

Will download at most 10 collections from MMT_1.

    $ rake collections:replicate[SEDAC]

Will download at most 25 collections from SEDAC.

**NOTE** Some providers have permissions set on their collections and make require a token to view/download collections. You can set an ENV variable named

    CMR_SIT_TOKEN

that if set, will be provided to CMR when downloading collections. This variable is set by adding the following line to your **~/.bash_profile**

    export CMR_SIT_TOKEN=""

After adding the line and saving the file, don't forget to source the file.

    source ~/.bash_profile

### Running MMT UAT locally

Running UAT locally can make it easier to debug issues that only occur in UAT - typically because UAT has many more records (metadata, order options, service options, etc.). Assuming MMT is running normally in development mode, the following can be done to switch over to UAT mode. 

Obtain the `uat` object from the `application.yml` file that is used to run UAT remotely (this can be found in Bamboo). Using the information in the `uat` object, fill in empty fields of the new `uat` object below, and copy/paste this `uat` object into your local `application.yml` file.

    uat:
      <<: *defaults
      CMR_URS_PASSWORD: *<FILL IN WITH REMOTE UAT INFO>*
      urs_password: <FILL IN WITH REMOTE UAT INFO>
      urs_root: 'https://uat.urs.earthdata.nasa.gov/'
      urs_username: 'mmt_uat'
      urs_login_required: 'true'
      secret_key_base: *<FILL IN WITH REMOTE UAT INFO>*
      launchpad_login_required: 'false'
      launchpad_production: 'true'
      hide_launchpad_button: 'true'
      urs_association_callback_url: 'https://mmt.localtest.earthdata.nasa.gov/urs_association_callback'
      urs_login_callback_url: 'https://mmt.localtest.earthdata.nasa.gov/urs_login_callback'

 Paste the following into your local `database.yml` file: 

    uat:
      <<: *default
      database: db/uat.sqlite3
      
Then, in the `mmt` directory in your terminal stop your rails server if its running with `control + C` and run the following commands: 

    RAILS_ENV=uat rake db:create
    
    RAILS_ENV=uat rake db:migrate
    
    RAILS_ENV=uat rake db:seed
    
    RAILS_ENV=uat rake assets:precompile

The following URIs need to be added to the UAT URS Redirect URIs list:

    https://mmt.localtest.earthdata.nasa.gov/urs_association_callback
    https://mmt.localtest.earthdata.nasa.gov/urs_login_callback
    
like so:

![image](https://user-images.githubusercontent.com/42478387/123997171-17114500-d99e-11eb-8d3d-0318593e9eb8.png)

In your terminal, run: 

    RAILS_ENV=uat rails s

### Running the collection preview in development

In order for the collection preview to run in MMT, you will need to run a local instance of graphdb and graphql.   Here are the steps:

#### Graph DB

From your mmt directory(or any directory), start the server with:

    docker run -it -p 8182:8182 tinkerpop/gremlin-server conf/gremlin-server-rest-modern.yaml

(That will bring up a local instance of graphdb)

#### GraphQL

Clone the repo:

    git clone https://git.earthdata.nasa.gov/scm/edsc/edsc-graphql.git

Modify serverless.yml:

    httpPort: 6005
    lambdaPort: 6007

(Todo: Look into why we can't use the default 3003 and 3004, unless maybe cmr uber 
jar ports conflict)
And to start the server, use the following:

    CMR_ROOT_URL=http://localhost:3003 MMT_ROOT_URL=http://localhost:3000 DRAFT_MMT_ROOT_URL=http://localhost:3000 npm start

You will know the server is running when you see the following:

    Server ready: http://localhost:6005 🚀

    Enter "rp" to replay the last request

    ⠋ [Webpack] Watch service...    

Note: MMT will use the following urls for loading the snippet (see .env file):

    metadata_preview_js_url="https://access.sit.earthdata.nasa.gov/plugin/metadata-preview.22.2.4-3.js"
    metadata_preview_css_url="https://access.sit.earthdata.nasa.gov/plugin/metadata-preview.22.2.4-3.min.css"

So you'll need to be on the VPN to use the latest snippet.  If it doesn't matter if you
are using the latest, you can point to `access.earthdata.nasa.gov` instead and MMT
will run without the need of being on the VPN.   To find out which version is supported in 
production, look into the footer of the web page: 
https://access.earthdata.nasa.gov 

Note: If you get the following error: Cannot find module 'serverless-webpack'
You will need to install serverless-webpack:

    serverless plugin install --name serverless-webpack

##### Note

Temporary Source Code Changes necessary to get GraphQL working, there is a ticket (EDSC-3396) which should remove the necessity of doing this soon.

+++ b/src/utils/cmrGraphDb.js

    @@ -33,7 +33,7 @@ export const cmrGraphDb = ({
    data: query,
    headers: permittedHeaders,
    method: 'POST',
    -    url: `${process.env.cmrRootUrl}/graphdb`
    +    url: `${process.env.cmrRootUrl}:8182/graphdb`

+++ b/src/utils/cmrQuery.js

    @@ -58,8 +58,9 @@ export const cmrQuery = ({
    data: cmrParameters,
    headers: permittedHeaders,
    method: 'POST',
    -    url: `${process.env.cmrRootUrl}/search/${conceptType}.${format}`
    +    url: `${process.env.cmrRootUrl}/${conceptType}.${format}`