require 'rails_helper'

describe 'Viewing Provider Orders that do not exist' do
  let(:order_guid) { 'not_a_real_order' }

  before do
    login(provider: 'DEV07', providers: %w[MMT_2 DEV07])
  end

  after do
    login
  end

  context "when viewing a provider order that doesn't exist" do
    before do
      VCR.use_cassette('echo_soap/order_management_service/provider_orders/fake_order', record: :none) do
        visit provider_order_path(order_guid)
      end
    end

    it 'displays an error message about not existing' do
      within '.eui-banner--info' do
        expect(page).to have_content("Could not find order with guid [#{order_guid}]")
      end
    end
  end

  context "when editing a provider order that doesn't exist" do
    before do
      VCR.use_cassette('echo_soap/order_management_service/provider_orders/fake_order', record: :none) do
        visit edit_provider_order_path(order_guid)
      end
    end

    it 'displays an error message about not existing' do
      within '.eui-banner--info' do
        expect(page).to have_content("Could not find order with guid [#{order_guid}]")
      end
    end
  end

  context "when viewing a provider order and the soap response does not contain a faultstring" do
    before do
      VCR.use_cassette('echo_soap/order_management_service/provider_orders/no_order', record: :none) do
        visit provider_order_path(order_guid)
      end
    end

    it 'displays the default error message' do
      within '.eui-banner--info' do
        expect(page).to have_content('Could not load a provider order due to an unspecified error.')
      end
    end
  end

  context "when editing a provider order and the soap response does not contain a faultstring" do
    before do
      VCR.use_cassette('echo_soap/order_management_service/provider_orders/no_order', record: :none) do
        visit edit_provider_order_path(order_guid)
      end
    end

    it 'displays the default error message' do
      within '.eui-banner--info' do
        expect(page).to have_content('Could not load a provider order due to an unspecified error.')
      end
    end
  end
end
