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
      click_on 'Temporal Extent'

      # Complete TemporalExtent fields
      within '.multiple.temporal-extent' do
        select 'Single', from: 'Temporal Range Type'
        fill_in 'Precision Of Seconds', with: '1'
        select 'False', from: 'Ends At Present Flag'
        fill_in 'Single Date Time', with: '2015-07-01'

        # Add another TemporalExtent
        click_on 'Add another Temporal Extent'

        within '.multiple-item-1' do
          select 'Range', from: 'Temporal Range Type'
          fill_in 'Precision Of Seconds', with: '10'
          select 'False', from: 'Ends At Present Flag'
          fill_in 'Beginning Date Time', with: '2015-07-01'
          fill_in 'Ending Date Time', with: '2015-08-01'
        end

        # Add another TemporalExtent
        click_on 'Add another Temporal Extent'

        within '.multiple-item-2' do
          select 'Periodic', from: 'Temporal Range Type'
          fill_in 'Precision Of Seconds', with: '30'
          select 'False', from: 'Ends At Present Flag'
          fill_in 'Name', with: 'Periodic Extent'
          fill_in 'Start Date', with: '2015-07-01'
          fill_in 'End Date', with: '2015-08-01'
          select 'Day', from: 'Duration Unit'
          fill_in 'Duration Value', with: '5'
          select 'Month', from: 'Period Cycle Duration Unit'
          fill_in 'Period Cycle Duration Value', with: '1'
        end
      end

      # Complete TemporalKeyword fields
      within '.multiple.temporal-keyword' do
        fill_in 'Temporal Keyword', with: 'Keyword 1'
        click_on 'Add another'
        within all('.multiple-item').last do
          fill_in 'Temporal Keyword', with: 'Keyword 2'
        end
      end

      # Complete PaleoTemporalCoverage fields
      within '.paleo-temporal-coverage-fields' do
        within '.multiple.chronostratigraphic-unit' do
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
        fill_in 'Start Date', with: '2015-07-01'
        fill_in 'End Date', with: '2015-08-01'
      end

      within '.nav-top' do
        click_on 'Save & Done'
      end
    end

    it 'shows the draft preview page' do
      expect(page).to have_content('<Untitled Collection Record> DRAFT RECORD')
    end

    # TODO MMT-296
    it 'shows the values in the draft preview page'

    context 'when returning to the form' do
      before do
        click_on 'Temporal Extent'

        # Expand first two TemporalExtent items
        within '.multiple.temporal-extent' do
          within all('.multiple-item-0').first do
            find('.accordion-header').click
          end
          within '.multiple-item-1' do
            find('.accordion-header').click
          end
        end

        # Expand first ChronostratigraphicUnit item
        within '.multiple.chronostratigraphic-unit' do
          within '.multiple-item-0' do
            find('.accordion-header').click
          end
        end
      end

      it 'populates the form with the values' do
        # TemporalExtent fields
        within '.multiple.temporal-extent' do
          within all('.multiple-item-0').first do
            expect(page).to have_field('Temporal Range Type', with: 'SingleDateTime')
            expect(page).to have_field('Precision Of Seconds', with: '1')
            expect(page).to have_field('Ends At Present Flag', with: 'false')
            expect(page).to have_field('Single Date Time', with: '2015-07-01')
          end

          within '.multiple-item-1' do
            expect(page).to have_field('Temporal Range Type', with: 'RangeDateTime')
            expect(page).to have_field('Precision Of Seconds', with: '10')
            expect(page).to have_field('Ends At Present Flag', with: 'false')
            expect(page).to have_field('Beginning Date Time', with: '2015-07-01')
            expect(page).to have_field('Ending Date Time', with: '2015-08-01')
          end

          within '.multiple-item-2' do
            expect(page).to have_field('Temporal Range Type', with: 'PeriodicDateTime')
            expect(page).to have_field('Precision Of Seconds', with: '30')
            expect(page).to have_field('Ends At Present Flag', with: 'false')
            expect(page).to have_field('Name', with: 'Periodic Extent')
            expect(page).to have_field('Start Date', with: '2015-07-01')
            expect(page).to have_field('End Date', with: '2015-08-01')
            expect(page).to have_field('Duration Unit', with: 'DAY')
            expect(page).to have_field('Duration Value', with: '5')
            expect(page).to have_field('Period Cycle Duration Unit', with: 'MONTH')
            expect(page).to have_field('Period Cycle Duration Value', with: '1')
          end
        end

        # Complete TemporalKeyword fields
        within '.multiple.temporal-keyword' do
          expect(page).to have_field('Temporal Keyword', with: 'Keyword 1')
          expect(page).to have_field('Temporal Keyword', with: 'Keyword 2')
        end

        # Complete PaleoTemporalCoverage fields
        within '.paleo-temporal-coverage-fields' do
          within '.multiple.chronostratigraphic-unit' do
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
          expect(page).to have_field('Start Date', with: '2015-07-01')
          expect(page).to have_field('End Date', with: '2015-08-01')
        end
      end

    end
  end
end
