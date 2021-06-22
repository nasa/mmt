describe 'Search Services Results Pagination', reset_provider: true, js: true do
  before :all do
    5.times { |i| publish_service_draft(name: "nasa.service.00#{i}") }

    30.times { |i| publish_service_draft(name: "test.00#{i}") }
  end

  before do
    login
    visit manage_services_path
  end

  context 'when viewing service search results with multiple pages' do
    before do
      click_on 'Search Services'
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

  context 'when viewing service search results with only one page' do
    before do
      fill_in 'keyword', with: 'nasa.service'
      click_on 'Search Services'
    end

    it 'does not display pagination links' do
      expect(page).to have_no_css('.eui-pagination li a', text: 'First')
      expect(page).to have_no_css('.eui-pagination li a', text: '1')
    end
  end
end
