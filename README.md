# Metadata Management Tool Application
The Metadata Management Tool is a web application to assist users in managing metadata on various Nasa.gov applications.

## Getting Started

### Requirements
 - Ruby 2.5.1

### Setup
Clone the Metadata Management Tool Git project:

    git clone https://github.com/nasa/mmt.git

Type the following command to install the necessary components:

    bundle install

Depending on your version of Ruby, you may need to install ruby rdoc/ri data:

    <= 1.8.6 : unsupported
     = 1.8.7 : gem install rdoc-data; rdoc-data --install
     = 1.9.1 : gem install rdoc-data; rdoc-data --install
    >= 1.9.2 : you're good to go!

#### Aditional Install Steps
Some operating systems may require additional steps.

Mac OS X 10.14.6 moved some required libraries around which has been known to cause nokogiri to not install, if you have errors with that gem, you may need to run the following:

    open /Library/Developer/CommandLineTools/Packages/macOS_SDK_headers_for_macOS_10.14.pkg

Details can be found on nokogiri's [site](https://nokogiri.org/tutorials/installing_nokogiri.html#macos).

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

*_Note: With Launchpad Integration, you will need to set up MMT to run locally with HTTPS. Please see `/doc/local_https_setup.md` for options and instructions_

To start the project, just type the default rails command:

    rails s

If you need to stop the server from running, hit `Ctrl + C` and the server will shutdown.

### Running a local copy of CMR
In order to use a local copy of the CMR you will need to download the latest file, set an environment variable, and run a rake task to set required permissions and ingest some data.

#### 1. Downloading the CMR file
Go to https://ci.earthdata.nasa.gov/browse/CN2-CSN2/latestSuccessful/artifact/, and download the `cmr-dev-system-uberjar.jar` file.
  * Note: It will rename itself to `cmr-dev-system-0.1.0-SNAPSHOT-standalone.jar`. This is the correct behavior. **DO NOT rename the file.**

In your root directory for MMT, create a folder named `cmr`. Place the `cmr-dev-system-0.1.0-SNAPSHOT-standalone.jar` file in the `cmr` folder.

#### 2. Setting the environment variable needed by the local CMR
Before running a local copy of the CMR, you will need to set a required environment variable. Add this line into your `.bash_profile`:

    export CMR_URS_PASSWORD=mock-urs-password

After adding the line and saving the file, don't forget to source the file

    source ~/.bash_profile

#### 3. Running the CMR rake tasks
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

* If you receive a error from running `rake cmr:start_and_load` like

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

