describe 'Downloading Collection XML', js: true do
  context 'when viewing the collection preview page' do
    before do
      login

      ingest_response, _concept_response = publish_collection_draft

      @concept_id = ingest_response['concept-id']
      visit collection_path(@concept_id)
    end

    context 'when clicking the Available Formats download link' do
      before do
        click_on 'Available Formats'
      end

      it 'shows the download selections' do
        expect(page).to have_link('NATIVE', href: download_collection_xml_path(@concept_id, 'native'))
        expect(page).to have_link('ATOM', href: download_collection_xml_path(@concept_id, 'atom'))
        expect(page).to have_link('ECHO 10', href: download_collection_xml_path(@concept_id, 'echo10'))
        expect(page).to have_link('ISO 19115 (MENDS)', href: download_collection_xml_path(@concept_id, 'iso'))
        expect(page).to have_link('ISO 19115 (SMAP)', href: download_collection_xml_path(@concept_id, 'iso19115'))
        expect(page).to have_link('DIF 9', href: download_collection_xml_path(@concept_id, 'dif'))
        expect(page).to have_link('DIF 10', href: download_collection_xml_path(@concept_id, 'dif10'))
      end

      context 'when trying to download data' do
        before do
          @file = "#{Rails.root}/#{@concept_id}.native"
          click_on 'NATIVE'
        end

        after do
          # Seems to need a brief (>0.01) pause to actually find the file.
          sleep(0.1)
          FileUtils.rm @file if File.exist?(@file)
        end

        it 'downloads the file' do
          expect(File.exist?(@file))
        end
      end
    end
  end
end
