describe 'Viewing and Creating Order Option Assignments', js: true do
  before do
    services_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/order_option_assignments/services_search.json'))))
    allow_any_instance_of(Cmr::CmrClient).to receive(:get_services).and_return(services_response)
    collections_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/order_option_assignments/cmr_search.json'))))
    allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).and_return(collections_response)
    login
    visit order_option_assignments_path
    wait_for_jQuery
  end

  context 'When trying to display option assignments without selecting any collections' do
    before do
      click_on 'Display Assignments'
    end

    it 'displays validation errors within the form' do
      expect(page).to have_content('You must select at least 1 collection.')
    end
  end

  context 'When displaying option assignments' do
    before do
      collections_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/order_option_assignments/cmr_search_selected.json'))))
      allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).and_return(collections_response)
      within '#collectionsChooser' do
        select('lorem_223 | ipsum', from: 'Available Collections')

        within '.button-container' do
          find('.add_button').click
        end
      end

      VCR.use_cassette("order_option_assignments/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
        click_on 'Display Assignments'
      end
    end

    it 'Displays the selected collections and their assigned Order Option definition names' do
      expect(page).to have_content('Include selected collections with no assigned options?')

      within('#collections-table tbody') do
        expect(page).to have_content 'ipsum'
        expect(page).to have_content 'lorem'
        expect(page).to have_content '223'
        expect(page).to have_content 'AST14DMO.3 Order'
        expect(page).to have_content 'AST14DMO.4 Order'
      end
    end
  end

  context 'When sorting option assignments' do
    before do
      within '#collectionsChooser' do
        page.all(:xpath, "//select[@id='collectionsChooser_fromList']/option").each do |e|
          select(e.text, from: 'Available Collections')
        end

        within '.button-container' do
          find('.add_button').click
        end
      end

      VCR.use_cassette("order_option_assignments/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
        click_on 'Display Assignments'
      end

      check 'Include selected collections with no assigned options?'
    end

    # Collection column
    context 'When clicking on the Collection column' do
      before do
        find('#collections-table thead th:nth-child(2)').click
      end

      it 'It sorts the table by Collections in ascending order' do
        within('#collections-table tbody') do
          first_cell = find('#collections-table tbody tr:first-child td:nth-child(2)')
          last_cell = find('#collections-table tbody tr:last-child td:nth-child(2)')
          expect(first_cell).to have_content 'ipsum'
          expect(last_cell).to have_content 'Testy long entry title'
        end
      end
    end

    context 'When clicking again on the Collection column' do
      before do
        find('#collections-table thead th:nth-child(2)').click
        find('#collections-table thead th:nth-child(2)').click
      end

      it 'It sorts the table by Collections in descending order' do
        within('#collections-table tbody') do
          first_cell = find('#collections-table tbody tr:first-child td:nth-child(2)')
          last_cell = find('#collections-table tbody tr:last-child td:nth-child(2)')
          expect(first_cell).to have_content 'Testy long entry title'
          expect(last_cell).to have_content 'ipsum'
        end
      end
    end

    # Short Name column
    context 'When clicking on the Short Name column' do
      before do
        find('#collections-table thead th:nth-child(3)').click
      end

      it 'It sorts the table by Short Name in ascending order' do
        within('#collections-table tbody') do
          first_cell = find('#collections-table tbody tr:first-child td:nth-child(3)')
          last_cell = find('#collections-table tbody tr:last-child td:nth-child(3)')
          expect(first_cell).to have_content 'ID'
          expect(last_cell).to have_content 'testing 03'
        end
      end
    end

    context 'When clicking again on the Short Name column' do
      before do
        find('#collections-table thead th:nth-child(3)').click
        find('#collections-table thead th:nth-child(3)').click
      end

      it 'It sorts the table by Short Name in descending order' do
        within('#collections-table tbody') do
          first_cell = find('#collections-table tbody tr:first-child td:nth-child(3)')
          last_cell = find('#collections-table tbody tr:last-child td:nth-child(3)')
          expect(first_cell).to have_content 'testing 03'
          expect(last_cell).to have_content 'ID'
        end
      end
    end

    # Version ID column
    context 'When clicking on the Version ID column' do
      before do
        find('#collections-table thead th:nth-child(4)').click
      end

      it 'It sorts the table by Version ID in ascending order' do
        within('#collections-table tbody') do
          first_cell = find('#collections-table tbody tr:first-child td:nth-child(4)')
          last_cell = find('#collections-table tbody tr:last-child td:nth-child(4)')
          expect(first_cell).to have_content '002'
          expect(last_cell).to have_content '223'
        end
      end
    end

    context 'When clicking again on the Version ID column' do
      before do
        find('#collections-table thead th:nth-child(4)').click
        find('#collections-table thead th:nth-child(4)').click
      end

      it 'It sorts the table by Version ID in descending order' do
        within('#collections-table tbody') do
          first_cell = find('#collections-table tbody tr:first-child td:nth-child(4)')
          last_cell = find('#collections-table tbody tr:last-child td:nth-child(4)')
          expect(first_cell).to have_content '223'
          expect(last_cell).to have_content '02'
        end
      end
    end

    # Option Definition column
    context 'When clicking on the Option Definition column' do
      before do
        find('#collections-table thead th:nth-child(5)').click
      end

      it 'It sorts the table by Option Definition in ascending order' do
        within('#collections-table tbody') do
          first_cell = find('#collections-table tbody tr:first-child td:nth-child(5)')
          last_cell = find('#collections-table tbody tr:last-child td:nth-child(5)')
          expect(first_cell).to have_content ''
          expect(last_cell).to have_content 'AST14DMO.4 Order'
        end
      end
    end

    context 'When clicking again on the Option Definition column' do
      before do
        find('#collections-table thead th:nth-child(5)').click
        find('#collections-table thead th:nth-child(5)').click
      end

      it 'It sorts the table by Option Definition in descending order' do
        within('#collections-table tbody') do
          first_cell = find('#collections-table tbody tr:first-child td:nth-child(5)')
          last_cell = find('#collections-table tbody tr:last-child td:nth-child(5)')
          expect(first_cell).to have_content 'AST14DMO.4 Order'
          expect(last_cell).to have_content ''
        end
      end
    end
  end

  context 'When attempting to make an option assignment without selecting any collections' do
    before do
      VCR.use_cassette("order_option_assignments/#{File.basename(__FILE__, '.rb')}_order_options_vcr", record: :none) do
        visit new_order_option_assignment_path
      end

      click_on 'Submit'
    end

    it 'Displays error messages and does not submit the form' do
      expect(page).to have_content('Service is required.')
      expect(page).to have_content('Order Option is required.')
      expect(page).to have_content('You must select at least 1 collection.')
    end
  end

  context 'When trying to create an option assignment with a deprecated order option' do
    before do
      VCR.use_cassette("order_option_assignments/#{File.basename(__FILE__, '.rb')}_order_options_depr_vcr", record: :none) do
        visit new_order_option_assignment_path
      end
    end

    it 'does not display deprecated order options' do
      expect(page).to_not have_select('Option Definition', with_options: ['AST14DMO.3 Order'])
    end
  end

  context 'When successfully creating an option assignment' do
    before do
      VCR.use_cassette("order_option_assignments/#{File.basename(__FILE__, '.rb')}_order_options_vcr", record: :none) do
        visit new_order_option_assignment_path
      end

      within '#collectionsChooser' do
        select('lorem_223 | ipsum', from: 'Available Collections')

        within '.button-container' do
          find('.add_button').click
        end
      end

      select 'AIRX3STD-8102-1.4', from: 'Service'
      select 'AST14DMO.3 Order', from: 'Option Definition'

      VCR.use_cassette("order_option_assignments/#{File.basename(__FILE__, '.rb')}_success_vcr", record: :new_episodes) do
        click_on 'Submit'
      end
    end

    it 'Displays a success message' do
      expect(page).to have_content('1 Order Option assignment created successfully.')
    end
  end

  context 'when viewing the create option assignment page when the provider only has one order option' do
    before do
      VCR.use_cassette("order_option_assignments/#{File.basename(__FILE__, '.rb')}_order_options_vcr", record: :none) do
        visit new_order_option_assignment_path
      end
    end

    it 'displays the page with the appropriate order option' do
      expect(page).to have_select('Option Definition', with_options: ['AST14DMO.3 Order'])
    end

    it 'displays the page with the appropriate service' do
      expect(page).to have_select('Service', with_options: ['AIRX3STD-8102-1.4'])
    end

    it 'displays the collections in the chooser with entry id that includes version' do
      within '#collectionsChooser' do
        expect(page).to have_select('collectionsChooser_fromList', with_options: ["lorem_223 | ipsum", "ID_1 | Mark's Test", "Matthew'sTest_2 | Matthew's Test", "testing 02_01 | My testing title 02", "testing 03_002 | Test test title 03", "New Testy Test_02 | Testy long entry title"])
      end
    end
  end
end
