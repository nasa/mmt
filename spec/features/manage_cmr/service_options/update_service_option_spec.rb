describe 'Updating a Service Option', skip: !Rails.configuration.use_legacy_order_service do
  before do
    login
  end

  context 'when viewing the edit service option form' do
    let(:guid) { 'F0452F1C-C22F-335A-7284-546AF8A325E4' }

    before do
      VCR.use_cassette('echo_soap/service_management_service/service_options/edit', record: :none) do
        visit edit_service_option_path(guid)
      end
    end

    it 'displays the service option form' do
      expect(page).to have_content('Editing Tellus Tortor Venenatis')
    end

    context 'when submitting the service option form' do
      context 'with invalid values', js: true do
        before do
          fill_in 'Name', with: ''

          within '#service-option-form' do
            click_on 'Submit'
          end
        end

        it 'displays validation errors within the form' do
          expect(page).to have_content('Name is required.')
        end
      end

      context 'with valid values' do
        let(:name)        { 'Lorem Ultricies Venenatis Egestas' }
        let(:description) { 'Nullam quis risus eget urna mollis ornare vel eu leo, edited.' }

        before do
          fill_in 'Name', with: name
          fill_in 'Description', with: description

          VCR.use_cassette('echo_soap/service_management_service/service_options/update', record: :none) do
            within '#service-option-form' do
              click_on 'Submit'
            end
          end
        end

        it 'updates the service option and displays a confirmation message' do
          expect(page).to have_content('Service Option successfully updated')
        end
      end
    end
  end
end
