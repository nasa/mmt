require 'rails_helper'

shared_examples_for 'Service Information Form' do
  it 'displays the form with values' do
    expect(page).to have_field('Name', with: 'Service Name')
    expect(page).to have_field('Long Name', with: 'Long Service Name')
    expect(page).to have_field('Type', with: 'NOT PROVIDED')
    expect(page).to have_field('Version', with: '1.0')
    expect(page).to have_field('Description', with: 'Description of the test service')
  end
end
