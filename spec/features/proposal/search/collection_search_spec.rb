describe 'Searching for published collections in proposal mode', js: true do
  short_name = "Search Proposal Mode Collection short name #{Faker::Number.number(digits: 6)}"
  entry_title = "Long title for Search Proposal Mode Collection #{Faker::Number.number(digits: 6)}"
  provider = 'MMT_2'

  before :all do
    @ingest_response, @concept_response = publish_collection_draft(short_name: short_name, entry_title: entry_title)
  end

  before do
    set_as_proposal_mode_mmt(with_required_acl: true)
    login
    visit manage_collection_proposals_path
  end

  context 'when searching for a specific collection' do
    before do
      fill_in 'keyword', with: short_name
      click_on 'Search Collections'
    end

    it 'displays the search results table with the correct columns' do
      within '#search-results thead tr' do
        expect(page).to have_content('Short Name')
        expect(page).to have_content('Entry Title')
        expect(page).to have_content('Provider')
        expect(page).to have_content('Last Modified')

        expect(page).to have_no_content('Version')
        expect(page).to have_no_content('Granule Count')
      end
    end

    it 'displays the search results' do
      expect(page).to have_content('1 Collection Result')
      expect(page).to have_content('Showing 1 collection')

      within '#search-results tbody tr:nth-child(1)' do
        expect(page).to have_content(short_name)
        expect(page).to have_content(entry_title)
        expect(page).to have_content(provider)
        expect(page).to have_content(today_string)
      end
    end

    context 'when viewing the collection' do
      before do
        click_on short_name
      end

      context 'when clicking the Available Formats download link' do
        before do
          click_on 'Available Formats'
        end

        it 'shows the download selections' do
          expect(page).to have_link('ATOM', href: download_collection_xml_path(@ingest_response['concept-id'], 'atom'))
          expect(page).to have_link('ECHO 10', href: download_collection_xml_path(@ingest_response['concept-id'], 'echo10'))
          expect(page).to have_link('ISO 19115 (MENDS)', href: download_collection_xml_path(@ingest_response['concept-id'], 'iso19115'))
          expect(page).to have_link('ISO 19115 (SMAP)', href: download_collection_xml_path(@ingest_response['concept-id'], 'iso-smap'))
          expect(page).to have_link('DIF 10', href: download_collection_xml_path(@ingest_response['concept-id'], 'dif10'))
        end

        context 'when trying to download data' do
          before do
            @file = "#{Rails.root}/#{@ingest_response['concept-id']}.echo10"
            click_on 'ECHO 10'

            # Seems to need a brief (>0.1) pause to actually find the file.
            sleep(1)
          end

          after do
            FileUtils.rm @file if File.exist?(@file)
          end

          it 'downloads the file' do
            expect(File.exist?(@file))
          end
        end
      end

      it 'displays the collection preview page' do
        within '#collection-general-overview' do
          expect(page).to have_content("Short Name: #{short_name}", normalize_ws: true)
          expect(page).to have_content(entry_title)
        end

        within '#collection-preview-tabs' do
          expect(page).to have_content('Overview')
          expect(page).to have_content('Download Data')
          expect(page).to have_content('Citation Information')
          expect(page).to have_content('Documentation')
          expect(page).to have_content('Additional Information')
        end
      end

      it 'does not display the actions for collections in MMT proper' do
        within '.action' do
          expect(page).to have_no_link('Edit Collection Record')
          expect(page).to have_no_link('Clone Collection Record')
          expect(page).to have_no_link('Delete Collection Record')
          expect(page).to have_no_link('Revisions (1)')
          expect(page).to have_no_link('Granules (0)')
          expect(page).to have_no_link('Save as Template')
        end
      end
    end
  end
end
