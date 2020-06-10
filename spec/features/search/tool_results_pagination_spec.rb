# If there is an issue where the tests start failing locally and the screenshots
# show "Error: Concept with concept-id [id] and revision-id [id] does not exist."
# this is because the MMT_2 provider was deleted while it had tools. Restart CMR
# and rerun the test. This comment should be removed when provider reset works.
describe 'Search Tools Results Pagination', js: true do
  before :all do
    # TODO: Saving off the native ids and manually deleting them can be removed
    # when the provider reset works properly.
    @native_ids = []
    5.times do |i|
      _ingest_response, _search_response, @native_ids[@native_ids.count] = publish_tool_draft(name: "nasa.tool.00#{i}")
    end

    30.times do |i|
      _ingest_response, _search_response, @native_ids[@native_ids.count] = publish_tool_draft(name: "test.00#{i}") 
    end
  end

  before do
    login
    visit manage_tools_path
  end

  after :all do
    @native_ids.each do |native_id|
      delete_response = cmr_client.delete_tool('MMT_2', native_id, 'token')

      raise unless delete_response.success?
    end
  end

  context 'when viewing tool search results with multiple pages' do
    before do
      click_on 'Search Tools'
    end

    it 'displays pagination links' do
      within '.eui-pagination' do
        expect(page).to have_css('a', text: 'First')
        expect(page).to have_css('a', text: '1')
        expect(page).to have_css('a', text: '2')
        expect(page).to have_css('a', text: 'Last')
      end
    end

    context 'when clicking on the next link' do
      before do
        click_on 'Next Page'
      end

      it 'displays the next page' do
        expect(page).to have_css('.active-page', text: '2')
      end
    end

    context 'when clicking on the previous link' do
      before do
        click_on 'Next Page'

        expect(page).to have_css('.active-page', text: '2')

        click_on 'Previous Page'
      end

      it 'displays the previous page' do
        expect(page).to have_css('.active-page', text: '1')
      end
    end

    context 'when clicking on the first page link' do
      before do
        click_on 'Next Page'

        expect(page).to have_css('.active-page', text: '2')

        click_on 'First Page'
      end

      it 'displays the first page' do
        expect(page).to have_css('.active-page', text: '1')
      end

      it 'does not display the previous page link' do
        expect(page).to have_no_css('a', text: 'Previous')
      end
    end

    context 'when clicking on the last page link' do
      before do
        click_on 'Last Page'
      end

      it 'displays the last page' do
        # Second to last li is the last page
        within '.eui-pagination li:nth-last-child(2)' do
          expect(page).to have_css('.active-page')
        end
      end

      it 'does not display the next page link' do
        within '.eui-pagination' do
          expect(page).to have_no_css('a', text: 'Next')
        end
      end
    end

    context 'when clicking on a specific page link' do
      before do
        click_on 'Page 2'
      end

      it 'displays the chosen page' do
        expect(page).to have_css('.active-page', text: '2')
      end
    end
  end

  context 'when viewing tool search results with only one page' do
    before do
      fill_in 'keyword', with: 'nasa.tool'
      click_on 'Search Tool'
    end

    it 'does not display pagination links' do
      expect(page).to have_no_css('.eui-pagination li a', text: 'First')
      expect(page).to have_no_css('.eui-pagination li a', text: '1')
    end
  end
end
