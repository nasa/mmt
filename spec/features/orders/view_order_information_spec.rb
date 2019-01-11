require 'rails_helper'

describe 'Viewing Order Information' do
  order_guid = 'test_order_guid'

  context 'when viewing order information' do
    before do
      login

      VCR.use_cassette('echo_soap/order_management_service/order_information', record: :none) do
        visit order_path(order_guid)
      end
    end

    it 'displays order information' do
      expect(page).to have_content('Order Guid: test_order_guid')
      expect(page).to have_content('State: PROCESSING')
      expect(page).to have_content('Price: 0.0')
      expect(page).to have_content('Created: Friday, February 03, 2017 at 3:20 pm')
      expect(page).to have_content('Submitted: Friday, February 03, 2017 at 3:20 pm')
      expect(page).to have_content('Updated: Friday, February 03, 2017 at 3:20 pm')
      expect(page).to have_content('Owner: abobcat')
      expect(page).to have_content('Notification Level: INFO')
      expect(page).to have_content('Affiliation: GOVERNMENT')
      expect(page).to have_content('User Region: USA')
      expect(page).to have_content('Client Identity: client_identity_token')

      # Contact Information
      within '#contact-information' do
        expect(page).to have_content('Role: Order Contact')
        expect(page).to have_content('Name: Alien Bobcat')
        expect(page).to have_content('Organization: Raytheon')
        expect(page).to have_content('Address: 210 N. Lee Street Suite 203 Alexandria VA 22314 United States', normalize_ws: true)
        expect(page).to have_content('Phone: 7036505490 (BUSINESS)')
        expect(page).to have_content('Email: Alien.Bobcat@nasa.gov')
      end

      # Shipping Information
      within '#shipping-information' do
        expect(page).to have_content('Role: Shipping Contact')
        expect(page).to have_content('Name: Alien Bobcat')
        expect(page).to have_content('Organization: Raytheon')
        expect(page).to have_content('Address: United States', normalize_ws: true)
        expect(page).to have_content('Phone: 7036505490 (BUSINESS)')
        expect(page).to have_content('Email: Alien.Bobcat@nasa.gov')
      end

      # Billing Information
      within '#billing-information' do
        expect(page).to have_content('Role: Billing Contact')
        expect(page).to have_content('Name: Alien Bobcat')
        expect(page).to have_content('Organization: Raytheon')
        expect(page).to have_content('Address: United States', normalize_ws: true)

        expect(page).to have_content('Phone: 7036505490 (BUSINESS)')
        expect(page).to have_content('Email: Alien.Bobcat@nasa.gov')
      end
    end
  end
end
