require 'rails_helper'

describe 'Searching Orders' do
  context 'when viewing the track orders page' do
    before do
      login

      User.first.update(provider_id: 'EDF_OPS')

      visit orders_path
    end

    context 'when results include orders with no contact information' do
      before do
        select 'Creation date', from: 'date_type'
        fill_in 'From', with: '2017-04-07T00:00:00'
        fill_in 'To', with: '2017-04-08T00:00:00'

        VCR.use_cassette('echo_soap/order_management_service/results_with_no_contacts', record: :none) do
          within '#track-orders-form' do
            click_on 'Submit'
          end
        end
      end

      it 'displays results including orders with no contact information' do
        within '.orders-table tbody' do
          expect(page).to have_selector('tr', count: 1)

          # There is nothing for 'Contact Name'
          expect(page).to have_content('(guest)	View Provider Order')
        end
      end
    end

    context 'when viewing a guest order' do
      let(:guest_order_guid) { 'gues-tord-ergu-id01' }

      before do
        VCR.use_cassette('echo_soap/order_management_service/no_contact_order', record: :none) do
          visit order_path(guest_order_guid)
        end
      end

      it 'displays the guest order correctly' do
        # No contact information is visible
        expect(page).to have_content('Contact Information Role:	Name:	Organization:	Address:')
      end
    end
  end
end
