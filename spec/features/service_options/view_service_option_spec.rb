require 'rails_helper'

describe 'Viewing a Service Option' do
  before do
    login

    User.first.update(provider_id: 'MMT_2')
  end

  context 'when viewing the new service option form' do
    let(:guid) { 'F0452F1C-C22F-335A-7284-546AF8A325E4' }

    before do
      VCR.use_cassette('echo_soap/service_management_service/service_options/view', record: :none) do
        visit service_option_path(guid)
      end
    end

    it 'displays the service option details' do
      expect(page).to have_content('Tellus Tortor Venenatis')
      expect(page).to have_content('Tuesday, January 17, 2017 at 4:46 pm')
      expect(page).to have_content('Nullam quis risus eget urna mollis ornare vel eu leo.')
    end

    it 'displays the edit button' do
      expect(page).to have_link('Edit', edit_service_option_path(guid))
    end
  end
end
