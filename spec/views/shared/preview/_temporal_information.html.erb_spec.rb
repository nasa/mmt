# MMT-296

# View specs are described here: https://robots.thoughtbot.com/how-we-test-rails-applications#view-specs

require 'rails_helper'
include DraftsHelper

template_path = 'shared/preview/_temporal_information.html.erb'

describe template_path, type: :view do
  context 'when the temporal extent data' do
    context 'is empty' do
      before do
        assign :draft, build(:draft, draft: {}).draft
        render template: template_path, locals: { metadata: {} }
      end

      it 'does not crash or have temporal extent data' do
        rendered_node = Capybara.string(rendered)
        expect(rendered_node).to have_no_content('Temporal Extent')
        expect(rendered_node).to have_no_content('Temporal Keyword')
        expect(rendered_node).to have_no_content('Paleo Temporal Coverage')
      end
    end

    context 'is populated' do
      draft_json = {}
      before do
        full_draft = build(:full_draft).draft

        draft_json['TemporalExtents'] = full_draft['TemporalExtents']
        draft_json['TemporalKeywords'] = full_draft['TemporalKeywords']
        draft_json['PaleoTemporalCoverage'] = full_draft['PaleoTemporalCoverage']

        assign :metadata, draft_json
        render template: template_path, locals: { metadata: draft_json }
      end

      it 'shows the values in the correct places and formats in the draft preview page' do
        rendered_node = Capybara.string(rendered)
        root_css_path = 'ul.temporal-extent-preview'
        draft_json.each do |key, value|
          check_css_path_for_display_of_values(rendered_node, value, key, root_css_path, { DurationUnit: :handle_as_duration, PeriodCycleDurationUnit: :handle_as_duration }, true)
        end
      end
    end
  end
end
