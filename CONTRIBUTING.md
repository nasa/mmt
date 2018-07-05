# Making Changes #

Thanks for contributing!

To allow us to incorporate your changes, please use the following process:

1. Fork this repository to your personal account.
2. Create a branch and make your changes.
3. Test the changes locally/in your personal fork.
4. Submit a pull request to open a discussion about your proposed changes.
5. The maintainers will talk with you about it and decide to merge or request additional changes.

Below are specific guidelines for contributing to Earthdata Search.
For general tips on open source contributions, see
[Contributing to Open Source on GitHub](https://guides.github.com/activities/contributing-to-open-source/).

# General Contribution Guidelines #

## Be Consistent ##

Please ensure that source code, file structure, and visual design do not break
existing conventions without compelling reasons.

This includes:

* [Rubocop](https://github.com/rubocop-hq/ruby-style-guide)
* [Coffee script](https://github.com/polarmobile/coffeescript-style-guide)

## Test, and Don't Break Tests ##

Add tests for new work to ensure changes work and that future changes
do not break them. Run the test suite to ensure that new changes have
not broken existing features. Ensure that tests pass regardless
of timing or execution order.

MMT uses PhantomJS which allows us to run our Capybara tests on a headless
WebKit browser. Before you're able to run tests locally you'll need to install
it. The easiest way to accomplish this would be to use Homebrew or a similar
packager manager. See [README.md](README.md) for details on how to install.

# Code structure

Our code generally follows Ruby on Rails conventions. The descriptions below
describe useful conventions not outlined by Rails; they touch on the most
important pieces of code and do not attempt to describe every directory.
  
  * `app`
    * `policies` - See Pundit Gem
    * `services` - "ogre_client" for dealing with shapefile to get GEOJSON data
  * `cmr/` - CMR runtime for running locally
  * `lib/`
    * `cmr` - client for dealing with the CMR client
    * `echo` - client dealing with the ECHO client
    * `json_schema_form`
    * `test_cmr`
    
# Testing #

Fast and consistent tests are critical. The full suite is quite long and take at
least 45 minutes. Please ensure new tests run quickly and pass consistently
regardless of execution order so as to not extend the total time any longer then
necessary. Any suggestions for improving the total testing execution time is
welcome.

The entire suite of MMT tests, including unit, functional, and integration
tests, may be run using the `rspec` command.

# Pull requests #
Please describe your feature and changes in detail. If available, contact a
member of the team and arrange for a code review based on a newly created pull
request. Pull requests can not be accepted if tests do not pass. Further, we do
Continuous Integration tests which also must pass before any pull request can be
accepted.

# License #

Earthdata Search is licensed under an Apache 2.0 license as described in
the LICENSE file at the root of the project:

> Copyright © 2007-2014 United States Government as represented by the Administrator of the National Aeronautics and Space Administration. All Rights Reserved.
>
> Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
> You may obtain a copy of the License at
>
>     http://www.apache.org/licenses/LICENSE-2.0
>
> Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
> WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

By submitting a pull request, you are agreeing to allow distribution
of your work under the above copyright and license.
