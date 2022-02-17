describe 'Descriptive keywords preview' do
  context 'when viewing the preview page' do
    context 'when there is no metadata' do
      before do
        login
        draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
        visit collection_draft_path(draft)

        #find('.tab-label', text: 'Additional Information').click
      end

      it 'does not display metadata' do
        #within '#additional-information-panel' do
        #expect(page).to have_no_content('Ancillary Keywords')
        expect(page).to have_no_content('ISO Topic Categories')
        #expect(page).to have_no_content('Additional Attributes')
        #end
      end
    end

    context 'when there is metadata' do
      before do
        login
        draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first)
        visit collection_draft_path(draft)

        #find('.tab-label', text: 'Additional Information').click
      end

      it 'displays the metadata' do
        #within 'div.other-descriptive-keywords-preview' do
        #within 'ul.ancillary-keywords' do
        expect(page).to have_content('Ancillary keyword 1')
        expect(page).to have_content('Ancillary keyword 2')
        #end

        #within 'ul.iso-topic-categories' do
        expect(page).to have_content('farming')
        expect(page).to have_content('climatologyMeteorologyAtmosphere')
        expect(page).to have_content('health')
        #end
        #end

        #within 'ul.additional-attributes-preview' do
        #within 'li.additional-attribute-0' do
        expect(page).to have_content('Attribute 1')
        expect(page).to have_content('INT')
        expect(page).to have_content('Description')

        #within 'tbody' do
        #expect(page).to have_content('Measurement Resolution 1 5 Parameter Units Of Measure Parameter Value Accuracy', normalize_ws: true)
        #end

        expect(page).to have_content('Value Accuracy Explanation')
        #expect(page).to have_content('Group: Group')
        #expect(page).to have_content('Updated: 2015-09-14')
        #end

        #within 'li.additional-attribute-1' do
        expect(page).to have_content('Attribute 2')
        expect(page).to have_content('STRING')
        # end
        #end
      end
    end
  end
end
