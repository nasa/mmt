require 'rails_helper'

describe 'CMR Response as HTML page', js: true do
  context 'when a CMR request returns a 500 error with an HTML body' do
    before do
      login
      draft = create(:full_collection_draft)
      visit collection_draft_path(draft)

      # Adding question marks to token causes a 500 error for now
      bad_response = { 'Echo-Token' => '???' }
      allow_any_instance_of(Cmr::BaseClient).to receive(:token_header).and_return(bad_response)

      # Record the request so we can keep testing for 500 errors
      VCR.configure do |c|
        c.ignore_localhost = false
      end

      VCR.use_cassette('ingest/500_html', record: :none) do
        click_on 'Publish'
      end

      VCR.configure do |c|
        c.ignore_localhost = true
      end
    end

    it 'displays a generic error message' do
      expect(page).to have_content('This draft is not ready to be published. Please use the progress indicators on the draft preview page to address incomplete or invalid fields.')
    end
  end
end
