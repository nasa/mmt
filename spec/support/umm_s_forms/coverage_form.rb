require 'rails_helper'

shared_examples_for 'Coverage Form with Spatial Points' do
  it 'displays the form with values' do
    expect(page).to have_field('service_draft_draft_coverage_name', with: 'Coverage Name')

    expect(page).to have_field('Coverage Spatial Extent Type Type', with: 'SPATIAL_POINT')
    expect(page).to have_field('Uuid', with: '13f5e348-ffad-4ef9-9600-12ad74f60f77')
    within '.multiple.spatial-points' do
      within '.multiple-item-0' do
        expect(page).to have_field('Latitude', with: '0.0')
        expect(page).to have_field('Longitude', with: '0.0')
      end
      within '.multiple-item-1' do
        expect(page).to have_field('Latitude', with: '50.0')
        expect(page).to have_field('Longitude', with: '50.0')
      end
    end
    expect(page).to have_field('Spatial Resolution', with: '50')
    expect(page).to have_field('Spatial Resolution Unit', with: 'KM')

    expect(page).to have_field('Coverage Temporal Extent Type Type', with: 'TIME_STAMP')
    expect(page).to have_field('Uuid', with: '17abd5ea-fd95-4801-a9e4-0ccd2f7acf40')
    within '.multiple.coverage-time-points' do
      within '.multiple-item-0' do
        expect(page).to have_field('Time Format', with: 'format 1')
        expect(page).to have_field('Time Value', with: 'value 1')
        expect(page).to have_field('Description', with: 'description 1')
      end
      within '.multiple-item-1' do
        expect(page).to have_field('Time Format', with: 'format 2')
        expect(page).to have_field('Time Value', with: 'value 2')
        expect(page).to have_field('Description', with: 'description 2')
      end
    end

    expect(page).to have_field('Temporal Resolution', with: '7')
    expect(page).to have_field('Temporal Resolution', with: 'days')
    expect(page).to have_field('Relative Path', with: 'relative path')
  end
end

shared_examples_for 'Coverage Form with Spatial Ling Strings' do
  it 'displays the form with values' do
    expect(page).to have_field('service_draft_draft_coverage_name', with: 'Coverage Name')

    expect(page).to have_field('Coverage Spatial Extent Type Type', with: 'SPATIAL_LINE_STRING')
    expect(page).to have_field('Uuid', with: '13f5e348-ffad-4ef9-9600-12ad74f60f77')
    within '.multiple.spatial-line-strings' do
      within '.multiple-item-0' do
        within '.start-point' do
          expect(page).to have_field('Latitude', with: '0.0')
          expect(page).to have_field('Longitude', with: '0.0')
        end
        within '.end-point' do
          expect(page).to have_field('Latitude', with: '10.0')
          expect(page).to have_field('Longitude', with: '10.0')
        end
      end
      within '.multiple-item-1' do
        within '.start-point' do
          expect(page).to have_field('Latitude', with: '20.0')
          expect(page).to have_field('Longitude', with: '20.0')
        end
        within '.end-point' do
          expect(page).to have_field('Latitude', with: '25.0')
          expect(page).to have_field('Longitude', with: '25.0')
        end
      end
    end
    expect(page).to have_field('Spatial Resolution', with: '50')
    expect(page).to have_field('Spatial Resolution Unit', with: 'KM')

    expect(page).to have_field('Coverage Temporal Extent Type Type', with: 'TIME_STAMP')
    expect(page).to have_field('Uuid', with: '17abd5ea-fd95-4801-a9e4-0ccd2f7acf40')
    within '.multiple.coverage-time-points' do
      within '.multiple-item-0' do
        expect(page).to have_field('Time Format', with: 'format 1')
        expect(page).to have_field('Time Value', with: 'value 1')
        expect(page).to have_field('Description', with: 'description 1')
      end
      within '.multiple-item-1' do
        expect(page).to have_field('Time Format', with: 'format 2')
        expect(page).to have_field('Time Value', with: 'value 2')
        expect(page).to have_field('Description', with: 'description 2')
      end
    end

    expect(page).to have_field('Temporal Resolution', with: '7')
    expect(page).to have_field('Temporal Resolution', with: 'days')
    expect(page).to have_field('Relative Path', with: 'relative path')
  end
