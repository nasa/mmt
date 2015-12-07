# MMT-381

require 'rails_helper'
include DraftsHelper

template_path = 'shared/preview/_personnel.html.erb'

describe template_path, type: :view do
  context 'when the personnel data' do
    before do
      assign :language_codes, 'English' => 'eng'
    end

    context 'is empty' do
      before do
        assign :draft, build(:draft, draft: {}).draft
        render template: template_path, locals: { metadata: {} }
      end

      it 'does not crash or have personnel data' do
        expect(rendered).to have_content('Personnel')
        expect(rendered).to_not have_content('Last Name')
      end
    end

    context 'is populated' do
      draft_json = {}
      before do
        full_draft = build(:full_draft).draft

        draft_json['Personnel'] = full_draft['Personnel']

        assign :metadata, draft_json
        render template: template_path, locals: { metadata: draft_json }
      end

      it 'shows the values in the correct places and formats in the draft preview page' do
        rendered_node = Capybara.string(rendered)
        root_css_path = 'ul.personnel-preview'
        draft_json.each do |key, value|
          check_css_path_for_display_of_values(rendered_node, value, key, root_css_path, { Role: :handle_as_role }, true)
        end
      end
    end
  end
end
