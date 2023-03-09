describe 'Deleting a Service Option', skip: !Rails.configuration.use_legacy_order_service do
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

    it 'displays the delete button' do
      expect(page).to have_link('Delete')
    end

    context 'when clicking the delete link' do
      before do
        click_link 'Delete'
      end

      it 'asks for confirmation before deleting' do
        expect(page).to have_content('Are you sure you want to delete this service option?')
      end

      context 'when declining the confirmation dialog', js: true do
        before do
          click_on 'No'
        end

        it 'closes the dialog and remains on the show action ' do
          expect(page.current_path).to eq service_option_path(guid)
        end
      end

      context 'when accepting the confirmation dialog', js: true do
        before do
          VCR.use_cassette('echo_soap/service_management_service/service_options/delete', record: :none) do
            click_on 'Yes'
          end
        end

        it 'displays a success message' do
          expect(page).to have_content('Service Option successfully deleted')
        end

        it 'redirects to the service option index page' do
          expect(page.current_path).to eq service_options_path
        end
      end
    end
  end

  context 'when viewing the service option index page' do
    before do
      VCR.use_cassette('echo_soap/service_management_service/service_options/list', record: :none) do
        visit service_options_path
      end
    end

    it 'displays the delete button for each service option' do
      within '.service-options-table' do
        expect(page).to have_text('Delete', count: 25)
      end
    end

    context 'when clicking the delete link of one row' do
      before do
        find(:xpath, "//tr[contains(.,'Lorem Ultricies Venenatis Egestas')]/td/a", text: 'Delete').click
      end

      it 'asks for confirmation before deleting' do
        expect(page).to have_content('Are you sure you want to delete the service option named \'Lorem Ultricies Venenatis Egestas\'?')
      end

      context 'when declining the confirmation dialog', js: true do
        before do
          click_on 'No'
        end

        it 'closes the dialog and remains on the index action ' do
          expect(page.current_path).to eq service_options_path
        end
      end

      context 'when accepting the confirmation dialog', js: true do
        before do
          VCR.use_cassette('echo_soap/service_management_service/service_options/delete', record: :none) do
            click_on 'Yes'
          end
        end

        it 'displays a success message' do
          expect(page).to have_content('Service Option successfully deleted')
        end

        it 'redirects to the service option index page' do
          expect(page.current_path).to eq service_options_path
        end
      end
    end
  end
end
