
# need to make sure the change current provider modal specs don't fail
describe 'loss report modal', js: true do
  # this is an echo collection (SEDAC provider)
  let(:cmr_response) { cmr_client.get_collections({'EntryTitle': 'Anthropogenic Biomes of the World, Version 2: 1700'}) }
  let(:concept_id) { cmr_response.body.dig('items',0,'meta','concept-id') }

  context 'when user clicks Edit Collection Record for a non-UMM collection' do
    context 'when provider context does not need to be changed' do

      before do
        login(provider: 'SEDAC', providers: %w[SEDAC LARC])
        visit collection_path(concept_id)
        click_on 'Edit Collection Record'
      end

      it 'displays the loss-report-modal' do
        within '#loss-report-modal' do
          expect(page).to have_link('Yes', href: loss_report_collections_path(concept_id, format: 'json'))
          expect(page).to have_link('No', href: edit_collection_path(id: concept_id))
        end
      end

      context 'when the "No" button is clicked' do
        it 'does not display the not-current-provider-modal' do
          within '#loss-report-modal' do
            click_on 'No'
          end

          expect(page).to have_no_css('#not-current-provider-modal')
        end
      end

      context 'when the "Yes" button is clicked' do
        it 'does not display display the not-current-provider-modal' do
          within '#loss-report-modal' do
            click_on 'Yes'
          end

          expect(page).to have_no_css('#not-current-provider-modal')
        end
      end
    end

    context 'when provider context needs to be changed and the required provider context is available' do

      before do
        login(provider: 'LARC', providers: %w[SEDAC LARC])
        visit collection_path(concept_id)
        click_on 'Edit Collection Record'
      end

      it 'displays the loss-report-modal' do
        within '#loss-report-modal' do
          expect(page).to have_link('Yes', href: loss_report_collections_path(concept_id, format: 'json'))
          expect(page).to have_link('No', href: '#')
        end
      end

      context 'when the "No" button is clicked' do
        it 'displays the not-current-provider-modal' do
          within '#loss-report-modal' do
            click_on 'No'
          end

          expect(page).to have_css('#not-current-provider-modal')

          within '#not-current-provider-modal' do
            expect(page).to have_link('Yes', href: '#')
            expect(page).to have_link('No', href: 'javascript:void(0)')
          end
        end
      end

      context 'when the "Yes" button is clicked' do
        it 'displays the not-current-provider-modal' do
          within '#loss-report-modal' do
            click_on 'Yes'
          end

          expect(page).to have_css('#not-current-provider-modal')

          within '#not-current-provider-modal' do
            expect(page).to have_link('Yes', href: '#')
            expect(page).to have_link('No', href: 'javascript:void(0)')
          end
        end
      end

    end
  end
end
