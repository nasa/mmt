describe 'Collection Template headers and breadcrumbs' do
  before do
    login
  end

  context 'when viewing the index page' do
    before do
      visit collection_templates_path
    end

    it 'displays Collection Templates within breadcrumbs' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Collection Templates')
      end
    end

    it 'has "Manage Collections" as the underlined current header link' do
      within 'main header' do
        expect(page).to have_css('h2.current', text: 'Manage Collections')
      end
    end
  end
end
