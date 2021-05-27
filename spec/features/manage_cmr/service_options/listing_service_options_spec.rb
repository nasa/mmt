require 'rails_helper'

describe 'Listing Service Options' do
  let(:timeout_error_html_body) { File.read(File.join(Rails.root, 'spec', 'fixtures', 'service_management', 'timeout.html')) }

  context 'when viewing the index page' do
    before do
      login

      VCR.use_cassette('echo_soap/service_management_service/service_options/list', record: :none) do
        visit service_options_path
      end
    end

    it 'lists all the available service options' do
      within '.service-options-table' do
        expect(page).to have_selector('tbody tr', count: 25)
      end
    end

    it 'displays the pagination information header' do
      expect(page).to have_content('Showing Service Options 1 - 25 of 26')
    end

    it 'displays the pagination navigation' do
      within '.eui-pagination' do
        # First, 1, 2, Next, Last
        expect(page).to have_selector('li', count: 5)
      end
    end

    it 'shows the correct active page' do
      expect(page).to have_css('.active-page', text: '1')
    end

    it 'sorts the list correctly' do
      # First row
      within '.service-options-table tbody tr:nth-child(1)' do
        within 'td:nth-child(1)' do
          expect(page).to have_content('Bibendum Mollis Lorem Elit Condimentum')
        end
        within 'td:nth-child(2)' do
          expect(page).to have_content('Tuesday, January 17, 2017 at 6:34 pm')
        end
      end

      # Last row
      within '.service-options-table tbody tr:last-child' do
        within 'td:nth-child(1)' do
          expect(page).to have_content('Tristique Vulputate Sem Magna')
        end
        within 'td:nth-child(2)' do
          expect(page).to have_content('Tuesday, January 17, 2017 at 5:06 pm')
        end
      end
    end

    context 'when clicking through to the second page' do
      before do
        VCR.use_cassette('echo_soap/service_management_service/service_options/list', record: :none) do
          within '.eui-pagination li:nth-child(3)' do
            click_link '2'
          end
        end
      end

      it 'displays the pagination information for page two' do
        expect(page).to have_content('Showing Service Option 26 - 26 of 26')
      end

      it 'lists all the available service options' do
        within '.service-options-table' do
          expect(page).to have_selector('tbody tr', count: 1)
        end
      end
    end
  end

  context 'when viewing the index page and there is a timeout error' do
    before do
      login

      # mock a timeout error
      echo_response = echo_fail_response(timeout_error_html_body, status = 504, headers = {'content-type' => 'text/html'})
      allow_any_instance_of(Echo::ServiceManagement).to receive(:get_service_options).and_return(echo_response)

      visit service_options_path
    end

    it 'displays the error' do
      within '.eui-banner--danger.eui-banner__dismiss' do
        expect(page).to have_content('504 ERROR: We are unable to retrieve service options at this time. If this error persists, please contact support@earthdata.nasa.gov for additional support.')
      end
    end
  end
end
