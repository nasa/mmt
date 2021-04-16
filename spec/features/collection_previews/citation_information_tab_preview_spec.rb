describe 'Citation Information Tab preview', js: true do
  context 'when viewing the preview page' do
    context 'when there is no metadata' do
      before do
        login
        draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
        visit collection_draft_path(draft)
        find('.tab-label', text: 'Citation Information').click
      end

      it 'does not display metadata' do
        within '#citation-information-panel' do
          expect(page).to have_content('No Citation information has been provided for this collection. Please contact Earthdata Support...')
          expect(page).to have_no_content('DOI')
          expect(page).to have_no_content('Associated DOIs')
        end
      end

      context 'when clicking the Earthdata Support link' do
        before do
          find('#earthdata-feedback-modal').click
        end

        it 'displays the feedback modal' do
          expect(page).to have_css('h1', text: 'How can we help you?')
          expect(page).to have_css('form#new_ticket')
          expect(page).to have_content('Fill in the details here. Please try to be as specific as possible.')
        end
      end
    end

    context 'when there is metadata' do
      before do
        login
        draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first)
        visit collection_draft_path(draft)
        find('.tab-label', text: 'Citation Information').click
      end

      it 'display metadata' do
        within '#citation-information-panel' do
          expect(page).to have_content('Title: Citation title')
          expect(page).to have_content('Version: v1')
          expect(page).to have_content('Creator: Citation creator')
          expect(page).to have_content('Editor: Citation editor')
          expect(page).to have_content('Publisher: Citation publisher')
          expect(page).to have_content('Release Date: 2015-07-01T00:00:00Z')
          expect(page).to have_content('Other Citation Details: Citation other details')
          expect(page).to have_content('Linkage: http://example.com')

          expect(page).to have_content('Title: Citation title 1')
          expect(page).to have_content('Version: v2')
          expect(page).to have_content('Creator: Citation creator 1')
          expect(page).to have_content('Linkage: http://example2.com')

          expect(page).to have_link('https://example.com/data-citation-policy')
        end

        within 'div.doi-preview' do
          expect(page).to have_content('Citation DOI')
          expect(page).to have_content('Citation DOI Authority')
        end

        within 'div.associated-dois-preview' do
          expect(page).to have_content('Associated DOI')
          expect(page).to have_content('Associated DOI Title')
          expect(page).to have_content('Associated DOI Authority')
        end
      end
    end
  end
end
