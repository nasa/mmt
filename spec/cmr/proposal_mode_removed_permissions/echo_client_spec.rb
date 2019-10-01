# This file contains tests to verify that the draft MMT cannot make any PUT,
# POST, or DELETE calls through the Echo client

describe 'Draft MMT should not be allowed to make PUT/POST/PATCH/DELETE calls to Echo' do
  before do
    login
    set_as_proposal_mode_mmt
  end

  it 'cannot create_order_option' do
    expect { cmr_client.create_order_option({}, {}) }.to raise_error('A requested action is not allowed in the current configuration.')
  end

  it 'cannot delete_order_option' do
    expect { cmr_client.delete_order_option({}, {}) }.to raise_error('A requested action is not allowed in the current configuration.')
  end

  it 'cannot add_order_option_assignments' do
    expect { cmr_client.add_order_option_assignments({}, {}, {}) }.to raise_error('A requested action is not allowed in the current configuration.')
  end

  it 'cannot delete_order_option_assignments' do
    expect { cmr_client.delete_order_option_assignments({}, {}) }.to raise_error('A requested action is not allowed in the current configuration.')
  end
end
