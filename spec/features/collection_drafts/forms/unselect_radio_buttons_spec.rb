require 'rails_helper'

describe 'Unselecting radio buttons', js: true do
  before do
    login
    draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first)
    visit collection_draft_path(draft)
  end

  context 'when viewing the Spatial Information form' do
    before do
      within '.metadata' do
        click_on 'Spatial Information', match: :first
      end

      open_accordions
    end

    context 'when clearing the Spatial Extent Coordinate System' do
      before do
        within '.geometry' do
          first('.clear-radio-button').click
        end
      end

      it 'clears the radio buttons' do
        within '.geometry' do
          expect(page).to have_no_checked_field('Cartesian')
          expect(page).to have_no_checked_field('Geodetic')
        end
      end
    end

    context 'when clearing the Spatial Extent Geometry Type' do
      before do
        within '.geometry' do
          all('.clear-radio-button').last.click
        end
      end

      it 'clears the radio buttons' do
        within '.geometry' do
          expect(page).to have_no_checked_field('Points')
          expect(page).to have_no_checked_field('Bounding Rectangles')
          expect(page).to have_no_checked_field('G Polygons')
          expect(page).to have_no_checked_field('Lines')
        end
      end

      it 'hides the form fields' do
        expect(page).to have_css('.points-fields', visible: false)
        expect(page).to have_css('.bounding-rectangles-fields', visible: false)
        expect(page).to have_css('.g-polygons-fields', visible: false)
        expect(page).to have_css('.lines-fields', visible: false)
      end

      it 'clears the form fields' do
        script = "$('.bounding-rectangles-fields').find('input').val()"
        result = page.evaluate_script(script)

        expect(result).to eq('')
      end

      context 'when selecting a geometry radio button' do
        before do
          choose 'Points'
        end

        it 'displays the form fields' do
          expect(page).to have_field('Longitude')
        end
      end
    end

    context 'when clearing the Spatial Representation Information Spatial Coverage Type' do
      before do
        within '.spatial-information' do
          click_on 'Clear'
        end
      end

      it 'clears the radio buttons' do
        within '.spatial-information' do
          expect(page).to have_no_checked_field('Horizontal')
          expect(page).to have_no_checked_field('Vertical')
          expect(page).to have_no_checked_field('Both')
        end
      end

      it 'hides the form fields' do
        expect(page).to have_css('.spatial-coverage-type.horizontal', visible: false)
        expect(page).to have_css('.spatial-coverage-type.vertical', visible: false)
      end

      it 'clears the form fields' do
        script = "$('.spatial-information .spatial-coverage-type').find('input').val()"
        result = page.evaluate_script(script)

        expect(result).to eq('')
      end
    end
  end
end
