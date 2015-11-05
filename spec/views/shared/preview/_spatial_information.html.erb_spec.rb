# MMT-297

# View specs are described here: https://robots.thoughtbot.com/how-we-test-rails-applications#view-specs

require 'rails_helper'
include DraftsHelper

template_path = 'shared/preview/_spatial_information.html.erb'

describe template_path, type: :view do
  context 'when the spatial extent data' do
    context 'is empty' do
      before do
        assign :draft, build(:draft, draft: {}).draft
        render template: template_path, locals: { metadata: {} }
      end

      it 'does not crash or have spatial extent data' do
        rendered_node = Capybara.string(rendered)
        expect(rendered_node).to have_no_content('Spatial Extent')
        expect(rendered_node).to have_no_content('Spatial Keyword')
        expect(rendered_node).to have_no_content('Tiling Identification')
      end
    end

    context 'is populated' do
      draft_json = {}
      before do
        full_draft = build(:full_draft).draft

        draft_json['SpatialExtent'] = full_draft['SpatialExtent']
        draft_json['TilingIdentificationSystem'] = full_draft['TilingIdentificationSystem']
        draft_json['SpatialInformation'] = full_draft['SpatialInformation']
        draft_json['SpatialKeywords'] = full_draft['SpatialKeywords']

        assign :metadata, draft_json
        render template: template_path, locals: { metadata: draft_json }
      end

      it 'shows the values in the correct places and formats in the draft preview page' do
        rendered_node = Capybara.string(rendered)
        root_css_path = 'ul.spatial-extent-preview'
        draft_json.each do |key, value|
          check_css_path_for_display_of_values(rendered_node, value, key, root_css_path, { CoordinateSystem: :handle_as_coordinate_system_type, SpatialCoverageType: :handle_as_spatial_coverage_type, GranuleSpatialRepresentation: :handle_as_granule_spatial_representation }, true)
        end
      end
    end
  end
end
