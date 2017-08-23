require 'rails_helper'

describe 'Manage Collections header' do
  before do
    login

    visit manage_collections_path
  end

  context 'when viewing the header' do
    it 'has "Manage Collections" as the underlined current header link' do
      within 'main header' do
        expect(page).to have_css('h2.current', text: 'Manage Collections')
      end
    end
  end
end
