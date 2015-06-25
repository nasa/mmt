# MMT-9, MMT-22

require 'rails_helper'

describe 'Quick Find Search not on home page' do

  context 'When on the home page' do
    before :each do
      visit '/'
    end
    it 'there is no Quick Find option' do
      expect(page).not_to have_button('quick_find_button')
    end
  end
end
