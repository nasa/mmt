require 'rails_helper'

shared_examples_for 'Related URLs Form' do
  it 'displays the form with values' do
    expect(page).to have_field('Description', with: 'Test related url')
    expect(page).to have_field('Url Content Type', with: 'DistributionURL')
    expect(page).to have_field('Type', with: 'GET SERVICE')
    expect(page).to have_field('Subtype', with: 'SOFTWARE PACKAGE')
    expect(page).to have_field('Url', with: 'nasa.gov')
    expect(page).to have_field('Mime Type', with: 'application/json')
    expect(page).to have_field('Protocol', with: 'HTTP')
    expect(page).to have_field('Full Name', with: 'Test Service')
    expect(page).to have_field('Data ID', with: 'Test data')
    expect(page).to have_field('Data Type', with: 'Test data type')
    expect(page).to have_field('service_draft_draft_related_urls_0_get_service_uri_0', with: 'Test URI 1')
    expect(page).to have_field('service_draft_draft_related_urls_0_get_service_uri_1', with: 'Test URI 2')
  end
end
