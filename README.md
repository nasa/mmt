# Metadata Management Tool Application 
The Metadata Management Tool is a web application to assist users in managing metadata on various Nasa.gov applications.

## Getting Started

### Requirements
 - Ruby 2.1.2

### Setup
Clone the Earthdata Redesign Git project:

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