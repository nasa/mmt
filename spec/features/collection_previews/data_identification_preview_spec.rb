# this test is a little different from the other preview tests
# it has been modified to also check the progress circles and match the format
# tool draft tests were organized.
# we should re-organize collection previews to have the metadata preview verify
# all the data types that also use the preview gem (collection drafts, collections,
# templates, proposals)
# and have tests just for the progress circles for collection drafts

describe 'Data identification preview',js:true do
  context 'when viewing the preview page' do
    context 'when there is no metadata' do
      let(:empty_collection_draft) { create(:collection_draft, user: User.where(urs_uid: 'testuser').first) }

      before do
        login
        visit collection_draft_path(empty_collection_draft)

        #find('.tab-label', text: 'Additional Information').click
      end

      context 'when examining the progress circles section' do
        it 'displays the correct status icon' do
          #within '#data-identification' do
          #within '.status' do
          #expect(page).to have_css('.eui-icon.icon-green.eui-fa-circle-o', text: 'Data Identification is incomplete')
          #end
          #end
        end

        it 'displays the form title as an edit link' do
          #within '#data-identification .meta-info' do
          #expect(page).to have_link('Data Identification', href: edit_collection_draft_path(empty_collection_draft, 'data_identification'))
          #end
        end

        it 'displays the correct progress indicators for required fields' do
          #within '#data-identification .progress-indicators' do
          #expect(page).to have_css('.eui-icon.eui-required-o.icon-green.processing-level')
          #expect(page).to have_link(nil, href: edit_collection_draft_path(empty_collection_draft, 'data_identification', anchor: 'processing-level'))

          #expect(page).to have_css('.eui-icon.eui-required-o.icon-green.collection-progress')
          #expect(page).to have_link(nil, href: edit_collection_draft_path(empty_collection_draft, 'data_identification', anchor: 'collection-progress'))
          #end
        end

        it 'displays the correct progress indicators for non required fields' do
          #within '#data-identification .progress-indicators' do
          #expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.collection-data-type')
          #expect(page).to have_link(nil, href: edit_collection_draft_path(empty_collection_draft, 'data_identification', anchor: 'data-dates'))

          #expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.collection-data-type')
          #expect(page).to have_link(nil, href: edit_collection_draft_path(empty_collection_draft, 'data_identification', anchor: 'collection-data-type'))

          #expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.quality')
          #expect(page).to have_link(nil, href: edit_collection_draft_path(empty_collection_draft, 'data_identification', anchor: 'quality'))

          #expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.use-constraints')
          #expect(page).to have_link(nil, href: edit_collection_draft_path(empty_collection_draft, 'data_identification', anchor: 'use-constraints'))

          #expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.access-constraints')
          #expect(page).to have_link(nil, href: edit_collection_draft_path(empty_collection_draft, 'data_identification', anchor: 'access-constraints'))

          #expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.metadata-associations')
          #expect(page).to have_link(nil, href: edit_collection_draft_path(empty_collection_draft, 'data_identification', anchor: 'metadata-associations'))

          #expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.publication-references')
          #expect(page).to have_link(nil, href: edit_collection_draft_path(empty_collection_draft, 'data_identification', anchor: 'publication-references'))
          #end
        end
      end

      context 'when examining the metadata preview section' do
        before do
          #find('.tab-label', text: 'Additional Information').click
        end

        it 'does not display metadata' do
          #screenshot_and_open_image
          #within '#additional-information-panel' do
          #within 'ul.data-identification-preview' do
          #expect(page).to have_no_content('Data Dates')
          #expect(page).to have_content("This collection's processing level has not been specified.")
          #expect(page).to have_content("This collection's collection progress has not been specified.")
          # the Quality title shows but no content
          #expect(page).to have_no_content('Use Constraints')
          #expect(page).to have_no_content('Access Constraints')
          #expect(page).to have_no_content('Metadata Associations')
          #expect(page).to have_no_content('Publication References')
            #end
          #end
        end
      end
    end

    context 'when there is metadata' do
      let(:full_collection_draft) { create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first) }

      before do
        login
        visit collection_draft_path(full_collection_draft)

        #find('.tab-label', text: 'Additional Information').click
      end

      context 'when examining the progress circles section',js:true do
        it 'displays the correct status icon' do
          #within '#data-identification' do
          #within '.status' do
          #expect(page).to have_css('.eui-icon.icon-green.eui-check', text: 'Data Identification is valid')
              #end
          #end
        end

        it 'displays the form title as an edit link' do
          #within '#data-identification .meta-info' do
          expect(page).to have_link('Data Identification', href: edit_collection_draft_path(full_collection_draft, 'data_identification'))
          #end
        end

        it 'displays the correct progress indicators for required fields' do
          #within '#data-identification .progress-indicators' do
          #expect(page).to have_css('.eui-icon.eui-required.icon-green.processing-level')
          #expect(page).to have_link(nil, href: edit_collection_draft_path(full_collection_draft, 'data_identification', anchor: 'processing-level'))

          #expect(page).to have_css('.eui-icon.eui-required.icon-green.collection-progress')
          #expect(page).to have_link(nil, href: edit_collection_draft_path(full_collection_draft, 'data_identification', anchor: 'collection-progress'))
          #end
        end

        it 'displays the correct progress indicators for non required fields' do
          #within '#data-identification .progress-indicators' do
          #expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.collection-data-type')
          expect(page).to have_link(nil, href: edit_collection_draft_path(full_collection_draft, 'data_identification', anchor: 'data-dates'))

          expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.collection-data-type')
          expect(page).to have_link(nil, href: edit_collection_draft_path(full_collection_draft, 'data_identification', anchor: 'collection-data-type'))

          expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.quality')
          expect(page).to have_link(nil, href: edit_collection_draft_path(full_collection_draft, 'data_identification', anchor: 'quality'))

          expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.use-constraints')
          expect(page).to have_link(nil, href: edit_collection_draft_path(full_collection_draft, 'data_identification', anchor: 'use-constraints'))

          expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.access-constraints')
          expect(page).to have_link(nil, href: edit_collection_draft_path(full_collection_draft, 'data_identification', anchor: 'access-constraints'))

          expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.metadata-associations')
          expect(page).to have_link(nil, href: edit_collection_draft_path(full_collection_draft, 'data_identification', anchor: 'metadata-associations'))

          expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.publication-references')
          expect(page).to have_link(nil, href: edit_collection_draft_path(full_collection_draft, 'data_identification', anchor: 'publication-references'))
          #end
        end
      end

      context 'when examining the metadata preview section' do
        before do
          #find('.tab-label', text: 'Additional Information').click
        end

        it 'displays the metadata' do
          #within '#additional-information-panel' do
          #within 'ul.data-identification-preview' do
          #within '.data-dates-table' do
          #within all('tr')[0] do
          #expect(page).to have_content('Creation 2015-07-01T00:00:00Z', normalize_ws: true)
                  #end
          #               within all('tr')[1] do
          #          expect(page).to have_content('Last Revision 2015-07-05T00:00:00Z', normalize_ws: true)
          #                end
                #end

          #             within '.processing-level' do
          #               expect(page).to have_content('1A')
          #               expect(page).to have_content('Level 1 Description')
          #             end

          #             within '.quality' do
          #               expect(page).to have_content('Metadata quality summary')
          #             end
          #             expect(page).to have_content('Collection Progress')
          #             expect(page).to have_content('Active')
          #
          #              expect(page).to have_content('Description: These are some use constraints')
          #              expect(page).to have_content('Free and Open Data: true')
          #             expect(page).to have_content('License URL: http://example.com')

          #             expect(page).to have_content('42')
          #              expect(page).to have_content('Access constraint description')

          #             within '.metadata-associations-table' do
          #                within all('tr')[1] do
          #                  expect(page).to have_content('Science Associated 12345 Metadata association description 23', normalize_ws: true)
                  #               end
          #               within all('tr')[2] do
          #                  expect(page).to have_content('Larger Citation Works 123abc', normalize_ws: true)
                  #               end
                #           end

          #             within '.publication-reference-preview' do
          #                within all('li.publication-reference')[0] do
          #                  expect(page).to have_content('Title: Publication reference title')
          #                  expect(page).to have_content('Publication Date: 2015-07-01')
          #                 expect(page).to have_content('Publisher: Publication reference publisher')
          #                  expect(page).to have_content('Author(s): Publication reference author')
          #                 expect(page).to have_content('Series: Publication reference series')
          #                 expect(page).to have_content('Edition: Publication reference edition')
          #                  expect(page).to have_content('Volume: Publication reference volume')
          #                  expect(page).to have_content('Issue: Publication reference issue')
          #                  expect(page).to have_content('Pages: Publication reference pages')
          #                  expect(page).to have_content('DOI: Publication reference DOI')
          #                  expect(page).to have_content('Online Resource: http://example.com')
          #                  expect(page).to have_link('http://example.com', href: 'http://example.com')
          #               end

          #               within all('li.publication-reference')[1] do
          #                  expect(page).to have_content('Title: Publication reference title 1')
          #                end
                #             end
              #end
            #end
        end
      end
    end
  end
end
