require 'rails_helper'

describe 'Collection drafts breadcrumbs' do
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
  end

  context 'when viewing a collection draft with a short name' do
    before do
      @draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first)
      visit collection_draft_path(@draft)
    end

    it 'displays the short name' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Collection Drafts')
        expect(page).to have_content(@draft.draft['ShortName'])
      end
    end
  end
end
