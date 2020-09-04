describe 'Valid Variable Draft Collection Association Preview' do
  let(:draft) { create(:full_variable_draft, user: User.where(urs_uid: 'testuser').first, collection_concept_id: 'C12345-MMT_2') }

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
          expect(page).to have_css('.eui-icon.icon-green.eui-check')
        end
      end
    end

    it 'displays the correct progress indicators for required fields' do
      within '#collection-association-progress .progress-indicators' do
        expect(page).to have_css('.eui-icon.eui-required.icon-green.collection_association')
      end
    end
  end
end
