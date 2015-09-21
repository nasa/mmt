# MMT-299

# View specs are described here: https://robots.thoughtbot.com/how-we-test-rails-applications#view-specs

require 'rails_helper'
include DraftsHelper
include TypesHelper

template_path = 'shared/preview/_distribution_information.html.erb'

test_fee = 1234.56

describe template_path, type: :view do
  context 'when the distribution information' do
    context 'is empty' do
      before do
        assign :draft, build(:draft, draft: {}).draft
        render template: template_path, locals: { metadata: {} }
      end

      it 'does not crash or have Distribution Information' do
        expect(rendered).to have_content('Distribution Information')
        expect(rendered).to_not have_content('MimeType')
        expect(rendered).to_not have_content('DistributionSize')
      end
    end

    context 'is populated' do
      draft_json = {}
      before do
        full_draft = build(:full_draft).draft

        draft_json['RelatedUrls'] = full_draft['RelatedUrls']
        draft_json['Distributions'] = full_draft['Distributions']

        assign :metadata, draft_json
        render template: template_path, locals: { metadata: draft_json }
      end

      it 'shows the values in the correct places and formats in the draft preview page' do
        rendered_node = Capybara.string(rendered)
        root_css_path = 'ul.distribution-information-preview'
        draft_json.each do |key, value|
          check_css_path_for_display_of_values(rendered_node, value, key, root_css_path, { Fees: :handle_as_currency }, true)
        end
      end

      it 'handles good currency values' do
        expect(rendered).to have_content(number_to_currency(test_fee))
      end
    end
  end
end
