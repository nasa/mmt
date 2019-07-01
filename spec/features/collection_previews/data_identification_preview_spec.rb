describe 'Data identification preview' do
  context 'when viewing the preview page' do
    context 'when there is no metadata' do
      before do
        login
        draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
        visit collection_draft_path(draft)

        find('.tab-label', text: 'Additional Information').click
      end

      it 'does not display metadata' do
        within 'ul.data-identification-preview' do
          expect(page).to have_no_content('Data Dates')
          expect(page).to have_content("This collection's processing level has not been specified.")
          expect(page).to have_no_content('Use Constraints')
          expect(page).to have_no_content('Access Constraints')
          expect(page).to have_no_content('Metadata Associations')
          expect(page).to have_no_content('Publication References')
        end
      end
    end

    context 'when there is metadata' do
      before do
        login
        draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first)
        visit collection_draft_path(draft)

        find('.tab-label', text: 'Additional Information').click
      end

      it 'displays the metadata' do
        within '.data-identification-preview' do
          within '.data-dates-table' do
            within all('tr')[0] do
              expect(page).to have_content('Creation 2015-07-01T00:00:00Z', normalize_ws: true)
            end
            within all('tr')[1] do
              expect(page).to have_content('Last Revision 2015-07-05T00:00:00Z', normalize_ws: true)
            end
          end

          within '.processing-level' do
            expect(page).to have_content('1A')
            expect(page).to have_content('Level 1 Description')
          end

          within '.quality' do
            expect(page).to have_content('Metadata quality summary')
          end

          expect(page).to have_content('Collection Progress')
          expect(page).to have_content('Active')

          expect(page).to have_content('These are some use constraints')

          expect(page).to have_content('42')
          expect(page).to have_content('Access constraint description')

          within '.metadata-associations-table' do
            within all('tr')[1] do
              expect(page).to have_content('Science Associated 12345 Metadata association description 23', normalize_ws: true)
            end
            within all('tr')[2] do
              expect(page).to have_content('Larger Citation Works 123abc', normalize_ws: true)
            end
          end

          within '.publication-reference-preview' do
            within all('li.publication-reference')[0] do
              expect(page).to have_content('Title: Publication reference title')
              expect(page).to have_content('Publication Date: 2015-07-01')
              expect(page).to have_content('Publisher: Publication reference publisher')
              expect(page).to have_content('Author(s): Publication reference author')
              expect(page).to have_content('Series: Publication reference series')
              expect(page).to have_content('Edition: Publication reference edition')
              expect(page).to have_content('Volume: Publication reference volume')
              expect(page).to have_content('Issue: Publication reference issue')
              expect(page).to have_content('Pages: Publication reference pages')
              expect(page).to have_content('DOI: Publication reference DOI')
              expect(page).to have_content('Online Resource: http://example.com')
              expect(page).to have_link('http://example.com', href: 'http://example.com')
            end

            within all('li.publication-reference')[1] do
              expect(page).to have_content('Title: Publication reference title 1')
            end
          end
        end
      end
    end
  end
end
