require 'rails_helper'

describe 'Status check' do
  before do
    VCR.use_cassette('launchpad_status', record: :once) do
      visit '/status'
    end
  end

  it 'displays true for database and launchpad when both are healthy' do
    expect(page).to have_text('{"database": true, "launchpad": true}')
  end
end
