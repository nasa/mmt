# Radio buttons are used when oneOf validations are used in the schema.
# Radio buttons are used to select which form should be shown - by default, none
# of the sub-forms should be shown

describe 'Radio button form selectors', js: true do
  before do
    login
    draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
    visit collection_draft_path(draft)
  end

  context 'when viewing spatial coverage type fields' do
    before do
      within '.metadata' do
        click_on 'Spatial Information', match: :first
      end

      expect(page).to have_content('Spatial Information')

      open_accordions
    end

    it 'does not show any spatial coverage fields' do
      expect(page).to have_no_css('.spatial-coverage-type.vertical')
    end

    context 'when selecting vertical spatial coverage' do
      before do
        within '#spatial-representation-information' do
          choose 'Vertical'
        end
      end

      it 'displays the vertical coordinate system fields' do
        expect(page).to have_css('.spatial-coverage-type.vertical')
      end
    end

    context 'when clearing options after filling in form data' do
      before do
        within '#spatial-representation-information' do
          choose 'Vertical'
          within '.altitude-system-definition' do
            fill_in 'Datum Name', with: 'sample name'
            select 'Millibars', from: 'Distance Units'
          end

          click_on 'Clear'
          choose 'Vertical'
        end
      end

      it 'clears the form data' do
        expect(page).to have_field('Datum Name', with: '')
        expect(page).to have_field('Distance Units', with: '')
      end
    end
  end

  context 'when viewing coordinate system type fields' do
    before do
      within '.metadata' do
        click_on 'Spatial Information', match: :first
      end

      expect(page).to have_content('Spatial Information')

      open_accordions

      within '#spatial-extent' do
        select 'Horizontal', from: 'Spatial Coverage Type'
      end
    end

    it 'does not show any coordinate system fields' do
      expect(page).to have_no_css('.horizontal-data-resolutions-fields')
      expect(page).to have_no_css('.local-coordinate-system-fields')
    end

    context 'when selecting horizontal data resolutions' do
      before do
        choose 'Horizontal Data Resolution'
      end

      it 'displays the geographic coordinate system fields' do
        expect(page).to have_css('.horizontal-data-resolution-fields')
      end

      it 'does not display the other form fields' do
        expect(page).to have_no_css('.local-coordinate-system-fields')
      end
    end

    context 'when selecting local coordinate system' do
      before do
        choose 'Local'
      end

      it 'displays the local coordinate system fields' do
        expect(page).to have_css('.local-coordinate-system-fields')
      end

      it 'does not display the other form fields' do
        expect(page).to have_no_css('.horizontal-data-resolution-fields')
      end
    end

    context 'when switching between options after filling in form data' do
      before do
        choose 'Horizontal Data Resolution'
        check 'Gridded Resolutions'
        select 'Meters', from: 'Unit'
        fill_in 'X Dimension', with: '42.0'
        fill_in 'Y Dimension', with: '43.0'

        choose 'Local'
        choose 'Horizontal Data Resolution'
      end

      it 'clears the form data' do
        expect(page).to have_no_checked_field('Gridded Resolutions')

        check 'Gridded Resolutions'

        expect(page).to have_field('Unit', with: '')
        expect(page).to have_field('X Dimension', with: '')
        expect(page).to have_field('Y Dimension', with: '')
      end
    end
  end

  context 'when viewing temporal range type fields' do
    before do
      within '.metadata' do
        click_on 'Temporal Information'
      end

      expect(page).to have_content('Temporal Information')

      open_accordions
    end

    it 'does not show any temporal range fields' do
      expect(page).to have_no_css('.temporal-range-type.single-date-time')
      expect(page).to have_no_css('.temporal-range-type.range-date-time')
      expect(page).to have_no_css('.temporal-range-type.periodic-date-time')
    end

    context 'when selecting single date time' do
      before do
        choose 'Single'
      end

      it 'displays the single date time fields' do
        expect(page).to have_css('.temporal-range-type.single-date-time')
      end

      it 'does not display the other form fields' do
        expect(page).to have_no_css('.temporal-range-type.range-date-time')
        expect(page).to have_no_css('.temporal-range-type.periodic-date-time')
      end
    end

    context 'when selecting range date time' do
      before do
        choose 'Range'
      end

      it 'displays the range date time fields' do
        expect(page).to have_css('.temporal-range-type.range-date-time')
      end

      it 'does not display the other form fields' do
        expect(page).to have_no_css('.temporal-range-type.single-date-time')
        expect(page).to have_no_css('.temporal-range-type.periodic-date-time')
      end
    end

    context 'when selecting periodic date time' do
      before do
        choose 'Periodic'
      end

      it 'displays the periodic date time fields' do
        expect(page).to have_css('.temporal-range-type.periodic-date-time')
      end

      it 'does not display the other form fields' do
        expect(page).to have_no_css('.temporal-range-type.single-date-time')
        expect(page).to have_no_css('.temporal-range-type.range-date-time')
      end
    end

    context 'when switching between options after filling in form data' do
      before do
        choose 'Single'

        find('#draft_temporal_extents_0_single_date_times_0').click
        # click Today to close datepicker
        find('th.today').click

        choose 'Range'
        choose 'Single'
      end

      it 'clears the form data' do
        expect(page).to have_field('draft_temporal_extents_0_single_date_times_0', with: '')
      end
    end
  end
end