end


shared_examples_for 'Coverage Form with a Spatial Bounding Box' do
  it 'displays the form with values' do
    expect(page).to have_field('service_draft_draft_coverage_name', with: 'Coverage Name')

    expect(page).to have_field('Coverage Spatial Extent Type Type', with: 'BOUNDING_BOX')
    expect(page).to have_field('Uuid', with: '13f5e348-ffad-4ef9-9600-12ad74f60f77')

    expect(page).to have_field('Min X', with: '-5.0')
    expect(page).to have_field('Max X', with: '5.0')
    expect(page).to have_field('Min Y', with: '-10.0')
    expect(page).to have_field('Max Y', with: '10.0')
    expect(page).to have_field('Spatial Resolution', with: '50')
    expect(page).to have_field('Spatial Resolution Unit', with: 'KM')

    expect(page).to have_field('Coverage Temporal Extent Type Type', with: 'TIME_STAMP')
    expect(page).to have_field('Uuid', with: '17abd5ea-fd95-4801-a9e4-0ccd2f7acf40')
    within '.multiple.coverage-time-points' do
      within '.multiple-item-0' do
        expect(page).to have_field('Time Format', with: 'format 1')
        expect(page).to have_field('Time Value', with: 'value 1')
        expect(page).to have_field('Description', with: 'description 1')
      end
      within '.multiple-item-1' do
        expect(page).to have_field('Time Format', with: 'format 2')
        expect(page).to have_field('Time Value', with: 'value 2')
        expect(page).to have_field('Description', with: 'description 2')
      end
    end

    expect(page).to have_field('Temporal Resolution', with: '7')
    expect(page).to have_field('Temporal Resolution', with: 'days')
    expect(page).to have_field('Relative Path', with: 'relative path')
  end
end

shared_examples_for 'Coverage Form with Spatial Polygons' do
  it 'displays the form with values' do
    expect(page).to have_field('service_draft_draft_coverage_name', with: 'Coverage Name')

    expect(page).to have_field('Coverage Spatial Extent Type Type', with: 'SPATIAL_POLYGON')
    expect(page).to have_field('Uuid', with: '13f5e348-ffad-4ef9-9600-12ad74f60f77')
    within '.multiple.spatial-polygons' do
      within '.multiple-item-0' do
        expect(page).to have_field('Latitude', with: '0.0')
        expect(page).to have_field('Longitude', with: '0.0')
      end
      within '.multiple-item-1' do
        expect(page).to have_field('Latitude', with: '10.0')
        expect(page).to have_field('Longitude', with: '10.0')
      end
      within '.multiple-item-2' do
        expect(page).to have_field('Latitude', with: '10.0')
        expect(page).to have_field('Longitude', with: '-10.0')
      end
      within '.multiple-item-3' do
        expect(page).to have_field('Latitude', with: '-10.0')
        expect(page).to have_field('Longitude', with: '-10.0')
      end
    end
    expect(page).to have_field('Spatial Resolution', with: '50')
    expect(page).to have_field('Spatial Resolution Unit', with: 'KM')

    expect(page).to have_field('Coverage Temporal Extent Type Type', with: 'TIME_STAMP')
    expect(page).to have_field('Uuid', with: '17abd5ea-fd95-4801-a9e4-0ccd2f7acf40')
    within '.multiple.coverage-time-points' do
      within '.multiple-item-0' do
        expect(page).to have_field('Time Format', with: 'format 1')
        expect(page).to have_field('Time Value', with: 'value 1')
        expect(page).to have_field('Description', with: 'description 1')
      end
      within '.multiple-item-1' do
        expect(page).to have_field('Time Format', with: 'format 2')
        expect(page).to have_field('Time Value', with: 'value 2')
        expect(page).to have_field('Description', with: 'description 2')
      end
    end

    expect(page).to have_field('Temporal Resolution', with: '7')
    expect(page).to have_field('Temporal Resolution', with: 'days')
    expect(page).to have_field('Relative Path', with: 'relative path')
  end
end
