require 'rails_helper'

shared_examples_for 'Service Contacts Form' do
  it 'displays the form with values' do
    contact_groups_assertions
    contact_persons_assertions
  end
end
