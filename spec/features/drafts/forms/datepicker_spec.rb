# MMT-315

require 'rails_helper'

describe 'Datepicker', js: true do
  before do
    login
    draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
    visit draft_path(draft)

    within '.metadata' do
      click_on 'Metadata Information'
    end

    open_accordions
  end

  context 'when using the datepicker to pick a date value' do
    before do
      find('#draft_metadata_dates_0_date').click
      find('span.year', text: '2015').click
      find('span.month', text: 'Oct').click
      find('td.day', text: '31').click
    end

    it 'displays a valid datetime with a time of 00:00:00' do
      expect(page).to have_field('draft_metadata_dates_0_date', with: '2015-10-31T00:00:00.000Z')
    end

    context 'when editing the time' do
      before do
        fill_in 'draft_metadata_dates_0_date', with: '2015-11-01T12:34:56.000Z'
      end

      it 'the datepicker does not modify the value' do
        expect(page).to have_field('draft_metadata_dates_0_date', with: '2015-11-01T12:34:56.000Z')
      end
    end
  end
end
