# MMT-290, MMT-297

require 'rails_helper'

describe 'Spatial extent form', js: true do
  before do
    login
    draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
    visit draft_path(draft)
  end

  context 'when submitting the form with horizontal spatial' do
    before do
      click_on 'Spatial Extent'

      # Spatial Extent
      choose 'draft_spatial_extent_spatial_coverage_type_Horizontal'
      fill_in 'Zone Identifier', with: 'Zone ID'
      within '.geometry' do
        choose 'draft_spatial_extent_horizontal_spatial_domain_geometry_coordinate_system_CARTESIAN'
        # TODO Fields for TODOMultiChoice

      end
      select 'Cartesian', from: 'Granule Spatial Representation'

      # Tiling Identification System
      fill_in 'Tiling Identification System Name', with: 'System name'
      within first('.tiling-coordinate') do
        fill_in 'Minimum Value', with: '-50'
        fill_in 'Maximum Value', with: '50'
      end
      within all('.tiling-coordinate').last do
        fill_in 'Minimum Value', with: '-30'
        fill_in 'Maximum Value', with: '30'
      end

      # Spatial Representation Information
      choose 'draft_spatial_information_spatial_coverage_type_Horizontal'
      fill_in 'Horizontal Datum Name', with: 'Datum name'
      fill_in 'Ellipsoid Name', with: 'Ellipsoid name'
      fill_in 'Semi Major Axis', with: '3'
      fill_in 'Denominator Of Flattening Ratio', with: '4'
      # TODO Fields for TODOMultiChoice


      # Spatial Keywords

      within '.nav-top' do
        click_on 'Save & Done'
      end
      # output_schema_validation Draft.first.draft
      open_accordions
    end

    it 'shows the draft preview page' do
      expect(page).to have_content('<Untitled Collection Record> DRAFT RECORD')
    end

    it "shows pre-entered values in the draft preview page"

    context 'when returning to the form' do
      before do
        click_on 'Spatial Extent'

        open_accordions
      end

      it 'populates the form with the values' do
        # Spatial Extent
        within '.spatial-extent' do
          expect(page).to have_checked_field('Horizontal')
          expect(page).to have_no_checked_field('Vertical')
          expect(page).to have_no_checked_field('Orbit')
          expect(page).to have_field('Zone Identifier', with: 'Zone ID')
          within '.geometry' do
            expect(page).to have_checked_field('Cartesian')
            expect(page).to have_no_checked_field('Geodetic')
            # TODO Fields for TODOMultiChoice
          end
          expect(page).to have_field('Granule Spatial Representation', with: 'CARTESIAN')
        end

        # Tiling Identification System
        expect(page).to have_field('Tiling Identification System Name', with: 'System name')
        within first('.tiling-coordinate') do
          expect(page).to have_field('Minimum Value', with: '-50')
          expect(page).to have_field('Maximum Value', with: '50')
        end
        within all('.tiling-coordinate').last do
          expect(page).to have_field('Minimum Value', with: '-30')
          expect(page).to have_field('Maximum Value', with: '30')
        end

        # Spatial Representation Information
        expect(page).to have_checked_field('Horizontal')
        expect(page).to have_no_checked_field('Vertical')
        expect(page).to have_no_checked_field('Both')

        expect(page).to have_field('Horizontal Datum Name', with: 'Datum name')
        expect(page).to have_field('Ellipsoid Name', with: 'Ellipsoid name')
        expect(page).to have_field('Semi Major Axis', with: '3')
        expect(page).to have_field('Denominator Of Flattening Ratio', with: '4')
        # TODO Fields for TODOMultiChoice


        # Spatial Keywords

      end

    end
  end

  context 'when submitting the form with vertical spatial' do
    before do
      click_on 'Spatial Extent'

      # Spatial Extent
      choose 'draft_spatial_extent_spatial_coverage_type_Vertical'
      within '.multiple.vertical-spatial-domains' do
        fill_in 'Type', with: 'domain type'
        fill_in 'Value', with: 'domain value'
        click_on 'Add another Vertical Spatial Domain'
        within '.multiple-item-1' do
          fill_in 'Type', with: 'domain type 1'
          fill_in 'Value', with: 'domain value 1'
        end
      end

      # Spatial Representation Information
      choose 'draft_spatial_information_spatial_coverage_type_Vertical'
      within first('.vertical-system-definition') do
        fill_in 'Datum Name', with: 'datum name'
        fill_in 'Distance Units', with: 'miles'
        fill_in 'Encoding Method', with: 'encoding method'
        fill_in 'Resolution', with: '3'
        click_on 'Add another'
        within all('.multiple-item').last do
          fill_in 'Resolution', with: '4'
        end
      end
      within all('.vertical-system-definition').last do
        fill_in 'Datum Name', with: 'datum name 1'
        fill_in 'Distance Units', with: 'miles'
        fill_in 'Encoding Method', with: 'encoding method 1'
        fill_in 'Resolution', with: '5'
        click_on 'Add another'
        within all('.multiple-item').last do
          fill_in 'Resolution', with: '6'
        end
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

    it "shows pre-entered values in the draft preview page"

    context 'when returning to the form' do
      before do
        click_on 'Spatial Extent'

        open_accordions
      end

      it 'populates the form with the values' do
        # Spatial Extent
        within '.spatial-extent' do
          expect(page).to have_no_checked_field('Horizontal')
          expect(page).to have_checked_field('Vertical')
          expect(page).to have_no_checked_field('Orbit')

          within '.multiple.vertical-spatial-domains' do
            expect(page).to have_field('Type', with: 'domain type')
            expect(page).to have_field('Value', with: 'domain value')
            expect(page).to have_field('Type', with: 'domain type 1')
            expect(page).to have_field('Value', with: 'domain value 1')
          end
        end

        # Spatial Representation Information
        expect(page).to have_no_checked_field('Horizontal')
        expect(page).to have_checked_field('Vertical')
        expect(page).to have_no_checked_field('Both')
        within first('.vertical-system-definition') do
          expect(page).to have_field('Datum Name', with: 'datum name')
          expect(page).to have_field('Distance Units', with: 'miles')
          expect(page).to have_field('Encoding Method', with: 'encoding method')
          expect(page).to have_field('Resolution', with: '3')
          expect(page).to have_field('Resolution', with: '4')
        end
        within all('.vertical-system-definition').last do
          expect(page).to have_field('Datum Name', with: 'datum name 1')
          expect(page).to have_field('Distance Units', with: 'miles')
          expect(page).to have_field('Encoding Method', with: 'encoding method 1')
          expect(page).to have_field('Resolution', with: '5')
          expect(page).to have_field('Resolution', with: '6')
        end

      end

    end
  end

  context 'when submitting the form with orbital spatial' do
    before do
      click_on 'Spatial Extent'

      # Spatial Extent
      choose 'draft_spatial_extent_spatial_coverage_type_Orbit'
      fill_in 'Swath Width', with: '1'
      fill_in 'Period', with: '2'
      fill_in 'Inclination Angle', with: '3'
      fill_in 'Number Of Orbits', with: '4'
      fill_in 'Start Circular Latitude', with: '5'

      # Spatial Representation Information
      choose 'draft_spatial_information_spatial_coverage_type_Both'
      fill_in 'Horizontal Datum Name', with: 'Datum name'
      fill_in 'Ellipsoid Name', with: 'Ellipsoid name'
      fill_in 'Semi Major Axis', with: '3'
      fill_in 'Denominator Of Flattening Ratio', with: '4'
      # TODO Fields for TODOMultiChoice
      within first('.vertical-system-definition') do
        fill_in 'Datum Name', with: 'datum name'
        fill_in 'Distance Units', with: 'miles'
        fill_in 'Encoding Method', with: 'encoding method'
        fill_in 'Resolution', with: '3'
        click_on 'Add another'
        within all('.multiple-item').last do
          fill_in 'Resolution', with: '4'
        end
      end
      within all('.vertical-system-definition').last do
        fill_in 'Datum Name', with: 'datum name 1'
        fill_in 'Distance Units', with: 'miles'
        fill_in 'Encoding Method', with: 'encoding method 1'
        fill_in 'Resolution', with: '5'
        click_on 'Add another'
        within all('.multiple-item').last do
          fill_in 'Resolution', with: '6'
        end
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

    it "shows pre-entered values in the draft preview page"

    context 'when returning to the form' do
      before do
        click_on 'Spatial Extent'

        open_accordions
      end

      it 'populates the form with the values' do
        # Spatial Extent
        within '.spatial-extent' do
          expect(page).to have_no_checked_field('Horizontal')
          expect(page).to have_no_checked_field('Vertical')
          expect(page).to have_checked_field('Orbit')
          expect(page).to have_field('Swath Width', with: '1')
          expect(page).to have_field('Period', with: '2')
          expect(page).to have_field('Inclination Angle', with: '3')
          expect(page).to have_field('Number Of Orbits', with: '4')
          expect(page).to have_field('Start Circular Latitude', with: '5')
        end

        # Spatial Representation Information
        expect(page).to have_no_checked_field('Horizontal')
        expect(page).to have_no_checked_field('Vertical')
        expect(page).to have_checked_field('Both')
        expect(page).to have_field('Horizontal Datum Name', with: 'Datum name')
        expect(page).to have_field('Ellipsoid Name', with: 'Ellipsoid name')
        expect(page).to have_field('Semi Major Axis', with: '3')
        expect(page).to have_field('Denominator Of Flattening Ratio', with: '4')
        # TODO Fields for TODOMultiChoice

        within first('.vertical-system-definition') do
          expect(page).to have_field('Datum Name', with: 'datum name')
          expect(page).to have_field('Distance Units', with: 'miles')
          expect(page).to have_field('Encoding Method', with: 'encoding method')
          expect(page).to have_field('Resolution', with: '3')
          expect(page).to have_field('Resolution', with: '4')
        end
        within all('.vertical-system-definition').last do
          expect(page).to have_field('Datum Name', with: 'datum name 1')
          expect(page).to have_field('Distance Units', with: 'miles')
          expect(page).to have_field('Encoding Method', with: 'encoding method 1')
          expect(page).to have_field('Resolution', with: '5')
          expect(page).to have_field('Resolution', with: '6')
        end

      end

    end
  end

end
