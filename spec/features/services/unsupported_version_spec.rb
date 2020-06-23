# This test is for cases where CMR supports a UMM-S version that is higher than
# MMT supports. If there are no higher versions, this test cannot be run and
# may need to stay commented out, and reinstated when there are higher versions.

# These tests should be revisited and revised with MMT-2301, including looking at visiting the clone url directly when on the wrong provider and when the version cannot be confirmed
# describe 'Services published at UMM Version higher than MMT supports', reset_provider: true do
#   before :all do
#     @ingest_response = publish_service_v1_2_draft
#   end
#
#   before do
#     login
#   end
#
#   context 'when viewing the Service show page' do
#     before do
#       visit service_path(@ingest_response['concept-id'])
#     end
#
#     it 'displays a banner message explaining the published version is unsupported' do
#       within '.eui-banner--warn' do
#         expect(page).to have_content('This service has been published to the CMR at a higher UMM version than what MMT currently supports. In order to prevent unintentional data loss, editing this service is currently unavailable.')
#         expect(page).to have_content('Cloning this service to create a new draft record may result is loss of data.')
#       end
#     end
#
#     it 'displays a diabled Edit link but not the Clone link' do
#       expect(page).to have_css('a.disabled', text: 'Edit Service Record')
#
#       expect(page).to have_link('Edit Service Record', href: '#')
#       expect(page).to have_link('Clone Service Record', href: clone_service_path(@ingest_response['concept-id']))
#     end
#   end
#
#   context 'when trying to visit the Edit Service url directly' do
#     before do
#       visit edit_service_path(@ingest_response['concept-id'])
#     end
#
#     it 'displays a banner message explaining the published version is unsupported' do
#       within '.eui-banner--warn' do
#         expect(page).to have_content('This service has been published to the CMR at a higher UMM version than what MMT currently supports. In order to prevent unintentional data loss, editing this service is currently unavailable.')
#         expect(page).to have_content('Cloning this service to create a new draft record may result is loss of data.')
#       end
#     end
#
#     it 'displays a diabled Edit link but not the Clone link' do
#       expect(page).to have_css('a.disabled', text: 'Edit Service Record')
#
#       expect(page).to have_link('Edit Service Record', href: '#')
#       expect(page).to have_link('Clone Service Record', href: clone_service_path(@ingest_response['concept-id']))
#     end
#   end
# end
