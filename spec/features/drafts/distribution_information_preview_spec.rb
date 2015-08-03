#MMT-299

require 'rails_helper'

# We can make testing more robust by checking to insure that values are showing up in the correct locations.

draft_json = {}
current_user_id = 0
test_fee = '123.45'

describe 'Distribution Information form' do
  before do
    login
    current_user_id = User.where(urs_uid: 'testuser').first.id
  end

  context 'when Distribution Information is populated' do
    before do

      draft_json['RelatedUrl'] = [
        # minimal field populating
        {},
        {URL:[]},
        # Regular field populating
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

      create(:draft, user_id: current_user_id, draft: draft_json)

      visit '/dashboard'
      within('.open-drafts') do
        click_on '<Blank Entry Id>'
      end
    end

    it 'shows the values in the draft preview page' do
      check_page_for_display_of_values (draft_json)
    end

    it 'handles bad currency values' do # TODO: Does NOT properly handle '123.456'
      expect(page).to have_content('bad fee amount')
    end

    it 'handles good currency values' do
      expect(page).to have_content("$#{test_fee}")
    end


  end

  context 'when Distribution Information is not populated' do
    before do

      draft_json = {}

      create(:draft, user_id: current_user_id, draft: draft_json)

      visit '/dashboard'
      within('.open-drafts') do
        click_on '<Blank Entry Id>'
      end
    end

    it 'does not crash or have Distribution Information' do
      expect(page).to_not have_content('MimeType')
      expect(page).to_not have_content('DistributionSize')
    end

  end
end
