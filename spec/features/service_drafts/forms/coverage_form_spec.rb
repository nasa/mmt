require 'rails_helper'

describe 'Coverage Form', reset_provider: true, js: true do
  before do
    login
    draft = create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first)
    visit edit_service_draft_path(draft, 'coverage')
  end

  context 'when submitting the form' do
    before do
      fill_in 'Name', with: 'Coverage Name'

      select 'SPATIAL_POINT', from: 'Type'
      fill_in 'service_draft_draft_coverage_coverage_spatial_extent_uuid', with: '13f5e348-ffad-4ef9-9600-12ad74f60f77'
      within '.multiple.spatial-points' do
        fill_in 'Latitude', with: '0'
        fill_in 'Longitude', with: '0'

        click_on 'Add another Spatial Point'
        within '.multiple-item-1' do
          fill_in 'Latitude', with: '50'
          fill_in 'Longitude', with: '50'
        end
      end

      fill_in 'Spatial Resolution', with: '50'
      fill_in 'Spatial Resolution Unit', with: 'KM'

      within '.multiple.coverage-time-points' do
        fill_in 'Time Format', with: 'format 1'
        fill_in 'Time Value', with: 'value 1'
        fill_in 'Description', with: 'description 1'

        click_on 'Add another Coverage Time Point'
        within '.multiple-item-1' do
          fill_in 'Time Format', with: 'format 2'
          fill_in 'Time Value', with: 'value 2'
          fill_in 'Description', with: 'description 2'
        end
      end
      fill_in 'service_draft_draft_coverage_coverage_temporal_extent_uuid', with: '17abd5ea-fd95-4801-a9e4-0ccd2f7acf40'

      fill_in 'Temporal Resolution', with: '7'
      fill_in 'Temporal Resolution Unit', with: 'days'
      fill_in 'Relative Path', with: 'relative path'

      within '.nav-top' do
        click_on 'Save'
      end
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Service Draft Updated Successfully!')
    end

    context 'when viewing the form' do
      include_examples 'Coverage Form with Spatial Points'
    end

    context 'when adding spatial line strings' do
      before do
        select 'SPATIAL_LINE_STRING', from: 'Type'

        within '.multiple.spatial-line-strings' do
          within '.multiple-item-0' do
            within '.start-point' do
              fill_in 'Latitude', with: '0'
              fill_in 'Longitude', with: '0'
            end
            within '.end-point' do
              fill_in 'Latitude', with: '10'
              fill_in 'Longitude', with: '10'
            end
          end
          click_on 'Add another Spatial Line String'
          within '.multiple-item-1' do
            within '.start-point' do
              fill_in 'Latitude', with: '20'
              fill_in 'Longitude', with: '20'
            end
            within '.end-point' do
              fill_in 'Latitude', with: '25'
              fill_in 'Longitude', with: '25'
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
        include_examples 'Coverage Form with Spatial Ling Strings'
      end
    end

    context 'when adding a spatial bounding box' do
      before do
        select 'BOUNDING_BOX', from: 'Type'

        fill_in 'Min X', with: '-5'
        fill_in 'Max X', with: '5'
        fill_in 'Min Y', with: '-10'
        fill_in 'Max Y', with: '10'

        within '.nav-top' do
          click_on 'Save'
        end
      end

      it 'displays a confirmation message' do
        expect(page).to have_content('Service Draft Updated Successfully!')
      end

      context 'when viewing the form' do
        include_examples 'Coverage Form with a Spatial Bounding Box'
      end
    end

    context 'when adding spatial polygons' do
      before do
        select 'SPATIAL_POLYGON', from: 'Type'

        within '.multiple.spatial-polygons' do
          within '.multiple-item-0' do
            fill_in 'Latitude', with: '0'
            fill_in 'Longitude', with: '0'
          end
          click_on 'Add another Point'
          within '.multiple-item-1' do
            fill_in 'Latitude', with: '10'
            fill_in 'Longitude', with: '10'
          end
          click_on 'Add another Point'
          within '.multiple-item-2' do
            fill_in 'Latitude', with: '10'
            fill_in 'Longitude', with: '-10'
          end
          click_on 'Add another Point'
          within '.multiple-item-3' do
            fill_in 'Latitude', with: '-10'
            fill_in 'Longitude', with: '-10'
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
        include_examples 'Coverage Form with Spatial Polygons'
      end
    end
  end
end
