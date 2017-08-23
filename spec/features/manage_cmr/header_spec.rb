require 'rails_helper'

describe 'Manage CMR header' do
  before do
    login

    visit manage_cmr_path
  end

  context 'when viewing the header' do
    it 'has "Manage CMR" as the underlined current header link' do
      within 'main header' do
        expect(page).to have_css('h2.current', text: 'Manage CMR')
      end
    end
  end
end
