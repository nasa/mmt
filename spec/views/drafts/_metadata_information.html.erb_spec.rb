# MMT-295

# View specs are described here: https://robots.thoughtbot.com/how-we-test-rails-applications#view-specs

require 'rails_helper'
include DraftsHelper

template_path = 'drafts/previews/_metadata_information.html.erb'

describe template_path, type: :view do
  context 'when the metadata information' do
    context 'is empty' do
      before do
        assign(:draft, build(:draft, draft: {}))
        render :template => template_path, :locals=>{draft: {}}
      end

      it 'does not crash or have Metadata Information' do
        expect(rendered).to have_content('Metadata Information')
        expect(rendered).to_not have_content('Metadata Language')
        expect(rendered).to_not have_content('Metadata Dates')
      end
    end

    context 'is populated' do
      draft_json = {}
      before do
        draft_json['MetadataLanguage'] = 'English'

        draft_json['MetadataDates'] = [
          # Regular object populating
          {"Type" => "CREATE", "Date" => "2010-12-25T00:00:00Z"},
          {"Type" => "REVIEW", "Date" => "2010-12-30T00:00:00Z"}
        ]

        assign(:draft, build(:draft, draft: draft_json))
        #output_schema_validation draft_json
        render :template => template_path, :locals=>{draft: draft_json}
      end

      it 'shows the values in the correct places and formats in the draft preview page' do
        rendered_node = Capybara.string(rendered)
        root_css_path = "ul.metadata-information-preview"
        draft_json.each do |key, value|
          check_css_path_for_display_of_values(rendered_node, value, key, root_css_path, {Type: :handle_as_date_type}, true)
        end
      end

    end

  end

end
