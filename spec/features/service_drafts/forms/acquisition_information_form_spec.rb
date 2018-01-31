require 'rails_helper'

describe 'Acquisition Information Form', reset_provider: true, js: true do
  before do
    login
    draft = create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first)
    visit edit_service_draft_path(draft, 'acquisition_information')
  end

  context 'when submitting the form' do
    before do
      fill_in 'service_draft_draft_platforms_0_short_name', with: 'Platform 1 Short Name'
      fill_in 'service_draft_draft_platforms_0_long_name', with: 'Platform 1 Long Name'
      fill_in 'service_draft_draft_platforms_0_instruments_0_short_name', with: 'Instrument 1 Short Name'
      fill_in 'service_draft_draft_platforms_0_instruments_0_long_name', with: 'Instrument 1 Long Name'

      click_on 'Add another Instrument'
      fill_in 'service_draft_draft_platforms_0_instruments_1_short_name', with: 'Instrument 2 Short Name'
      fill_in 'service_draft_draft_platforms_0_instruments_1_long_name', with: 'Instrument 2 Long Name'

      click_on 'Add another Platform'
      fill_in 'service_draft_draft_platforms_1_short_name', with: 'Platform 2 Short Name'
      fill_in 'service_draft_draft_platforms_1_long_name', with: 'Platform 2 Long Name'
      fill_in 'service_draft_draft_platforms_1_instruments_0_short_name', with: 'Instrument 3 Short Name'

      within '.nav-top' do
        click_on 'Save'
      end
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Service Draft Updated Successfully!')
    end

    it 'populates the form with the values' do
      expect(page).to have_field('service_draft_draft_platforms_0_short_name', with: 'Platform 1 Short Name')
      expect(page).to have_field('service_draft_draft_platforms_0_long_name', with: 'Platform 1 Long Name')
      expect(page).to have_field('service_draft_draft_platforms_0_instruments_0_short_name', with: 'Instrument 1 Short Name')
      expect(page).to have_field('service_draft_draft_platforms_0_instruments_0_long_name', with: 'Instrument 1 Long Name')
      expect(page).to have_field('service_draft_draft_platforms_0_instruments_1_short_name', with: 'Instrument 2 Short Name')
      expect(page).to have_field('service_draft_draft_platforms_0_instruments_1_long_name', with: 'Instrument 2 Long Name')

      expect(page).to have_field('service_draft_draft_platforms_1_short_name', with: 'Platform 2 Short Name')
      expect(page).to have_field('service_draft_draft_platforms_1_long_name', with: 'Platform 2 Long Name')
      expect(page).to have_field('service_draft_draft_platforms_1_instruments_0_short_name', with: 'Instrument 3 Short Name')
    end
  end
end
