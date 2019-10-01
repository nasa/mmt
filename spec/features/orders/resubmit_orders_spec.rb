describe 'Resubmitting Provider Orders' do
  let(:order_guid) { 'FF330AD3-1A89-871C-AC94-B689A5C95723' }

  context 'when viewing the provider order' do
    before do
      # The order guid belongs to NSIDC_ECS
      login(provider: 'EDF_OPS', providers: %w(MMT_2 EDF_OPS))

      VCR.use_cassette('echo_soap/order_processing_service/provider_orders/terminal_order', record: :none) do
        visit provider_order_path(order_guid)
      end
    end

    after do
      # Reset the provider to the test provider
      login
    end

    context 'without permissions to resubmit orders' do
      it 'does not display a resubmit link' do
        expect(page).not_to have_link('Resubmit')
      end
    end

    context 'when authorized to resubmit orders' do
      before :all do
        # create a group
        @orders_group = create_group(name: 'Orders Group for Permissions [RESUBMIT]', members: ['testuser'], provider_id: 'NSIDC_ECS')
        @resubmit_permissions = add_permissions_to_group(@orders_group['concept_id'], 'create', 'PROVIDER_ORDER_RESUBMISSION', 'NSIDC_ECS')
      end

      after :all do
        remove_group_permissions(@resubmit_permissions['concept_id'])
        delete_group(concept_id: @orders_group['concept_id'])
      end

      it 'does displays a resubmit link' do
        expect(page).to have_link('Resubmit')
      end

      context 'when resubmitting the order' do
        before do
          VCR.use_cassette('echo_soap/order_processing_service/provider_orders/resubmit', record: :none) do
            click_on 'Resubmit'
          end
        end

        it 'resubmits the order' do
          expect(page).to have_content('Order successfully resubmitted')
        end
      end
    end
  end
end
