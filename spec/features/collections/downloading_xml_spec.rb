# MMT-43 MMT-44

require 'rails_helper'

describe 'Downloading Collection XML', js: true do
  concept_id = 'C1200000000-LARC'

  context 'when viewing the collection preview page' do
    before do
      login
      visit collection_path(concept_id)
    end

    context 'when clicking Download XML' do
      before do
        click_on 'Download XML'
      end

      it 'shows the download selections' do
        link = "http://localhost:3003/concepts/#{concept_id}"
        expect(page).to have_link('Native', href: link)
        expect(page).to have_link('ATOM', href: "#{link}.atom")
        expect(page).to have_link('ECHO 10', href: "#{link}.echo10")
        expect(page).to have_link('ISO 19115 (MENDS)', href: "#{link}.iso")
        expect(page).to have_link('ISO 19115 (SMAP)', href: "#{link}.iso_smap")
        expect(page).to have_link('DIF 9', href: "#{link}.dif")
        expect(page).to have_link('DIF 10', href: "#{link}.dif10")
      end
    end
  end
end
