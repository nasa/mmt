# MMT-315

require 'rails_helper'

describe 'Datepicker', js: true do
  before do
    login
    draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
    visit collection_draft_path(draft)

    within '.metadata' do
      click_on 'Metadata Information'
    end

    open_accordions
  end

  context 'when using the datepicker to pick a date value' do
    before do
      find('#draft_metadata_dates_0_date').click
      find('span.year', text: '2029').click
      find('span.month', text: 'Oct').click
      find('td.day', text: '31').click
    end

    it 'displays a valid datetime with a time of 00:00:00' do
      expect(page).to have_field('draft_metadata_dates_0_date', with: '2029-10-31T00:00:00.000Z')
    end

    context 'when editing the time' do
      before do
        fill_in 'draft_metadata_dates_0_date', with: '2015-11-01T12:34:56.000Z'
      end

      it 'the datepicker does not modify the value' do
        expect(page).to have_field('draft_metadata_dates_0_date', with: '2015-11-01T12:34:56.000Z')
      end
    end

    context 'when choosing part of the date on a required field' do
      before do
        click_on 'Add another Date'

        select 'Future Review', from: 'Type'
        find('#draft_metadata_dates_1_date').click
        find('span.year', text: '2029').click
      end

      it 'does not display a validation error' do
        expect(page).to have_no_content('Date is required')
      end
    end
  end
end
