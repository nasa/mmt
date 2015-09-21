# MMT-294

require 'rails_helper'
include DraftsHelper

template_path = 'shared/preview/_descriptive_keywords.html.erb'

describe template_path, type: :view do
  context 'when the acquisition information data' do
    context 'is empty' do
      before do
        assign :draft, build(:draft, draft: {}).draft
        render template: template_path, locals: { metadata: {} }
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
        full_draft = build(:full_draft).draft

        draft_json['ScienceKeywords'] = full_draft['ScienceKeywords']
        draft_json['AncillaryKeywords'] = full_draft['AncillaryKeywords']
        draft_json['AdditionalAttributes'] = full_draft['AdditionalAttributes']

        assign :metadata, draft_json
        render template: template_path, locals: { metadata: draft_json }
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
