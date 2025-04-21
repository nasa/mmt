## Documentation for the local CMR
MMT uses a local version of the CMR for our development and test environments. Downloading it is described in our main Readme. Our local CMR setup is run through our rake tasks described also in the Readme file.
The main file that is run by that rake task is `lib/test_cmr/local.rb`.

### This Document is currently a DRAFT
This should be more fully fleshed out with MMT-1517 to refactor the files described here

### CMR ports
These are the main ports we use in local setup
  1. http://localhost:3002
    * Ingest
    * Documentation at https://cmr.sit.earthdata.nasa.gov/ingest/site/docs/ingest
    * providers created here
  2. http://localhost:3008
    * Mock Echo
    * a RESTful API for Echo, supposed to work locally and give same basic functionality as ECHO
  3. http://localhost:3011
    * Access Control - ACLs and Groups
    * Documentation at https://cmr.sit.earthdata.nasa.gov/access-control/site/docs/access-control/


### ACLs
ACLs, or Access Control Lists, are how CMR sets user permissions to have CRUD (and a few other actions) access to CMR resources/data. ACLs are granted to groups, and users have to be in a group to have rights granted by any ACL. Tokens are how CMR identifies a user and determines their groups and ACLs.
SIDS (may need a better explanation) link a user to ACLs.
See the documentation linked above for more detailed information on CMR Access Control

### `load_data.rb`
This is the main script that runs and sets up our local CMR environment. It has three main methods that it runs:

#### 1. `setup_cmr`
This sets up all the initial user tokens, providers, groups, and ACLs.
  1. Set up the user tokens: user `admin` will be assigned token `ABC-1` and user `typical` will be assigned token `ABC-2`
  2. Create Providers in CMR
  3. Create the same Providers in Mock Echo. These providers need to be created in both places
  4. Create Groups in CMR Access Control to use for ACLs
  5. Add ACLs for all providers for 'guest' and 'registered' users to access collections and granules (collection permissions, aka CATALOG_ITEM_ACLs) and ingest (INGEST_MANAGEMENT_ACL)
  6. Add ACLs for the providers. These include rights to take actions for GROUP, CATALOG_ITEM_ACL, and PROVIDER_OBJECT_ACL.

#### 2. `insert_metadata`
This ingests all the collection metadata for initial setup. We are loading the data from `.yml` files in `lib/test_cmr/data/`.

We have the data stored as yaml files so it isn't necessary to re-download the metadata each time we are running the local CMR setup.
If changes to these collections need to be made, the list of data we should be loading is listed in `lib/test_cmr/test_data.json`, and the `save_data` method will download and serialize the data as yaml files.

#### 3. `additional_cmr_setup`
After all the initial CMR setup is done and collections are ingested, this script adds a Collection Permission (catalog item acl) for a single collection for a provider that is used for a specific test.

#### `reset_provider`
This method is used by our tests. It tears down a provider (almost always MMT_2) and recreates that provider (with the same provider_id) and recreates the group and ACLs we create in the regular CMR setup in `load_data`

### non public CMR API calls
There are some calls in `load_data.rb` to CMR that are not public API calls. They are needed to make sure the local setup and testing correctly _____ like reindexing, clearing the cache, and tearing down and standing up providers. ___

- `clear_cache`
This call is the bootstrap clear_cache call. It clears out the ACL cache because sometimes there is a discrepancy between the cache and what ACL has
- `reindex_permitted_groups`
go through all collections and check ACLs which group ids have permissions and puts it in the elastic document for collections (collection index)
  ACLs and Collections each have their own elastic index
- `wait_for_indexing`
  These calls wait for the CMR queue to be empty and refreshes the ElasticSearch Index
