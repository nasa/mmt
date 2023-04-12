describe 'Viewing a Service Option', skip: !Rails.configuration.use_legacy_order_service do
  before do
    login
  end

  context 'when viewing the service option' do
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
      expect(page).to have_link('Edit', href: edit_service_option_path(guid))
    end

    it 'displays the delete button' do
      expect(page).to have_link('Delete')
    end
  end
end
