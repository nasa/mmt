describe 'Empty Variable Draft Collection Association Preview' do
  let(:draft) { create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit variable_draft_path(draft)
  end

  context 'When examining the Collection Association section' do
    it 'displays the form title as an edit link' do
      within '#collection-association-progress' do
        expect(page).to have_link('Collection Association', href: collection_search_variable_draft_path(draft))
      end
    end

    it 'displays the correct status icon' do
      within '#collection-association-progress' do
        within '.status' do
          expect(page).to have_css('.eui-icon.icon-green.eui-fa-circle-o')
        end
      end
    end

    it 'displays the correct progress indicators for required fields' do
      within '#collection-association-progress .progress-indicators' do
        expect(page).to have_css('.eui-icon.eui-required-o.icon-green.collection_association')
      end
    end
  end
end
