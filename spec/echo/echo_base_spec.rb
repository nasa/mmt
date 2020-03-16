# This file contains tests to verify that the draft MMT cannot make any PUT,
# POST, or DELETE calls through the Echo client

describe 'Draft MMT should not be allowed to make PUT/POST/PATCH/DELETE calls to Echo' do
  let(:echo_client) { Echo::Client.new('http://example.com', Rails.configuration.services['echo_soap']['services'], Rails.configuration.services['urs']['mmt_proposal_mode']['test']['https://sit.urs.earthdata.nasa.gov']) }
  before do
    login
    set_as_proposal_mode_mmt
  end

  it 'cannot create_order_option' do
    expect { echo_client.make_request({}, {}) }.to raise_error('A requested action is not allowed in the current configuration.')
  end
end
