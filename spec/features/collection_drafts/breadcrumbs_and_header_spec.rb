describe 'Collection drafts breadcrumbs and header' do
  before do
    login
  end

  context 'when viewing a collection draft with no short name' do
    before do
      draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
      visit collection_draft_path(draft)
    end

    it 'displays Blank Short Name' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Collection Drafts')
        expect(page).to have_content('<Blank Short Name>')
      end
    end

    it 'has "Manage Collections" as the underlined current header link' do
      within 'main header' do
        expect(page).to have_css('h2.current', text: 'Manage Collections')
      end
    end
  end

  context 'when viewing a collection draft with a short name' do
    before do
      @draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first)
      visit collection_draft_path(@draft)
    end

    it 'displays the short name within breadcrumbs' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Collection Drafts')
        expect(page).to have_content(@draft.draft['ShortName'])
      end
    end

    it 'has "Manage Collections" as the underlined current header link' do
      within 'main header' do
        expect(page).to have_css('h2.current', text: 'Manage Collections')
      end
    end
  end
end
