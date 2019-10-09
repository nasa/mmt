describe 'Error pages' do
  before do
    allow_any_instance_of(ActionDispatch::Request).to receive(:uuid).and_return(1234567890)
  end

  context '404 Not Found Errors' do
    context 'when visiting a page that does not exist' do
      before do
        # we need to change config settings for this test for the error to be caught and rendered as they would in live environments
        allow(Rails.application).to receive(:env_config).with(no_args()).and_wrap_original do |m, *args|
          m.call.merge(
            'action_dispatch.show_exceptions' => true,
            'action_dispatch.show_detailed_exceptions' => false,
            'consider_all_requests_local' => false
          )
        end

        visit '/asdfasdf'
      end

      it 'displays the approriate 404 page' do
        expect(page).to have_content('404')
        expect(page).to have_content('Resource Not Found')
        expect(page).to have_content('Sorry! The page you were looking for does not exist.')
      end

      it 'displays an error message including the request uuid' do
        expect(page).to have_content('There has been an error processing your request. Please refer to the ID "1234567890" when contacting Earthdata Operations.')
      end
    end

    context 'when visiting the 404 error page directly' do
      before do
        visit '/404'
      end

      it 'displays the approriate 404 error page' do
        expect(page).to have_content('404')
        expect(page).to have_content('Resource Not Found')
        expect(page).to have_content('Sorry! The page you were looking for does not exist.')
      end

      it 'displays an error message including the request uuid' do
        expect(page).to have_content('There has been an error processing your request. Please refer to the ID "1234567890" when contacting Earthdata Operations.')
      end
    end
  end

  context '500 Internal Server Errors' do
    context 'when a page will produce a 500 error', js: true do
      before do
        # we need to change config settings for this test for the error to be caught and rendered as they would in live environments
        allow(Rails.application).to receive(:env_config).with(no_args()).and_wrap_original do |m, *args|
          m.call.merge(
            'action_dispatch.show_exceptions' => true,
            'action_dispatch.show_detailed_exceptions' => false,
            'consider_all_requests_local' => false
          )
        end

        # we need to provide a bad response to trigger a desired error
        bad_search_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: 55))
        allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections).and_return(bad_search_response)

        login
        visit manage_collections_path

        click_on 'Search Collections'
      end

      it 'displays the appropriate 500 error page' do
        expect(page).to have_content('500')
        expect(page).to have_content('Internal Server Error')
        expect(page).to have_content("We're sorry, but something went wrong.")
      end

      it 'displays an error message including the request uuid' do
        expect(page).to have_content('There has been an error processing your request. Please refer to the ID "1234567890" when contacting Earthdata Operations.')
      end
    end

    context 'when visiting the 500 error page directly' do
      before do
        visit '/500'
      end

      it 'displays the appropriate 500 error page' do
        expect(page).to have_content('500')
        expect(page).to have_content('Internal Server Error')
        expect(page).to have_content("We're sorry, but something went wrong.")
      end

      it 'displays an error message including the request uuid' do
        expect(page).to have_content('There has been an error processing your request. Please refer to the ID "1234567890" when contacting Earthdata Operations.')
      end
    end
  end
end
