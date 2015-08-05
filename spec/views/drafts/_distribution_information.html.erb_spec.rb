# MMT-299

# View specs are described here: https://robots.thoughtbot.com/how-we-test-rails-applications#view-specs

#_distribution_information.html.erb_spec.rb

require 'rails_helper'

test_fee = '123.45'

describe 'drafts/previews/_distribution_information.html.erb' do
  context 'when the distribution information' do
    context 'is empty' do
      before do
        assign(:draft, build(:draft, draft: {}))
        render
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
        draft_json['RelatedUrl'] = [
            # minimal object populating
            {},
            {URL:[]},
            # Regular object populating
            {Description: 'test 1 Description',Protocol: 'test 1 Protocol',URL: ['test 1a URL', 'test 1b URL'],Title:'test 1 Title',MimeType:'test 1 MimeType',Caption:'test 1 Caption',
             FileSize:{Size: 'test 1 FileSize Size', Unit: 'test 1 FileSize Unit'}, ContentType: {Type: 'test 1 ContentType Type', Subtype: 'test 1 ContentType Subtype'}},
            {Description: 'test 2 Description',Protocol: 'test 2 Protocol',Title:'test 2 Title',MimeType:'test 2 MimeType',Caption:'test 2 Caption',
             FileSize:{Size: 'test 2 FileSize Size', Unit: 'test 2 FileSize Unit'}, ContentType: {Type: 'test 2 ContentType Type', Subtype: 'test 2 ContentType Subtype'}}
        ]
        draft_json['Distribution'] = [
            {},
            {DistributionMedia:'test 1 DistributionMedia',DistributionSize:'test 1 DistributionSize',DistributionFormat:'test 1 DistributionFormat', Fees:test_fee},
            {DistributionMedia:'test 2 DistributionMedia',DistributionSize:'test 2 DistributionSize',DistributionFormat:'test 2 DistributionFormat', Fees:'bad fee amount'}
        ]
        assign(:draft, build(:draft, draft: draft_json))
        render
      end

      it 'shows the values in the draft preview page' do
        check_page_for_display_of_values(rendered, draft_json)
      end

      it 'handles bad currency values' do # TODO: Does NOT properly handle '123.456'
        expect(rendered).to have_content('bad fee amount')
      end

      it 'handles good currency values' do
        expect(rendered).to have_content("$#{test_fee}")
      end
    end

  end

end