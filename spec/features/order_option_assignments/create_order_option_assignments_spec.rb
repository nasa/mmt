# MMT-596 / MMT-599

require 'rails_helper'

describe 'Viewing and Creating Order Option Assignments' do
  before do
    collections_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/cmr_search.json'))))
    allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections).and_return(collections_response)

    login

    User.first.update(provider_id: 'MMT_2')
    visit order_option_assignments_path
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
      collections_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/cmr_search.json'))))
      allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections).and_return(collections_response)

      within '#collectionsChooser' do
        select('lorem | ipsum', from: 'Available Collections')

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

  context 'When creating an option assignemnt with a deprecated order option', js: true do
    before do
      VCR.use_cassette('echo_rest/order_option_assignments/display', record: :none) do
        visit new_order_option_assignment_path
      end

      within '#collectionsChooser' do
        select('lorem | ipsum', from: 'Available Collections')

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

  context 'When successfully creating an option assignemnt', js: true do
    before do
      VCR.use_cassette('echo_rest/order_option_assignments/display', record: :none) do
        visit new_order_option_assignment_path
      end

      within '#collectionsChooser' do
        select('lorem | ipsum', from: 'Available Collections')

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
end
