require 'rails_helper'
require 'features/service_drafts/lib/forms/acquisition_information_form_spec'

describe 'Acquisition Information Form', js: true do
  before do
    login
    draft = create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first)
    visit edit_service_draft_path(draft, 'acquisition_information')
  end

  context 'when submitting the form' do
    before do
      within '.multiple.platforms' do
        all('.select2-container .select2-selection').first.click
        find(:xpath, '//body').find('.select2-dropdown ul.select2-results__options--nested li.select2-results__option', text: 'A340-600').click

        within '.multiple.instruments' do
          all('.select2-container .select2-selection').first.click
          find(:xpath, '//body').find('.select2-dropdown li.select2-results__option', text: 'ATM').click

          click_on 'Add another Instrument'
          within '.multiple-item-1' do
            all('.select2-container .select2-selection').first.click
            find(:xpath, '//body').find('.select2-dropdown li.select2-results__option', text: 'LVIS').click
          end
        end

        click_on 'Add another Platform'
        within '.multiple-item-1' do
          all('.select2-container .select2-selection').first.click
          find(:xpath, '//body').find('.select2-dropdown ul.select2-results__options--nested li.select2-results__option', text: 'DMSP 5B/F3').click

          within '.multiple.instruments' do
            all('.select2-container .select2-selection').first.click
            find(:xpath, '//body').find('.select2-dropdown li.select2-results__option', text: 'ACOUSTIC SOUNDERS').click
          end
        end
      end

      within '.nav-top' do
        click_on 'Save'
      end
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Service Draft Updated Successfully!')
    end

    context 'when viewing the form' do
      include_examples 'Acquisition Information Form'
    end
  end
end
