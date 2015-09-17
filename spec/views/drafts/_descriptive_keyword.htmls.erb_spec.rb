# MMT-294

require 'rails_helper'
include DraftsHelper

template_path = 'drafts/previews/_descriptive_keywords.html.erb'

describe template_path, type: :view do
  context 'when the acquisition information data' do
    context 'is empty' do
      before do
        assign(:draft, build(:draft, draft: {}))
        render template: template_path, locals: { draft: {} }
      end

      it 'does not crash or have acquisition information data' do
        expect(rendered).to have_content('Descriptive Keyword')
        expect(rendered).to_not have_content('Science Keywords')
        expect(rendered).to_not have_content('Additional Attributes')
      end
    end

    context 'is populated' do
      draft_json = {}
      before do
        draft_json['ScienceKeywords'] = [{
          'Category' => 'EARTH SCIENCE SERVICES', 'Topic' => 'DATA ANALYSIS AND VISUALIZATION', 'Term' => 'GEOGRAPHIC INFORMATION SYSTEMS'
        }, {
          'Category' => 'EARTH SCIENCE SERVICES', 'Topic' => 'DATA ANALYSIS AND VISUALIZATION', 'Term' => 'GEOGRAPHIC INFORMATION SYSTEMS', 'VariableLevel1' => 'MOBILE GEOGRAPHIC INFORMATION SYSTEMS'
        }, {
          'Category' => 'EARTH SCIENCE SERVICES', 'Topic' => 'DATA ANALYSIS AND VISUALIZATION', 'Term' => 'GEOGRAPHIC INFORMATION SYSTEMS', 'VariableLevel1' => 'DESKTOP GEOGRAPHIC INFORMATION SYSTEMS'
        }]

        draft_json['AncillaryKeywords'] = [
          'Ancillary keyword 1',
          'Ancillary keyword 2'
        ]

        draft_json['AdditionalAttributes'] = [{
          'Name' => 'Attribute 1', 'Description' => 'Description', 'DataType' => 'STRING', 'MeasurementResolution' => 'Measurement Resolution', 'ParameterRangeBegin' => 'Parameter Range Begin', 'ParameterRangeEnd' => 'Parameter Range End', 'ParameterUnitsOfMeasure' => 'Parameter Units Of Measure', 'ParameterValueAccuracy' => 'Parameter Value Accuracy', 'ValueAccuracyExplanation' => 'Value Accuracy Explanation', 'Group' => 'Group', 'UpdateDate' => '2015-09-14T00:00:00Z'
        }, {
          'Name' => 'Attribute 1', 'DataType' => 'INT'
        }]

        assign(:draft, build(:draft, draft: draft_json))
        # output_schema_validation draft_json

        render template: template_path, locals: { draft: draft_json }
      end

      it 'shows the values in the correct places and formats in the draft preview page' do
        rendered_node = Capybara.string(rendered)
        root_css_path = 'ul.descriptive-keywords-preview'
        draft_json.each do |key, value|
          check_css_path_for_display_of_values(rendered_node, value, key, root_css_path, { DataType: :handle_as_data_type }, true)
        end
      end
    end
  end
end
