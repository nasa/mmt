# MMT-295

# View specs are described here: https://robots.thoughtbot.com/how-we-test-rails-applications#view-specs

require 'rails_helper'
include DraftsHelper

template_path = 'shared/preview/_metadata_information.html.erb'

describe template_path, type: :view do
  context 'when the metadata information' do
    before do
      assign :language_codes, 'English' => 'eng'
    end

    context 'is empty' do
      before do
        assign :draft, build(:draft, draft: {}).draft
        render template: template_path, locals: { metadata: {} }
      end

      it 'does not crash or have Metadata Information' do
        expect(rendered).to have_content('Metadata Information')
        expect(rendered).to have_content('Metadata Language')
        expect(rendered).to have_content('Metadata Dates')
      end
    end

    context 'is populated' do
      draft_json = {}
      before do
        full_draft = build(:full_draft).draft

        draft_json['MetadataLanguage'] = full_draft['MetadataLanguage']
        draft_json['MetadataDates'] = full_draft['MetadataDates']

        assign :metadata, draft_json
        render template: template_path, locals: { metadata: draft_json }
      end

      it 'shows the values in the correct places and formats in the draft preview page' do
        rendered_node = Capybara.string(rendered)
        root_css_path = 'ul.metadata-information-preview'
        draft_json.each do |key, value|
          check_css_path_for_display_of_values(rendered_node, value, key, root_css_path, { Type: :handle_as_date_type, MetadataLanguage: :handle_as_language_code }, true)
        end
      end
    end
  end
end
