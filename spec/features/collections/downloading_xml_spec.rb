# MMT-43 MMT-44

require 'rails_helper'

describe 'Downloading Collection XML', js: true do
  context 'when viewing the collection preview page' do
    before do
      login

      ingest_response, _concept_response = publish_collection_draft

      @concept_id = ingest_response['concept-id']
      visit collection_path(@concept_id)
    end

    context 'when clicking Download XML' do
      before do
        click_on 'Download XML'
      end

      it 'shows the download selections' do
        link = "http://localhost:3003/concepts/#{@concept_id}"
        token = 'access_token:81FEem91NlTQreWv2UgtXQ'

        expect(page).to have_link('Native', href: "#{link}.native?token=#{token}")
        expect(page).to have_link('ATOM', href: "#{link}.atom?token=#{token}")
        expect(page).to have_link('ECHO 10', href: "#{link}.echo10?token=#{token}")
        expect(page).to have_link('ISO 19115 (MENDS)', href: "#{link}.iso?token=#{token}")
        expect(page).to have_link('ISO 19115 (SMAP)', href: "#{link}.iso_smap?token=#{token}")
        expect(page).to have_link('DIF 9', href: "#{link}.dif?token=#{token}")
        expect(page).to have_link('DIF 10', href: "#{link}.dif10?token=#{token}")
      end
    end
  end
end