## ACLs
Access Control Lists (ACLs, aka Permissions) determine access to data and functionality in the CMR. See the [Access Control Documentation](https://cmr.earthdata.nasa.gov/access-control/site/docs/access-control/api.html) for technical information.

### Testing against ACLs
When testing functionality in the browser that requires specific permissions you'll need to ensure your environment is setup properly and you're able to assign yourself the permissions necessary. This includes:

1. Creating a Group
2. Add your URS account as a member of the group
3. Give your URS account access to the MMT Users Group

This provides access to the Provider Object Permissions pages.

4. Give your URS account access to the MMT Admins Group

This gives you permission to view system level groups.

From here you'll need to visit the Provider Object Permissions page, and find your group, from here you'll be able to modify permissions of the group so that you can test functionality associated with any of the permissions.

##### Automating ACL Group Management
To run the above steps automatically there is a provided rake task to do the heavy lifting.

    rake acls:testing:prepare[URS_USERNAME]

Replacing URS_USERNAME with your own username. An example:

    $ rake acls:testing:prepare[username]
    [Success] Group `USERNAME Testing Group` created.
    [Success] Added username to MMT Users
    [Success] Added username to MMT Admins

From here I'm able to visit `/provider_identity_permissions` and see my newly created group. Clicking on it allows me to grant myself Provider Level Access to the necessary targets for testing.

### Draft MMT
The Draft MMT is intended for Non-NASA Users to propose new metadata records or changes to existing records in the CMR.

Changing to the Draft MMT (aka proposal mode) is controlled the `proposal_mode` environment variable in your `application.yml` file.

Access to the Draft MMT is controlled by the Non-NASA Draft User and Non-NASA Draft Approver ACLs. There is a rake task that will create the group and assign the ACL for you (make sure you use your own username):

    rake acls:proposal_mode:draft_user[URS_USERNAME]

or

    rake acls:proposal_mode:draft_approver[URS_USERNAME]

  * make sure you use your own username
  * make sure that `proposal_mode` is set to 'false' in your `application.yml` file when you run this rake task. If you see `NotAllowedError: A requested action is not allowed in the current configuration.` when running this rake task, you missed this step.

### Replicating SIT Collections Locally
Often we need collections to exist in our local CMR that already exist in SIT for the purposes of sending collection ids (concept ids) as part of a payload to the ECHO API that doesn't run locally, but instead on testbed. In order to do this the collection concept ids have to match those on SIT so we cannot simply download and ingest them. A rake task exists to replicate collections locally for this purpose.

    $ rake collections:replicate

The task accepts two parameters

- **provider:** The provider id to replicate collections for *default: MMT_2*
- **page_size:** The number of collections to request *default: 25*

##### Examples

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



Apache License
                           Version 2.0, January 2004
                        https://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner. For the purposes of this definition, "submitted"
      means any form of electronic, verbal, or written communication sent
      to the Licensor or its representatives, including but not limited to
      communication on electronic mailing lists, source code control systems,
      and issue tracking systems that are managed by, or on behalf of, the
      Licensor for the purpose of discussing and improving the Work, but
      excluding communication that is conspicuously marked or otherwise
      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross-claim or counterclaim in a lawsuit) alleging that the Work
      or a Contribution incorporated within the Work constitutes direct
      or contributory patent infringement, then any patent licenses
      granted to You under this License for that Work shall terminate
      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:

      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file, excluding those notices that do not
          pertain to any part of the Derivative Works, in at least one
          of the following places: within a NOTICE text file distributed
          as part of the Derivative Works; within the Source form or
          documentation, if provided along with the Derivative Works; or,
          within a display generated by the Derivative Works, if and
          wherever such third-party notices normally appear. The contents
          of the NOTICE file are for informational purposes only and
          do not modify the License. You may add Your own attribution
          notices within Derivative Works that You distribute, alongside
          or as an addendum to the NOTICE text from the Work, provided
          that such additional attribution notices cannot be construed
          as modifying the License.

      You may add Your own copyright statement to Your modifications and
      may provide additional or different license terms and conditions
      for use, reproduction, or distribution of Your modifications, or
      for any such Derivative Works as a whole, provided Your use,
      reproduction, and distribution of the Work otherwise complies with
      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE. You are solely responsible for determining the
      appropriateness of using or redistributing the Work and assume any
      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or consequential damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or any and all
      other commercial damages or losses), even if such Contributor
      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may act only
      on Your own behalf and on Your sole responsibility, not on behalf
      of any other Contributor, and only if You agree to indemnify,
      defend, and hold each Contributor harmless for any liability
      incurred by, or claims asserted against, such Contributor by reason
      of your accepting any such warranty or additional liability.

   END OF TERMS AND CONDITIONS

   APPENDIX: How to apply the Apache License to your work.

      To apply the Apache License to your work, attach the following
      boilerplate notice, with the fields enclosed by brackets "[]"
      replaced with your own identifying information. (Don't include
      the brackets!)  The text should be enclosed in the appropriate
      comment syntax for the file format. We also recommend that a
      file or class name and description of purpose be included on the
      same "printed page" as the copyright notice for easier
      identification within third-party archives.

   Copyright 2019 Rolando Gopez Lacuata. 

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       https://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
