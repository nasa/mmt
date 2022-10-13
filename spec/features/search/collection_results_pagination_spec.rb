describe 'Collection Search Results Pagination', js: true do
  before do
    login
    VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
      visit manage_collections_path
    end
  end

  context 'when viewing collection search results with multiple pages' do
    before do
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
        click_on 'Search Collections'
      end
    end

    it 'displays pagination links' do
      within '.eui-pagination' do
        expect(page).to have_css('a', text: 'First')
        expect(page).to have_css('a', text: '1')
        expect(page).to have_css('a', text: '2')
        expect(page).to have_css('a', text: '3')
        expect(page).to have_css('a', text: 'Last')
      end
    end

    context 'when clicking on the next link' do
      before do
        # click next link
        VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
          click_on 'Next Page'
        end
      end

      it 'displays the next page' do
        expect(page).to have_css('.active-page', text: '2')
      end
    end

    context 'when clicking on the previous link' do
      before do
        # click next link
        VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
          click_on 'Next Page'
        end
        # assert page 2 visible
        expect(page).to have_css('.active-page', text: '2')
        # click previous link
        VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
          click_on 'Previous Page'
        end
      end

      it 'displays the previous page' do
        expect(page).to have_css('.active-page', text: '1')
      end
    end

    context 'when clicking on the first page link' do
      before do
        # click next link
        VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
          click_on 'Next Page'
        end
        # assert page 2 visible
        expect(page).to have_css('.active-page', text: '2')
        # click first page link
        VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
          click_on 'First Page'
        end
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
        # click last page link
        VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
          click_on 'Last Page'
        end
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
        # click page 2 link
        VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
          click_on 'Page 2'
        end
      end

      it 'displays the new page' do
        expect(page).to have_css('.active-page', text: '2')
      end
    end
  end

  context 'when viewing collection search results with only one page' do
    before do
      fill_in 'keyword', with: 'DEM_100M_1'
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
        click_on 'Search Collections'
      end
    end

    it 'does not display pagination links' do
      expect(page).to have_no_css('a', text: 'First')
      expect(page).to have_no_css('a', text: '1')
    end
  end
end
