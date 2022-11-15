describe 'loss report modal', js: true do
  # this is an echo collection (SEDAC provider)
  context 'when user clicks Edit Collection Record for a non-UMM collection' do
    context 'when provider context does not need to be changed' do
      before do
        VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
          @token = 'jwt_access_token'
          @cmr_response = cmr_client.get_collections({'EntryTitle': 'Global Cyclone Hazard Frequency and Distribution'}, @token)
          @concept_id = @cmr_response.body.dig('items',0,'meta','concept-id')
          login(provider: 'SEDAC', providers: %w[SEDAC])
          allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
          visit collection_path(@concept_id)
          click_on 'Edit Collection Record'
        end
      end

      it 'displays the loss-report-modal with correct links' do
        within '#loss-report-modal' do
          expect(page).to have_content("The native format of this collection is ECHO10. Editing this record using the MMT will convert it to UMM-JSON, which may result in data loss. Select 'View Loss Report' to see how the conversion will affect this record.")
          expect(page).to have_link('View Loss Report', href: loss_report_collections_path(@concept_id, format: 'json'))
          expect(page).to have_link('Edit Collection', href: edit_collection_path(id: @concept_id))
          expect(page).to have_link('Cancel', href: 'javascript:void(0);')
        end
      end

      context 'when the "Edit Collection" button is clicked' do
        before do
          VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
            within '#loss-report-modal' do
              click_on 'Edit Collection'
            end
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
          VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
            within '#loss-report-modal' do
              click_on 'View Loss Report'
            end
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
          VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
            within '#loss-report-modal' do
              click_on 'Cancel'
            end
          end
        end
        it 'closes loss-report-modal and does not open the not-current-provider-modal' do
          expect(page).to have_no_content('Metadata Preview')
          expect(page).to have_link('Edit Collection Record', href: '#loss-report-modal')
          expect(page).to have_no_css('#not-current-provider-modal')
          expect(page).to have_no_css('#loss-report-modal')
        end
      end
    end

    context 'when provider context needs to be changed and the required provider context is available' do

      before do
        VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
          @token = 'jwt_access_token'
          @cmr_response = cmr_client.get_collections({'EntryTitle': 'Global Cyclone Hazard Frequency and Distribution'}, @token)
          @concept_id = @cmr_response.body.dig('items',0,'meta','concept-id')

          login(provider: 'LARC', providers: %w[SEDAC LARC])
          allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
          visit collection_path(@concept_id)
          click_on 'Edit Collection Record'
        end
      end

      it 'displays the loss-report-modal with correct links' do
        within '#loss-report-modal' do
          expect(page).to have_content("The native format of this collection is ECHO10. Editing this record using the MMT will convert it to UMM-JSON, which may result in data loss. Select 'View Loss Report' to see how the conversion will affect this record.")
          expect(page).to have_link('View Loss Report', href: loss_report_collections_path(@concept_id, format: 'json'))
          expect(page).to have_link('Edit Collection', href: '#not-current-provider-modal')
          expect(page).to have_link('Cancel', href: 'javascript:void(0);')
        end
      end

      context 'when the "Edit Collection" button is clicked' do
        before do
          within '#loss-report-modal' do
            VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
              click_on 'Edit Collection'
            end
          end
        end
        it 'closes loss-report-modal and opens the not-current-provider-modal' do
          expect(page).to have_no_css('#loss-report-modal')
          within '#not-current-provider-modal' do
            expect(page).to have_link('Yes', href: '#')
            expect(page).to have_link('No', href: 'javascript:void(0);')
          end
        end
      end

      context 'when the "View Loss Report" button is clicked' do
        before do
          VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
            within '#loss-report-modal' do
              click_on 'View Loss Report'
            end
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

    context 'when the loss report feature is turned off' do
      before do
        allow(Mmt::Application.config).to receive(:loss_report_enabled).and_return(false)
      end

      context 'when provider context needs to be changed and the required provider context is available' do
        before do
          VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
            @token = 'jwt_access_token'
            @cmr_response = cmr_client.get_collections({'EntryTitle': 'Global Cyclone Hazard Frequency and Distribution'}, @token)
            @concept_id = @cmr_response.body.dig('items',0,'meta','concept-id')
            login(provider: 'LARC', providers: %w[SEDAC LARC])
            allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
            visit collection_path(@concept_id)
            click_on 'Edit Collection Record'
          end
        end

        it 'displays not-current-provider-modal' do
          expect(page).to have_no_css('#loss-report-modal')
          within '#not-current-provider-modal' do
            expect(page).to have_link('Yes', href: '#')
            expect(page).to have_link('No', href: 'javascript:void(0);')
          end
        end
      end

      context 'when provider context does not need to be changed' do
        before do
          VCR.use_cassette("edl/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
            @token = 'jwt_access_token'
            @cmr_response = cmr_client.get_collections({'EntryTitle': 'Global Cyclone Hazard Frequency and Distribution'}, @token)
            @concept_id = @cmr_response.body.dig('items',0,'meta','concept-id')
            login(provider: 'SEDAC', providers: %w[SEDAC])
            allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
            visit collection_path(@concept_id)
            click_on 'Edit Collection Record'
          end
        end

        it 'does not display the loss-report-modal' do
          expect(page).to have_no_content("The native format of this collection is ECHO10. Editing this record using the MMT will convert it to UMM-JSON, which may result in data loss. Select 'View Loss Report' to see how the conversion will affect this record.")
          expect(page).to have_no_content('Conversion to UMM Format Required')
          expect(page).to have_no_css('#loss-report-modal')
        end
      end
    end
  end
end
