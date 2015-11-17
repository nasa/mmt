require 'rails_helper'

describe 'Status check' do
  before do
    visit '/status'
  end

  it 'displays "true" when the app is running' do
    expect(page).to have_content('true')
  end
end
