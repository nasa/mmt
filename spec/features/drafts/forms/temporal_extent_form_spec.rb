# MMT-289

require 'rails_helper'

describe 'Temporal extent form', js: true do
  before do
    login
    draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
    visit draft_path(draft)
  end

  context 'when submitting the form' do
    before do
      within '.metadata' do
        click_on 'Temporal Extent'
      end

      open_accordions
      # Complete TemporalExtent fields
      within '.multiple.temporal-extents' do
        choose 'draft_temporal_extents_0_temporal_range_type_SingleDateTime'
        fill_in 'Precision Of Seconds', with: '1'
        choose 'draft_temporal_extents_0_ends_at_present_flag_false'
        within '.multiple.single-date-times' do
          within '.multiple-item-0' do
            find('.single-date-time').set '2015-07-01T00:00:00Z'
            click_on 'Add Another Date'
          end
          within '.multiple-item-1' do
            find('.single-date-time').set '2015-08-01T00:00:00Z'
          end
        end

        # Add another TemporalExtent
        click_on 'Add another Temporal Extent'

        within '.multiple-item-1' do
          choose 'draft_temporal_extents_1_temporal_range_type_RangeDateTime'
          fill_in 'Precision Of Seconds', with: '10'
          choose 'draft_temporal_extents_1_ends_at_present_flag_false'
          fill_in 'Beginning Date Time', with: '2015-07-01T00:00:00Z'
          fill_in 'Ending Date Time', with: '2015-08-01T00:00:00Z'
        end

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
      within '.multiple.temporal-keywords' do
        within '.multiple-item-0' do
          find('.temporal-keyword').set 'Keyword 1'
          click_on 'Add Another Keyword'
        end
        within '.multiple-item-1' do
          find('.temporal-keyword').set 'Keyword 2'
        end
      end

      # Complete PaleoTemporalCoverage fields
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
        fill_in 'Start Date', with: '2015-07-01T00:00:00Z'
        fill_in 'End Date', with: '2015-08-01T00:00:00Z'
      end

      within '.nav-top' do
        click_on 'Save & Done'
      end
      # output_schema_validation Draft.first.draft
      open_accordions
    end

    it 'shows the draft preview page' do
      expect(page).to have_content('<Untitled Collection Record> DRAFT RECORD')
    end

    it 'shows pre-entered values in the draft preview page' do
      # Complete TemporalExtent fields
      expect(page).to have_content('SingleDateTime')
      expect(page).to have_content('1')
      expect(page).to have_content('2015-07-01T00:00:00Z')
      expect(page).to have_content('2015-08-01T00:00:00Z')

      # Add another TemporalExtent
      expect(page).to have_content('RangeDateTime')
      expect(page).to have_content('10')
      expect(page).to have_content('false')
      expect(page).to have_content('2015-07-01T00:00:00Z')
      expect(page).to have_content('2015-08-01T00:00:00Z')

      # Add another TemporalExtent
      expect(page).to have_content('PeriodicDateTime')
      expect(page).to have_content('30')
      expect(page).to have_content('false')
      expect(page).to have_content('Periodic Extent')
      expect(page).to have_content('2015-07-01T00:00:00Z')
      expect(page).to have_content('2015-08-01T00:00:00Z')
      expect(page).to have_content('Duration Unit')
      expect(page).to have_content('Period Cycle Duration Unit')
      expect(page).to have_content('1')

      # Complete TemporalKeyword fields
      expect(page).to have_content('Keyword 1')
      expect(page).to have_content('Keyword 2')

      # Complete PaleoTemporalCoverage fields
      expect(page).to have_content('Eon text')
      expect(page).to have_content('Era text')
      expect(page).to have_content('Epoch text')
      expect(page).to have_content('Stage text')
      expect(page).to have_content('Detailed Classification text')
      expect(page).to have_content('Period text')

      expect(page).to have_content('Eon text 1')
      expect(page).to have_content('Era text 1')
      expect(page).to have_content('Epoch text 1')
      expect(page).to have_content('Stage text 1')
      expect(page).to have_content('Detailed Classification text 1')
      expect(page).to have_content('Period text 1')

      expect(page).to have_content('2015-07-01T00:00:00Z')
      expect(page).to have_content('2015-08-01T00:00:00Z')

      # Also check side bar
      # Note that handling blank temporal extents is tested in other form tests that don't populate temporal extents
      expect(page).to have_content('Date: 2015-07-01T00:00:00Z')
      expect(page).to have_content('Start Date: 2015-07-01T00:00:00Z')
      expect(page).to have_content('Stop Date: 2015-08-01T00:00:00Z')
      expect(page).to have_content('Start Date: 2015-09-01T00:00:00Z')
      expect(page).to have_content('Stop Date: 2015-10-01T00:00:00Z')

      expect(page).to_not have_content('No Temporal Coverages found')
      expect(page).to have_content('No Spatial Coordinates found')
    end

    context 'when returning to the form' do
      before do
        within '.metadata' do
          click_on 'Temporal Extent'
        end

        open_accordions
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
            expect(page).to have_field('Beginning Date Time', with: '2015-07-01T00:00:00Z')
            expect(page).to have_field('Ending Date Time', with: '2015-08-01T00:00:00Z')
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
        within '.multiple.temporal-keywords' do
          expect(page).to have_selector('input.temporal-keyword[value="Keyword 1"]')
          expect(page).to have_selector('input.temporal-keyword[value="Keyword 2"]')
        end

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
          expect(page).to have_field('Start Date', with: '2015-07-01T00:00:00Z')
          expect(page).to have_field('End Date', with: '2015-08-01T00:00:00Z')
        end
      end
    end
  end
end
