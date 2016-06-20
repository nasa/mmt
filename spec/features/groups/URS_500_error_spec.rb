# MMT-654

require 'rails_helper'

describe 'Groups views when URS returns a 500 error html response' do
  before do
    login
  end

  context 'when visiting the groups index page' do
    before do
      VCR.use_cassette('groups/page_with_URS_500_error', record: :none) do
        visit groups_path
      end
    end

    it 'displays the correct error message' do
      expect(page).to have_css('.eui-banner--danger')
      expect(page).to have_content('An unexpected URS error has occurred.')
    end
  end

  context 'when visiting the new groups page' do
    before do
      VCR.use_cassette('groups/page_with_URS_500_error', record: :none) do
        visit new_group_path
      end
    end

    it 'displays the correct error message' do
      expect(page).to have_css('.eui-banner--danger')
      expect(page).to have_content('An unexpected URS error has occurred.')
    end
  end
end
