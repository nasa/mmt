describe 'Resubmitting Provider Orders' do
  let(:order_guid) { 'FF330AD3-1A89-871C-AC94-B689A5C95723' }

  context 'when viewing the provider order without permissions to resubmit orders' do
    before do
      # The order guid belongs to NSIDC_ECS
      login(provider: 'EDF_OPS', providers: %w(MMT_2 EDF_OPS))

      VCR.use_cassette('echo_soap/order_processing_service/provider_orders/terminal_order', record: :new_episodes) do
        visit provider_order_path(order_guid)
      end
    end

    it 'does not display a resubmit link' do
      expect(page).not_to have_link('Resubmit')
    end
  end

  context 'when viewing the provider order when authorized to resubmit orders' do
    before do
      # mocks the resubmit call
      allow_any_instance_of(ProviderOrderPolicy).to receive(:resubmit?).and_return(true)

      # The order guid belongs to NSIDC_ECS
      login(provider: 'NSIDC_ECS', providers: %w(MMT_2 NSIDC_ECS))

      VCR.use_cassette('echo_soap/order_processing_service/provider_orders/terminal_order', record: :new_episodes) do
        visit provider_order_path(order_guid)
      end

    end

    before :all do
      VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :new_episodes) do
        # create a group
        @token = 'jwt_access_token'
        @orders_group = create_group(name: "Orders_Group_for_Permissions_RESUBMIT_#{SecureRandom.uuid.gsub('-', '')}", members: ['testuser'], provider_id: 'NSIDC_ECS')
        @resubmit_permissions = add_permissions_to_group(@orders_group['group_id'], 'create', 'PROVIDER_ORDER_RESUBMISSION', 'NSIDC_ECS', @token)

      end
    end

    after :all do
      VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :new_episodes) do
        remove_group_permissions(@resubmit_permissions['concept_id'], @token)
        delete_group(concept_id: @orders_group['group_id'], admin: true)
        reindex_permitted_groups
      end
    end

    it 'does displays a resubmit link' do
      expect(page).to have_link('Resubmit')
    end

    context 'when resubmitting the order' do
      before do
        VCR.use_cassette('echo_soap/order_processing_service/provider_orders/resubmit', record: :new_episodes) do
          click_on 'Resubmit'
        end
      end

      it 'resubmits the order' do
        expect(page).to have_content('Order successfully resubmitted')
      end
    end
  end
end
