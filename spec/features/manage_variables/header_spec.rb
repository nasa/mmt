require 'rails_helper'

describe 'Manage Variables header' do
  before do
    login

    visit manage_variables_path
  end

  context 'when viewing the header' do
    it 'has "Manage Variables" as the underlined current header link' do
      within 'main header' do
        expect(page).to have_css('h2.current', text: 'Manage Variables')
      end
    end
  end
end
