require 'rails_helper'

describe 'Service Draft form navigation' do
  let(:form_titles) { ['Service Information', 'Service Identification', 'Descriptive Keywords', 'Service Organizations', 'Service Contacts', 'Options', 'Operation Metadata'] }

  context 'when visiting the edit page for a service draft' do
    before do
      login

      visit new_service_draft_path
    end

    it 'renders the Service Information form' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Service Drafts')
        expect(page).to have_content('New')
      end

      within first('.umm-form fieldset h3') do
        expect(page).to have_content('Service Information')
      end
    end

    it 'displays the forms in the navigation bar(s) dropdown' do
      within '.nav-top' do
        expect(page).to have_select('Save & Jump To:', with_options: form_titles)
      end
      within '.nav-bottom' do
        expect(page).to have_select('Save & Jump To:', with_options: form_titles)
      end
    end

    it 'displays the buttons in navigation bar(s)' do
      within '.nav-top' do
        expect(page).to have_button('Previous')
        expect(page).to have_button('Next')
        expect(page).to have_button('Save')
        expect(page).to have_button('Done')
      end
      within '.nav-bottom' do
        expect(page).to have_button('Previous')
        expect(page).to have_button('Next')
        expect(page).to have_button('Save')
        expect(page).to have_button('Done')
      end
    end
  end
end
