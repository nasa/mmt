# This file contains tests to verify that the draft MMT cannot make any PUT,
# POST, or DELETE calls through the UVG client

describe 'Draft MMT should not be allowed to make PUT/POST/PATCH/DELETE calls to UVG' do
  before do
    login
    set_as_proposal_mode_mmt
  end

  it 'cannot uvg_generate' do
    expect { cmr_client.uvg_generate({}, {}) }.to raise_error('A requested action is not allowed in the current configuration.')
  end

  it 'cannot uvg_augment_definitions' do
    expect { cmr_client.uvg_augment_definitions({}, {}) }.to raise_error('A requested action is not allowed in the current configuration.')
  end

  it 'cannot uvg_augment_keywords' do
    expect { cmr_client.uvg_augment_keywords({}, {}) }.to raise_error('A requested action is not allowed in the current configuration.')
  end

  it 'cannot uvg_augment_estimates' do
    expect { cmr_client.uvg_augment_estimates({}, {}) }.to raise_error('A requested action is not allowed in the current configuration.')
  end
end
