# MMT-596 / MMT-599

require 'rails_helper'

describe 'Viewing and Creating Order Option Assignments' do
  before do
    collections_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/cmr_search.json'))))
    allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).and_return(collections_response)

    login

    visit order_option_assignments_path

    wait_for_ajax
  end

  context 'When trying to display option assignments without selecting any collections', js: true do
    before do
      click_on 'Display Assignments'
    end

    it 'displays validation errors within the form' do
      expect(page).to have_content('You must select at least 1 collection.')
    end
  end

  context 'When displaying option assignments', js: true do
    before do
      within '#collectionsChooser' do
        select('lorem_223 | ipsum', from: 'Available Collections')

        within '.button-container' do
          find('button[title=add]').click
        end
      end

      VCR.use_cassette('echo_rest/order_option_assignments/display', record: :none) do
        click_on 'Display Assignments'
      end
    end

    it 'Displays the selected collections and their assigned Order Option definition names' do
      expect(page).to have_content('Include selected collections with no assigned options?')

      within('#collections-table tbody') do
        expect(page).to have_content '1001 V5'
        expect(page).to have_content 'Test Order Option 1'
        expect(page).to have_content '1001 - UPDATE'
        expect(page).to have_content 'James-1'
        expect(page).to have_content 'JAMES-2000'
        expect(page).to have_content 'James-1004'
        expect(page).to have_content '1003'
        expect(page).to have_content 'James-2007'
        expect(page).to have_content 'Opt A02'
      end
    end
  end

  context 'When sorting option assignments', js: true do
    before do
      within '#collectionsChooser' do
        page.all(:xpath, "//select[@id='collectionsChooser_fromList']/option").each do |e|
          select(e.text, from: 'Available Collections')
        end

        within '.button-container' do
          find('button[title=add]').click
        end
      end

      VCR.use_cassette('echo_rest/order_option_assignments/display-sort', record: :none) do
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
          expect(last_cell).to have_content 'Opt A07'
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
          expect(first_cell).to have_content 'Opt A07'
          expect(last_cell).to have_content ''
        end
      end
    end
  end

  context 'When attempting to make an option assignment without selecting any collections', js: true do
    before do
      VCR.use_cassette('echo_rest/order_option_assignments/display', record: :none) do
        visit new_order_option_assignment_path
      end

      click_on 'Submit'
    end

    it 'Displays an error message and does not submit the form' do
      expect(page).to have_content('You must select at least 1 collection.')
    end
  end

  context 'When creating an option assignment with a deprecated order option', js: true do
    before do
      VCR.use_cassette('echo_rest/order_option_assignments/display', record: :none) do
        visit new_order_option_assignment_path
      end

      within '#collectionsChooser' do
        select('lorem_223 | ipsum', from: 'Available Collections')

        within '.button-container' do
          find('button[title=add]').click
        end
      end

      select 'Opt A02', from: 'Option Definition'

      VCR.use_cassette('echo_rest/order_option_assignments/create-error', record: :none) do
        click_on 'Submit'
      end
    end

    it 'Displays an error message' do
      expect(page).to have_content('1 Order Option assignment failed to save.')
    end
  end

  context 'When successfully creating an option assignment', js: true do
    before do
      VCR.use_cassette('echo_rest/order_option_assignments/display', record: :none) do
        visit new_order_option_assignment_path
      end

      within '#collectionsChooser' do
        select('lorem_223 | ipsum', from: 'Available Collections')

        within '.button-container' do
          find('button[title=add]').click
        end
      end

      select 'Opt A04', from: 'Option Definition'

      VCR.use_cassette('echo_rest/order_option_assignments/create-success', record: :none) do
        click_on 'Submit'
      end
    end

    it 'Displays a success message' do
      expect(page).to have_content('1 Order Option assignment created successfully. ')
    end
  end

  context 'when viewing the create option assignment page when the provider only has one order option', js: true do
    before do
      VCR.use_cassette('echo_soap/data_management_service/option_definitions/single_list', record: :none) do
        visit new_order_option_assignment_path
      end
    end

    it 'displays the page with the appropriate order option' do
      expect(page).to have_select('Option Definition', with_options: ['MYD14.005'])
    end

    it 'displays the collections in the chooser with entry id that includes version' do
      within '#collectionsChooser' do
        expect(page).to have_select('collectionsChooser_fromList', with_options: ["lorem_223 | ipsum", "ID_1 | Mark's Test", "Matthew'sTest_2 | Matthew's Test", "testing 02_01 | My testing title 02", "testing 03_002 | Test test title 03", "New Testy Test_02 | Testy long entry title"])
      end
    end
  end
end
