
describe 'loss report modal', js: true do
  # this is an echo collection (SEDAC provider)
  let(:cmr_response) { cmr_client.get_collections({'EntryTitle': 'Anthropogenic Biomes of the World, Version 2: 1700'}) }
  let(:concept_id) { cmr_response.body.dig('items',0,'meta','concept-id') }

  context 'when user clicks Edit Collection Record for a non-UMM collection' do
    context 'when provider context does not need to be changed' do

      before do
        login(provider: 'SEDAC', providers: %w[SEDAC])
        visit collection_path(concept_id)
        click_on 'Edit Collection Record'
      end

      it 'displays the loss-report-modal with correct links' do
        within '#loss-report-modal' do
          expect(page).to have_content("The native format of this collection is ECHO10. Editing this record using the MMT will convert it to UMM-JSON, which may result in data loss. Select 'View Loss Report' to see how the conversion will affect this record.")
          expect(page).to have_link('View Loss Report', href: loss_report_collections_path(concept_id, format: 'json'))
          expect(page).to have_link('Edit Collection', href: edit_collection_path(id: concept_id))
          expect(page).to have_link('Cancel', href: 'javascript:void(0);')
        end
      end

      context 'when the "Edit Collection" button is clicked' do
        before do
          within '#loss-report-modal' do
            click_on 'Edit Collection'
          end
        end
        it 'opens collection draft without displaying the not-current-provider-modal' do
          expect(page).to have_content('Metadata Fields')
          expect(page).to have_content('Collection Information')
          expect(page).to have_content('Acquisition Information')
          expect(page).to have_content('Data Contacts')
          expect(page).to have_content('Metadata Information')
          expect(page).to have_no_css('#not-current-provider-modal')
        end
      end

      context 'when the "View Loss Report" button is clicked' do
        before do
          within '#loss-report-modal' do
            click_on 'View Loss Report'
          end
        end
        it 'does not close the loss-report-modal and does not open the not-current-provider-modal' do
          expect(page).to have_no_css('#not-current-provider-modal')
          within '#loss-report-modal' do
            expect(page).to have_content("The native format of this collection is ECHO10. Editing this record using the MMT will convert it to UMM-JSON, which may result in data loss. Select 'View Loss Report' to see how the conversion will affect this record.")
          end
        end
      end

      context 'when the "Cancel" button is clicked' do
        before do
          within '#loss-report-modal' do
            click_on 'Cancel'
          end
        end
        it 'closes loss-report-modal and does not display the not-current-provider-modal' do
          expect(page).to have_no_content('Metadata Preview')
          expect(page).to have_link('Edit Collection Record', href: '#loss-report-modal')
          expect(page).to have_no_css('#not-current-provider-modal')
          expect(page).to have_no_css('#loss-report-modal')
        end
      end
    end

    context 'when provider context needs to be changed and the required provider context is available' do

      before do
        login(provider: 'LARC', providers: %w[SEDAC LARC])
        visit collection_path(concept_id)
        click_on 'Edit Collection Record'
      end

      it 'displays the loss-report-modal with correct links' do
        within '#loss-report-modal' do
          expect(page).to have_content("The native format of this collection is ECHO10. Editing this record using the MMT will convert it to UMM-JSON, which may result in data loss. Select 'View Loss Report' to see how the conversion will affect this record.")
          expect(page).to have_link('View Loss Report', href: loss_report_collections_path(concept_id, format: 'json'))
          expect(page).to have_link('Edit Collection', href: '#')
          expect(page).to have_link('Cancel', href: 'javascript:void(0);')
        end
      end

      context 'when the "Edit Collection" button is clicked' do
        before do
          within '#loss-report-modal' do
            click_on 'Edit Collection'
          end
        end
        it 'closes loss-report-modal and opens the not-current-provider-modal' do
          expect(page).to have_no_css('#loss-report-modal')
          within '#not-current-provider-modal' do
            expect(page).to have_link('Yes', href: '#')
            expect(page).to have_link('No', href: 'javascript:void(0)')
          end
        end
      end

      context 'when the "View Loss Report" button is clicked' do
        before do
          within '#loss-report-modal' do
            click_on 'View Loss Report'
          end
        end
        it 'does not close the loss-report-modal and does not open the not-current-provider-modal' do
          expect(page).to have_content("The native format of this collection is ECHO10. Editing this record using the MMT will convert it to UMM-JSON, which may result in data loss. Select 'View Loss Report' to see how the conversion will affect this record.")
          expect(page).to have_no_css('#not-current-provider-modal')
        end
      end

      context 'when the "Cancel" button is clicked' do
        before do
          within '#loss-report-modal' do
            click_on 'Cancel'
          end
        end
        it 'closes loss-report-modal and does not open the not-current-provider-modal' do
          expect(page).to have_no_css('#not-current-provider-modal')
          expect(page).to have_no_css('#loss-report-modal')
        end
      end
    end
  end
end
