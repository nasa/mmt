# MMT-43 MMT-44

require 'rails_helper'

describe 'Downloading Draft XML', js: true do
  draft_id = 1

  context 'when viewing the collection preview page' do
    before do
      login
      draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
      draft_id = draft.id
      visit draft_path(draft)
    end

    context 'when clicking Download XML' do
      before do
        click_on 'Download XML'
      end

      it 'shows the download selections' do
        link = "/drafts/#{draft_id}/download"
        expect(page).to have_link('DIF 9', href: "#{link}.dif")
        expect(page).to have_link('DIF 10', href: "#{link}.dif10")
        expect(page).to have_link('ECHO 10', href: "#{link}.echo10")
        expect(page).to have_link('ISO 19115 (MENDS)', href: "#{link}.iso19115")
        expect(page).to have_link('ISO 19115 (SMAP)', href: "#{link}.iso_smap")
      end

      context 'when clicking on a download link' do
        # TODO not sure how to test this
        it 'downloads metadata in the correct format'
      end
    end
  end
end
