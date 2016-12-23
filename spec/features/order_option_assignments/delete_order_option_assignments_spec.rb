# MMT-597

require 'rails_helper'

describe 'Deleting Order Option Assignments' do


  before do
    collections_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/cmr_search.json'))))
    allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections).and_return(collections_response)

    login

    User.first.update(provider_id: 'MMT_2')
    visit order_option_assignments_path
  end

  context 'When trying to delete option assignments without selecting any collections', js: true do

    before do
      click_on 'Delete Option Assignments'
    end

    it 'displays validation errors within the form' do
      expect(page).to have_content('Please select at least one collection')
    end
  end


  # --- Deleting ALL for selected collections ---
  context 'When successfully deleting all option assignments for a selected collection', js: true do

    before do
      VCR.use_cassette('echo_rest/order_option_assignments/display', record: :none) do
        visit order_option_assignments_path
      end

      within '#collectionsChooser' do
        select('lorem | ipsum', from: 'Available collections')

        within ".button-container" do
          find('button[title=add]').click
        end
      end

      click_on 'Delete Option Assignments'

    end

    it 'Asks for confirmation before deleting' do
      expect(page).to have_content('Are you sure you want to delete all of the order option assignments for the selected collections?')
    end

    context 'When declining the confirmation dialog', js: true do
      before do
        click_on 'No'
      end

      it 'Closes the dialog and does not delete the order option assignments' do
        expect(page).to have_content('Option Assignment Search')
      end
    end


    context 'When accepting the confirmation dialog', js: true do
      before do
        VCR.use_cassette('echo_rest/order_option_assignments/delete', record: :none) do
          click_on 'Yes'
        end

      end

      it 'Submits the form and displays a success message.' do
        expect(page).to have_content('Deleted 2 order option assignments successfully. ')
      end
    end
  end




  # --- Deleting selected option assignments from the edit page ---
  context 'When successfully deleting all option assignments for a selected collection', js: true do

    before do
      VCR.use_cassette('echo_rest/order_option_assignments/display') do
        visit order_option_assignments_path
      end

      within '#collectionsChooser' do
        select('lorem | ipsum', from: 'Available collections')

        within ".button-container" do
          find('button[title=add]').click
        end
      end

      VCR.use_cassette('echo_rest/order_option_assignments/display2', record: :none) do
        click_on 'Display Assignments'
      end

      find('#collections-table tbody tr:first-child td:first-child input[type=checkbox]').click

      VCR.use_cassette('echo_rest/order_option_assignments/delete2', record: :none) do
        click_on 'Delete Selected Assignments'
      end

    end

    it 'Displays a success message and navigates to the Option Assignment Search page.' do
      expect(page).to have_content('Deleted 1 order option assignment successfully. ')
      expect(page).to have_content('Option Assignment Search')
    end
  end
end
