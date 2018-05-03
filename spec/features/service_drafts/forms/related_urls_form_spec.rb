require 'rails_helper'

describe 'Related URLs Form', js: true do
  before do
    login
    draft = create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first)
    visit edit_service_draft_path(draft, 'related_urls')
    click_on 'Expand All'
  end

  context 'when submitting the form' do
    before do
      fill_in 'Description', with: 'Test related url'
      select 'Distribution URL', from: 'Url Content Type'
      select 'Get Service', from: 'Type'
      select 'Software Package', from: 'Subtype'
      fill_in 'Url', with: 'nasa.gov'
      select 'application/json', from: 'Mime Type'
      select 'HTTP', from: 'Protocol'
      fill_in 'Full Name', with: 'Test Service'
      fill_in 'Data ID', with: 'Test data'
      fill_in 'Data Type', with: 'Test data type'
      fill_in 'service_draft_draft_related_urls_0_get_service_uri_0', with: 'Test URI 1'
      click_on 'Add another Uri'
      fill_in 'service_draft_draft_related_urls_0_get_service_uri_1', with: 'Test URI 2'

      fill_in 'Online Access Url Pattern Match', with: 'Online Access URL Pattern Match'
      fill_in 'Online Access Url Pattern Substitution', with: 'Online Access URL Pattern Substitution'

      within '.nav-top' do
        click_on 'Save'
      end

      click_on 'Expand All'
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Service Draft Updated Successfully!')
    end

    context 'when viewing the form' do
      include_examples 'Related URLs Form'
    end
  end
end
