describe 'Bulk Updates headers' do
  before do
    login
  end

  context 'when viewing the header' do
    context 'when viewing the bulk update search page' do
      before do
        visit new_bulk_updates_search_path
      end

      it 'has "Manage Collections" as the underlined current header link' do
        within 'main header' do
          expect(page).to have_css('h2.current', text: 'Manage Collections')
        end
      end
    end

    context 'when viewing the bulk updates index page' do
      before do
        visit bulk_updates_path
      end

      it 'has "Manage Collections" as the underlined current header link' do
        within 'main header' do
          expect(page).to have_css('h2.current', text: 'Manage Collections')
        end
      end
    end
  end
end
