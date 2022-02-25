# this test is a little different from the other preview tests
# it has been modified to also check the progress circles and match the format
# tool draft tests were organized.
# we should re-organize collection previews to have the metadata preview verify
# all the data types that also use the preview gem (collection drafts, collections,
# templates, proposals)
# and have tests just for the progress circles for collection drafts

describe 'Data identification preview' do
  context 'when viewing the preview page' do
    context 'when there is no metadata' do
      let(:empty_collection_draft) { create(:collection_draft, user: User.where(urs_uid: 'testuser').first) }

      before do
        login
        visit collection_draft_path(empty_collection_draft)
      end

      context 'when examining the progress circles section' do
        it 'displays the form title as an edit link' do
          within '#data-identification .meta-info' do
            expect(page).to have_link('Data Identification', href: edit_collection_draft_path(empty_collection_draft, 'data_identification'))
          end
        end

        it 'displays the correct progress indicators for required fields' do
            within '#data-identification .progress-indicators' do
              expect(page).to have_css('.eui-icon.eui-required-o.icon-green.processing-level')
              expect(page).to have_link(nil, href: edit_collection_draft_path(empty_collection_draft, 'data_identification', anchor: 'processing-level'))

              expect(page).to have_css('.eui-icon.eui-required-o.icon-green.collection-progress')
              expect(page).to have_link(nil, href: edit_collection_draft_path(empty_collection_draft, 'data_identification', anchor: 'collection-progress'))
            end
        end

        it 'displays the correct progress indicators for non required fields' do
          within '#data-identification .progress-indicators' do
            expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.collection-data-type')
            expect(page).to have_link(nil, href: edit_collection_draft_path(empty_collection_draft, 'data_identification', anchor: 'data-dates'))

            expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.collection-data-type')
            expect(page).to have_link(nil, href: edit_collection_draft_path(empty_collection_draft, 'data_identification', anchor: 'collection-data-type'))

            expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.quality')
            expect(page).to have_link(nil, href: edit_collection_draft_path(empty_collection_draft, 'data_identification', anchor: 'quality'))

            expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.use-constraints')
            expect(page).to have_link(nil, href: edit_collection_draft_path(empty_collection_draft, 'data_identification', anchor: 'use-constraints'))

            expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.access-constraints')
            expect(page).to have_link(nil, href: edit_collection_draft_path(empty_collection_draft, 'data_identification', anchor: 'access-constraints'))

            expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.metadata-associations')
            expect(page).to have_link(nil, href: edit_collection_draft_path(empty_collection_draft, 'data_identification', anchor: 'metadata-associations'))

            expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.publication-references')
            expect(page).to have_link(nil, href: edit_collection_draft_path(empty_collection_draft, 'data_identification', anchor: 'publication-references'))
          end
        end
      end
    end

    context 'when there is metadata' do
      let(:full_collection_draft) { create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first) }

      before do
        login
        visit collection_draft_path(full_collection_draft)
      end

      context 'when examining the progress circles section' do
        it 'displays the form title as an edit link' do
          within '#data-identification .meta-info' do
            expect(page).to have_link('Data Identification', href: edit_collection_draft_path(full_collection_draft, 'data_identification'))
          end
        end

        it 'displays the correct progress indicators for required fields' do
          within '#data-identification .progress-indicators' do
            expect(page).to have_css('.eui-icon.eui-required.icon-green.processing-level')
            expect(page).to have_link(nil, href: edit_collection_draft_path(full_collection_draft, 'data_identification', anchor: 'processing-level'))

            expect(page).to have_css('.eui-icon.eui-required.icon-green.collection-progress')
            expect(page).to have_link(nil, href: edit_collection_draft_path(full_collection_draft, 'data_identification', anchor: 'collection-progress'))
          end
        end

        it 'displays the correct progress indicators for non required fields' do
          within '#data-identification .progress-indicators' do
            expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.collection-data-type')
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
          end
        end
      end
    end
  end
end
