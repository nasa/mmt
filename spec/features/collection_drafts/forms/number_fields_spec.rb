describe 'Number fields', js: true do
  before do
    login
    draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
    visit collection_draft_path(draft)
  end

  context 'when entering letters into a number field' do
    before do
      within '.metadata' do
        click_on 'Spatial Information', match: :first
      end

      open_accordions

      select 'Horizontal', from: 'Spatial Coverage Type'
      within '.geometry' do
        choose 'draft_spatial_extent_horizontal_spatial_domain_geometry_coordinate_system_CARTESIAN'
        script = '$(".geometry-picker.bounding-rectangles").click();'
        page.execute_script script

        within first('.multiple.bounding-rectangles') do
          fill_in 'West', with: 'abcd'
          fill_in 'North', with: '1a'
          fill_in 'East', with: '15'
          fill_in 'South', with: '30.0'
        end
      end
      select 'Cartesian', from: 'Granule Spatial Representation'

      within '.nav-top' do
        click_on 'Done'
      end

      click_on 'Yes'
    end

    it 'saves the original string into the database' do
      draft_metadata = {"MetadataSpecification"=>{"URL"=>"https://cdn.earthdata.nasa.gov/umm/collection/v1.17.3", "Name"=>"UMM-C", "Version"=>"1.17.3"}, "SpatialExtent"=>{"SpatialCoverageType"=>"HORIZONTAL", "HorizontalSpatialDomain"=>{"Geometry"=>{"CoordinateSystem"=>"CARTESIAN", "BoundingRectangles"=>[{"NorthBoundingCoordinate"=>"1a", "WestBoundingCoordinate"=>"abcd", "EastBoundingCoordinate"=>15.0, "SouthBoundingCoordinate"=>30.0}]}}, "GranuleSpatialRepresentation"=>"CARTESIAN"}}
      # using a Capybara find method that waits to locate an element, to prevent an intermittent failure
      find('#spatial-information a[title="Spatial Extent - Invalid"]')
      expect(Draft.last.draft).to eq(draft_metadata)
    end

    it 'displays a validation error on the preview page' do
      within '#spatial-information a[title="Spatial Extent - Invalid"]' do
        expect(page).to have_css('.eui-fa-minus-circle.icon-red')
      end
    end

    context 'when viewing the form' do
      before do
        within '.metadata' do
          click_on 'Spatial Information', match: :first
        end

        open_accordions
      end

      it 'displays the original value in the number field' do
        expect(page).to have_field('West', with: 'abcd')
        expect(page).to have_field('North', with: '1a')
        expect(page).to have_field('East', with: '15.0')
        expect(page).to have_field('South', with: '30.0')
      end
    end
  end

  context 'when entering letters into an integer field' do
    before do
      within '.metadata' do
        click_on 'Temporal Information'
      end

      open_accordions

      within '.multiple.temporal-extents' do
        choose 'draft_temporal_extents_0_temporal_range_type_SingleDateTime'
        choose 'draft_temporal_extents_0_ends_at_present_flag_false'
        fill_in 'Precision Of Seconds', with: 'abcd'
        fill_in 'draft_temporal_extents_0_single_date_times_0', with: '2015-07-01T00:00:00Z'
      end

      within '.nav-top' do
        click_on 'Done'
      end

      click_on 'Yes'
    end

    it 'saves the original string into the database' do
      # wait until page loads to test database
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Drafts')
      end

      draft_metadata = {"MetadataSpecification"=>{"URL"=>"https://cdn.earthdata.nasa.gov/umm/collection/v1.17.3", "Name"=>"UMM-C", "Version"=>"1.17.3"}, "TemporalExtents"=>[{"PrecisionOfSeconds"=>"abcd", "EndsAtPresentFlag"=>false, "SingleDateTimes"=>["2015-07-01T00:00:00Z"]}]}

      expect(Draft.last.draft).to eq(draft_metadata)
    end

    it 'displays a validation error on the preview page' do
      within '#temporal-information a[title="Temporal Extents - Invalid"]' do
        expect(page).to have_css('.eui-fa-minus-circle.icon-red')
      end
    end

    context 'when viewing the form' do
      before do
        within '.metadata' do
          click_on 'Temporal Information'
        end

        open_accordions
      end

      it 'displays the original value in the integer field' do
        expect(page).to have_field('Precision Of Seconds', with: 'abcd')
      end
    end
  end
end
