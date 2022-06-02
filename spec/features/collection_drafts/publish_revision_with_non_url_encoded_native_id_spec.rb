describe 'Publishing revision of collection with non url encoded native id',js:true do
  context 'when finding a published collection with a non url encoded native id' do
    before do
      login
    end

    context 'when editing the collection' do
      before do
        native_id = "not & url, encoded / native id #{Faker::SlackEmoji.emoji}"
        ingest_response, concept_response = publish_collection_draft(native_id: native_id)

        visit collection_path(ingest_response['concept-id'])

        # Editing this record will make a new draft
        click_on 'Edit Collection Record'
      end

      it 'creates a draft with a non url encoded native id' do
        within '.eui-banner--success' do
          expect(page).to have_content('Collection Draft Created Successfully!')
        end
      end

      context 'when publishing the revision then visiting the revisions page' do
        before do
          # # add required data to publish
          # within '.metadata' do
          #   click_on 'Data Centers', match: :first
          # end

          # expect(page).to have_content('Data Centers')

          # (1..3).each do |n|
          #   # TODO: Rewrite this so that it doesnt depend on previous tests
          #   # TODO this is not the ideal way to do this, but the entire form will be changed by the next ticket
          #   within "#draft_data_centers_#{n} > .eui-accordion__header" do
          #     find('.remove').click
          #   end
          # end

          # open_accordions

          # within '#draft_data_centers_0' do
          #   select 'AARHUS-HYDRO', from: 'Short Name'
          # end

          # within '.nav-top' do
          #   click_on 'Done'
          # end

          # within '.metadata' do
          #   click_on 'Data Identification'
          # end

          # click_on 'Expand All'
          # select '3', from: 'ID'
          # select 'Planned', from: 'Collection Progress'

          # within '.nav-top' do
          #   click_on 'Done'
          # end

          # within '.metadata' do
          #   click_on 'Acquisition Information'
          # end

          # click_on 'Expand All'
          # select 'Aircraft', from: 'Type'

          # within '.nav-top' do
          #   click_on 'Done'
          # end

          click_on 'Publish'
          click_on 'Revisions'
        end

        it 'has two revisions' do
          within 'tbody' do
            expect(page).to have_css('tr', count: 2)
          end
        end
      end
    end
  end
end


