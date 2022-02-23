require 'rails_helper'

describe 'Status check' do
  before do
    VCR.use_cassette('launchpad/launchpad_status', record: :once) do
      visit '/status'
    end
  end

  it 'displays true for database and launchpad when both are healthy' do
    expect(page).to have_text('{"database": true, "launchpad": true}')
    expect(page.status_code).to eq(200)
  end
end
