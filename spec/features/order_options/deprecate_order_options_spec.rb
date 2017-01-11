# MMT-595

require 'rails_helper'

describe 'Deprecating Order Options' do
  context 'when viewing the index page', js: true do
    before do
      login

      VCR.use_cassette('echo_rest/order_options/list_deprecated', record: :none) do
        visit order_options_path
      end
    end

    it 'lists available order options with \'Deprecate\' links.' do
        page.all('.order-options-table tr') do |tr|
          within tr do
            expect(tr).to have_link 'Deprecate'
          end
        end
    end

    context 'When clicking on a Deprecate link, it asks for confirmation before deprecating.' do
      before do

        within '.order-options-table tbody tr:first-child' do
          click_on 'Deprecate'
        end
      end

      it 'Asks for confirmation before deprecating' do
        cell_text = find('.order-options-table tbody tr:first-child td:first-child').text

        expect(page).to have_selector('#deprecate-option-modal-0', visible: true)

        expect(page).to have_content("Are you sure you want to deprecate the order option named '#{cell_text}'?")
        expect(page).to have_link('No')
        expect(page).to have_link('Yes')
      end

    end


    context 'When clicking the No button on the confirmation dialog, it does not deprecate the order option.' do
      before do

        VCR.use_cassette('echo_rest/order_options/list', record: :none) do
          visit order_options_path
        end

        within '.order-options-table tbody tr:first-child' do
          click_on 'Deprecate'
        end

        within('#deprecate-option-modal-0') do
          click_on 'No'
        end
      end

      it 'Asks for confirmation before deprecating' do
        expect(page).to have_selector('#deprecate-option-modal-0', visible: false)
      end
    end

    context 'When clicking the Yes button on the confirmation dialog, it deprecates the order option.' do
      before do
        within '.order-options-table tbody tr:last-child' do
          click_on 'Deprecate'
        end

        within('#deprecate-option-modal-24') do
          VCR.use_cassette('echo_rest/order_options/deprecate', record: :none) do
            click_on 'Yes'
          end
        end
      end

      it 'Asks for confirmation before deprecating' do
        expect(page).to have_content('Order Option was successfully deprecated.')
      end
    end

    context 'When trying to deprecate an order option that cannot be deprecated' do

      let(:cell_text) {''}

      before do

        within '.order-options-table tbody tr:first-child' do
          click_on 'Deprecate'
        end

        within('#deprecate-option-modal-0') do
          VCR.use_cassette('echo_rest/order_options/deprecate-fail', record: :none) do
            click_on 'Yes'
          end
        end

        cell_text = find('.order-options-table tbody tr:first-child td:first-child').text

      end

      it 'Displays an error message and lists the order options' do
        expect(page).to have_content('Option definition [C7EB886C-5790-76E0-0E51-D2CFD6985AC6] is already deprecated')
        expect(page).to have_content(cell_text)
      end
    end
  end
end
