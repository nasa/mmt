# MMT-289

require 'rails_helper'

describe 'Temporal information form', js: true do
  before do
    login
    draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
    visit collection_draft_path(draft)
  end

  context 'when checking the accordion headers for required icons' do
    before do
      within '.metadata' do
        click_on 'Temporal Information'
      end
    end
    
    it 'displays required icons on the Temporal Extents accordion' do
      expect(page).to have_css('h3.eui-required-o.always-required', count: 1)
      expect(page).to have_css('h3.eui-required-o.always-required', text: 'Temporal Extents')
    end
  end

  context 'when submitting the form' do
    before do
      within '.metadata' do
        click_on 'Temporal Information'
      end

      click_on 'Expand All'

      # Complete TemporalExtent fields
      within '.multiple.temporal-extents' do
        choose 'draft_temporal_extents_0_temporal_range_type_SingleDateTime'
        fill_in 'Precision Of Seconds', with: '1'
        choose 'draft_temporal_extents_0_ends_at_present_flag_false'
        fill_in 'draft_temporal_extents_0_single_date_times_0', with: '2015-07-01T00:00:00Z'

        # click outside field to close datepicker
        find('#draft_temporal_extents_0_precision_of_seconds').click
        click_on 'Add another Single Date Time'
        fill_in 'draft_temporal_extents_0_single_date_times_1', with: '2015-08-01T00:00:00Z'

        # Add another TemporalExtent
        click_on 'Add another Temporal Extent'

        within '.multiple-item-1' do
          choose 'draft_temporal_extents_1_temporal_range_type_RangeDateTime'
          fill_in 'Precision Of Seconds', with: '10'
          choose 'draft_temporal_extents_1_ends_at_present_flag_false'
          fill_in 'Beginning Date Time', with: '2015-07-02T00:00:00Z'
          fill_in 'Ending Date Time', with: '2015-08-02T00:00:00Z'
        end

        # click outside field to close datepicker
        find('#draft_temporal_extents_1_precision_of_seconds').click

        # Add another TemporalExtent
        click_on 'Add another Temporal Extent'

        within '.multiple-item-2' do
          choose 'draft_temporal_extents_2_temporal_range_type_PeriodicDateTime'
          fill_in 'Precision Of Seconds', with: '30'
          choose 'draft_temporal_extents_2_ends_at_present_flag_false'
          fill_in 'Name', with: 'Periodic Extent'
          fill_in 'Start Date', with: '2015-09-01T00:00:00Z'
          fill_in 'End Date', with: '2015-10-01T00:00:00Z'
          select 'Day', from: 'Duration Unit'
          fill_in 'Duration Value', with: '5'
          select 'Month', from: 'Period Cycle Duration Unit'
          fill_in 'Period Cycle Duration Value', with: '1'
        end
      end

      # Complete TemporalKeyword fields
      select('Annual Climatology', from: 'Temporal Keywords')
      select('Annual', from: 'Temporal Keywords')

      # Complete PaleoTemporalCoverages fields
      within '.paleo-temporal-coverage-fields' do
        within '.multiple.chronostratigraphic-units' do
          fill_in 'Eon', with: 'Eon text'
          fill_in 'Era', with: 'Era text'
          fill_in 'Epoch', with: 'Epoch text'
          fill_in 'Stage', with: 'Stage text'
          fill_in 'Detailed Classification', with: 'Detailed Classification text'
          fill_in 'Period', with: 'Period text'
          click_on 'Add another Chronostratigraphic Unit'
          within '.multiple-item-1' do
            fill_in 'Eon', with: 'Eon text 1'
            fill_in 'Era', with: 'Era text 1'
            fill_in 'Epoch', with: 'Epoch text 1'
            fill_in 'Stage', with: 'Stage text 1'
            fill_in 'Detailed Classification', with: 'Detailed Classification text 1'
            fill_in 'Period', with: 'Period text 1'
          end
        end
        fill_in 'Paleo Start Date', with: '2015-05-01T00:00:00Z'
        fill_in 'Paleo Stop Date', with: '2015-06-01T00:00:00Z'
      end

      within '.nav-top' do
        click_on 'Save'
      end
      # output_schema_validation Draft.first.draft
      click_on 'Expand All'
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Collection Draft Updated Successfully!')
    end

    it 'populates the form with the values' do
      # TemporalExtent fields
      within '.multiple.temporal-extents' do
        within all('.multiple-item-0').first do
          expect(page).to have_checked_field('Single')
          expect(page).to have_no_checked_field('Range')
          expect(page).to have_no_checked_field('Periodic')
          expect(page).to have_field('Precision Of Seconds', with: '1')
          expect(page).to have_no_checked_field('True')
          expect(page).to have_checked_field('False')
          within '.multiple.single-date-times' do
            expect(page).to have_selector('input.single-date-time[value="2015-07-01T00:00:00Z"]')
            expect(page).to have_selector('input.single-date-time[value="2015-08-01T00:00:00Z"]')
          end
        end

        within all('.multiple-item-1')[1] do
          expect(page).to have_no_checked_field('Single')
          expect(page).to have_checked_field('Range')
          expect(page).to have_no_checked_field('Periodic')
          expect(page).to have_field('Precision Of Seconds', with: '10')
          expect(page).to have_no_checked_field('True')
          expect(page).to have_checked_field('False')
          expect(page).to have_field('Beginning Date Time', with: '2015-07-02T00:00:00Z')
          expect(page).to have_field('Ending Date Time', with: '2015-08-02T00:00:00Z')
        end

        within '.multiple-item-2' do
          expect(page).to have_no_checked_field('Single')
          expect(page).to have_no_checked_field('Range')
          expect(page).to have_checked_field('Periodic')
          expect(page).to have_field('Precision Of Seconds', with: '30')
          expect(page).to have_no_checked_field('True')
          expect(page).to have_checked_field('False')
          expect(page).to have_field('Name', with: 'Periodic Extent')
          expect(page).to have_field('Start Date', with: '2015-09-01T00:00:00Z')
          expect(page).to have_field('End Date', with: '2015-10-01T00:00:00Z')
          expect(page).to have_field('Duration Unit', with: 'DAY')
          expect(page).to have_field('Duration Value', with: '5')
          expect(page).to have_field('Period Cycle Duration Unit', with: 'MONTH')
          expect(page).to have_field('Period Cycle Duration Value', with: '1')
        end
      end

      # Complete TemporalKeyword fields
      expect(page).to have_select('Temporal Keywords', selected: ['Annual Climatology', 'Annual'])

      # Complete PaleoTemporalCoverage fields
      within '.paleo-temporal-coverage-fields' do
        within '.multiple.chronostratigraphic-units' do
          within '.multiple-item-0' do
            expect(page).to have_field('Eon', with: 'Eon text')
            expect(page).to have_field('Era', with: 'Era text')
            expect(page).to have_field('Epoch', with: 'Epoch text')
            expect(page).to have_field('Stage', with: 'Stage text')
            expect(page).to have_field('Detailed Classification', with: 'Detailed Classification text')
            expect(page).to have_field('Period', with: 'Period text')
          end
          within '.multiple-item-1' do
            expect(page).to have_field('Eon', with: 'Eon text 1')
            expect(page).to have_field('Era', with: 'Era text 1')
            expect(page).to have_field('Epoch', with: 'Epoch text 1')
            expect(page).to have_field('Stage', with: 'Stage text 1')
            expect(page).to have_field('Detailed Classification', with: 'Detailed Classification text 1')
            expect(page).to have_field('Period', with: 'Period text 1')
          end
        end
        expect(page).to have_field('Paleo Start Date', with: '2015-05-01T00:00:00Z')
        expect(page).to have_field('Paleo Stop Date', with: '2015-06-01T00:00:00Z')
      end
    end
  end
end
