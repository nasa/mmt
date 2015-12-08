# MMT-381

require 'rails_helper'
include DraftsHelper

template_path = 'shared/preview/_collection_information.html.erb'

describe template_path, type: :view do
  context 'when the collection information data' do
    before do
      assign :language_codes, 'English' => 'eng'
    end

    context 'is empty' do
      before do
        assign :draft, build(:draft, draft: {}).draft
        render template: template_path, locals: { metadata: {} }
      end

      it 'does not crash or have collection information data' do
        expect(rendered).to have_content('Collection Information')
        expect(rendered).to_not have_content('Entry Title')
      end
    end

    context 'is populated' do
      draft_json = {}
      before do
        full_draft = build(:full_draft).draft

        draft_json['ShortName'] = full_draft['ShortName']
        draft_json['Version'] = full_draft['Version']
        draft_json['EntryTitle'] = full_draft['EntryTitle']
        draft_json['Abstract'] = full_draft['Abstract']
        draft_json['Purpose'] = full_draft['Purpose']
        draft_json['DataLanguage'] = full_draft['DataLanguage']

        assign :metadata, draft_json
        render template: template_path, locals: { metadata: draft_json }
      end

      it 'shows the values in the correct places and formats in the draft preview page' do
        rendered_node = Capybara.string(rendered)
        root_css_path = 'ul.collection-information-preview'
        draft_json.each do |key, value|
          check_css_path_for_display_of_values(rendered_node, value, key, root_css_path, { DataLanguage: :handle_as_language_code }, true)
        end
      end
    end
  end
end
