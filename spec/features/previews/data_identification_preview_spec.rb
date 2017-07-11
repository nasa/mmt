require 'rails_helper'

describe 'Data identification preview' do
  context 'when viewing the preview page' do
    context 'when there is no metadata' do
      before do
        login
        draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
        visit collection_draft_path(draft)
      end

      it 'does not display metadata' do
        within 'ul.data-identification-preview' do
          expect(page).to have_no_content('Data Dates')
          expect(page).to have_content('This collection\'s processing level has not been specified.')
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
      end

      it 'displays the metadata' do
        within '.data-identification-preview' do
          within '.data-dates-table' do
            within all('tr')[0] do
              expect(page).to have_content('Creation 2015-07-01T00:00:00Z')
            end
            within all('tr')[1] do
              expect(page).to have_content('Last Revision	2015-07-05T00:00:00Z')
            end
          end

          within '.processing-level' do
            expect(page).to have_content('Level 1A')
            expect(page).to have_content('Level 1 Description')
          end

          within '.quality' do
            expect(page).to have_content('Metadata quality summary')
          end

          expect(page).to have_content('Collection Progress In Work')

          expect(page).to have_content('These are some use constraints')

          expect(page).to have_content('42')
          expect(page).to have_content('Access constraint description')

          within '.metadata-associations-table' do
            within all('tr')[1] do
              expect(page).to have_content('Science Associated 12345 Metadata association description 23')
            end
            within all('tr')[2] do
              expect(page).to have_content('Larger Citation Works	123abc	')
            end
          end

          within '.publication-reference-cards' do
            within all('li.card')[0] do
              within '.card-header' do
                expect(page).to have_content('Publication reference title')
                expect(page).to have_content('2015-07-01')
              end
              within all('.card-body')[0] do
                within all('.col-6')[0] do
                  expect(page).to have_content('Publisher')
                  expect(page).to have_content('Publication reference publisher')
                  expect(page).to have_content('Author(s)')
                  expect(page).to have_content('Publication reference author')
                end
                within all('.col-6')[1] do
                  expect(page).to have_content('Publication reference series')
                  expect(page).to have_content('Edition: Publication reference edition')
                  expect(page).to have_content('Vol: Publication reference volume')
                  expect(page).to have_content('Iss: Publication reference issue')
                  expect(page).to have_content('Pages: Publication reference pages')
                  expect(page).to have_content('DOI: Publication reference DOI')
                end
              end
              within all('.card-body')[1] do
                expect(page).to have_link('http://example.com', href: 'http://example.com')
              end
            end
            within all('li.card')[1] do
              within '.card-header' do
                expect(page).to have_content('Publication reference title 1')
              end
            end
          end
        end
      end
    end
  end
end
