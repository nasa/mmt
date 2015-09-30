# MMT-296

# View specs are described here: https://robots.thoughtbot.com/how-we-test-rails-applications#view-specs

require 'rails_helper'
include DraftsHelper

template_path = 'shared/preview/_acquisition_information.html.erb'

describe template_path, type: :view do
  context 'when the acquisition information data' do
    context 'is empty' do
      before do
        assign :metadata, build(:draft, draft: {}).draft
        render template: template_path, locals: { metadata: {} }
      end

      it 'does not crash or have acquisition information data' do
        expect(rendered).to have_content('Acquisition Information')
        expect(rendered).to_not have_content('Platform')
        expect(rendered).to_not have_content('Project')
      end
    end

    context 'is populated' do
      draft_json = {}
      before do
        full_draft = build(:full_draft).draft

        draft_json['Projects'] = full_draft['Projects']
        draft_json['Platforms'] = full_draft['Platforms']

        assign :metadata, draft_json
        render template: template_path, locals: { metadata: draft_json }
      end

      it 'shows the values in the correct places and formats in the draft preview page' do
        rendered_node = Capybara.string(rendered)
        root_css_path = 'ul.acquisition-information-preview'
        draft_json.each do |key, value|
          check_css_path_for_display_of_values(rendered_node, value, key, root_css_path, {}, true)
        end
      end
    end
  end
end
