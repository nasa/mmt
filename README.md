# Metadata Management Tool Application 
The Metadata Management Tool is a web application to assist users in managing metadata on various Nasa.gov applications.

## Getting Started

### Requirements
 - Ruby ???

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

### Usage

To start the project, just type the default rails command:

    rails s


