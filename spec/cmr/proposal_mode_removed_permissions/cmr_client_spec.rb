# This file contains tests to verify that the draft MMT cannot make any PUT,
# POST, or DELETE calls through the CMR client
describe 'Draft MMT should not be allowed to make PUT/POST/PATCH/DELETE calls to CMR' do
  before do
    login
    set_as_proposal_mode_mmt
  end

  it 'cannot get_collections_by_post' do
    expect { cmr_client.get_collections_by_post({}) }.to raise_error('A requested action is not allowed in the current configuration.')
  end

  it 'cannot add_collection_assocations' do
    expect { cmr_client.add_collection_associations({}, {}, {}, 'service') }.to raise_error('A requested action is not allowed in the current configuration.')
  end

  it 'cannot delete_collection_assocations_to_service' do
    expect { cmr_client.delete_collection_associations({}, {}, {}, 'service') }.to raise_error('A requested action is not allowed in the current configuration.')
  end

  it 'cannot translate_collection' do
    expect { cmr_client.translate_collection({}, {}, {}) }.to raise_error('A requested action is not allowed in the current configuration.')
  end

  it 'cannot ingest_collection' do
    expect { cmr_client.ingest_collection({}, {}, '', {}) }.to raise_error('A requested action is not allowed in the current configuration.')
  end

  it 'cannot delete_collection' do
    expect { cmr_client.delete_collection({}, '', {}) }.to raise_error('A requested action is not allowed in the current configuration.')
  end

  it 'cannot ingest_variable' do
    expect { cmr_client.ingest_variable(metadata: {}, provider_id: '', native_id: '', collection_concept_id: '', token: '') }.to raise_error('A requested action is not allowed in the current configuration.')
  end

  it 'cannot ingest_service' do
    expect { cmr_client.ingest_service(metadata: {}, provider_id: '', native_id: '', collection_concept_id: '', token: '') }.to raise_error('A requested action is not allowed in the current configuration.')
  end

  it 'cannot ingest_tool' do
    expect { cmr_client.ingest_tool(metadata: {}, provider_id: '', native_id: '', collection_concept_id: '', token: '') }.to raise_error('A requested action is not allowed in the current configuration.')
  end

  it 'cannot delete_variable' do
    expect { cmr_client.delete_variable({}, '', {}) }.to raise_error('A requested action is not allowed in the current configuration.')
  end

  it 'cannot delete_service' do
    expect { cmr_client.delete_service({}, '', {}) }.to raise_error('A requested action is not allowed in the current configuration.')
  end

  it 'cannot delete_tool' do
    expect { cmr_client.delete_tool({}, '', {}) }.to raise_error('A requested action is not allowed in the current configuration.')
  end

  it 'cannot create_bulk_update' do
    expect { cmr_client.create_bulk_update({}, {}, {}) }.to raise_error('A requested action is not allowed in the current configuration.')
  end

  it 'cannot create_group' do
    VCR.use_cassette('edl', record: :new_episodes) do
      expect { cmr_client.create_edl_group({}) }.to raise_error('A requested action is not allowed in the current configuration.')
    end
  end

  it 'cannot update_group' do
    VCR.use_cassette('edl', record: :new_episodes) do
      expect { cmr_client.update_edl_group('123', {}) }.to raise_error('A requested action is not allowed in the current configuration.')
    end
  end

  it 'cannot delete_group' do
    VCR.use_cassette('edl', record: :new_episodes) do
      expect { cmr_client.delete_edl_group({}) }.to raise_error('A requested action is not allowed in the current configuration.')
    end
  end

  # removed because we have no API to add members, only updating the group with new members
  # it 'cannot add_group_members' do
  #   expect { cmr_client.add_new_members({}, {}, {}) }.to raise_error('A requested action is not allowed in the current configuration.')
  # end

  # removed because we have no API to remove members, only updating the group with the latest members
  # it 'cannot remove_group_members' do
  #   expect { cmr_client.remove_group_members({}, {}, {}) }.to raise_error('A requested action is not allowed in the current configuration.')
  # end

  it 'cannot add_group_permissions' do
    expect { cmr_client.add_group_permissions({}, {}) }.to raise_error('A requested action is not allowed in the current configuration.')
  end

  it 'cannot update_permission' do
    expect { cmr_client.update_permission({}, {}, {}) }.to raise_error('A requested action is not allowed in the current configuration.')
  end

  it 'cannot delete_permission' do
    expect { cmr_client.delete_permission({}, {}) }.to raise_error('A requested action is not allowed in the current configuration.')
  end
end
