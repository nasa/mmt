describe ServiceOptionAssignmentsController do
  context 'when checking the permitted parameters' do
    # It is not generally advised to test private controller methods, but
    # there is value in verifying that our permitted parameters methods
    # are working as expected. Failures here can sometimes cause silent or
    # difficult to observe failures. This is particularly true for sections of
    # MMT that are used less often and are difficult to thoroughly test (i.e.
    # anything involving legacy services).
    let(:entry_guid) { 'entry_guid' }
    let(:option_definition_guid) { 'option_definition_guid' }
    let(:toList) { ['item1', 'item2'] }
    let(:service_option_assignment) { ['item1', 'item2'] }
    before do
      controller.params = ActionController::Parameters.new({bad_key: 'bad_value', service_entry_guid: entry_guid, service_option_definition_guid: option_definition_guid, applies_only_to_granules: true, service_option_assignment_catalog_guid_toList: toList, service_entries_toList: toList, service_option_assignment: service_option_assignment })
    end

    it 'has the correct params' do
      params = controller.send 'service_option_assignment_params'
      expect(params.keys).to eq(['service_entry_guid', 'service_option_definition_guid', 'applies_only_to_granules', 'service_option_assignment_catalog_guid_toList', 'service_entries_toList', 'service_option_assignment'])
      expect(params['service_entry_guid']).to eq(entry_guid)
      expect(params['service_option_definition_guid']).to eq(option_definition_guid)
      expect(params['applies_only_to_granules']).to eq(true)
      expect(params['service_option_assignment_catalog_guid_toList']).to eq(toList)
      expect(params['service_entries_toList']).to eq(toList)
      expect(params['service_option_assignment']).to eq(service_option_assignment)
    end
  end
end
