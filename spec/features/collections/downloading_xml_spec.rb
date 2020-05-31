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
        expect(page).to have_link('ATOM', href: download_collection_xml_path(@concept_id, 'atom'))
        expect(page).to have_link('ECHO 10', href: download_collection_xml_path(@concept_id, 'echo10'))
        expect(page).to have_link('ISO 19115 (MENDS)', href: download_collection_xml_path(@concept_id, 'iso19115'))
        expect(page).to have_link('ISO 19115 (SMAP)', href: download_collection_xml_path(@concept_id, 'iso-smap'))
        expect(page).to have_link('DIF 10', href: download_collection_xml_path(@concept_id, 'dif10'))
      end

      context 'when trying to download data' do
        before do
          @file = "#{Rails.root}/#{@concept_id}.echo10"
          click_on 'ECHO 10'
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

  context 'when viewing the collection preview page for an iso-smap collection' do
    before do
      login
      visit manage_collections_path
      
      short_name = 'SPL4SMAU'
      fill_in 'keyword', with: short_name
      click_on 'Search Collections'
      expect(page).to have_content(short_name)

      click_on short_name
      @concept_id = current_path.split('/').last
    end

    context 'when clicking the Available Formats download link' do
      before do
        click_on 'Available Formats'
      end

      it 'shows the download selections' do
        expect(page).to have_link('ISO 19115 (SMAP) (Native)', href: download_collection_xml_path(@concept_id, 'iso-smap'))
        expect(page).to have_link('ATOM', href: download_collection_xml_path(@concept_id, 'atom'))
        expect(page).to have_link('ECHO 10', href: download_collection_xml_path(@concept_id, 'echo10'))
        expect(page).to have_link('ISO 19115 (MENDS)', href: download_collection_xml_path(@concept_id, 'iso19115'))
        expect(page).to have_link('DIF 10', href: download_collection_xml_path(@concept_id, 'dif10'))
      end

      it 'shows "ISO 19115 (SMAP) (Native)" before all the other formats' do
        expect(page).to have_content('ISO 19115 (SMAP) (Native) | ATOM | DIF 10 | ECHO 10 | ISO 19115 (MENDS)')
      end

      context 'when trying to download data' do
        before do
          @file = "#{Rails.root}/#{@concept_id}.iso-smap"
          click_on 'ISO 19115 (SMAP) (Native)'
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
