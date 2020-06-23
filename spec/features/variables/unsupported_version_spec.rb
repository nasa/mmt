# These tests should be revisited and revised with MMT-2301, including looking at visiting the clone url directly when on the wrong provider and when the version cannot be confirmed
# describe 'Variables published at UMM Version higher than MMT supports', reset_provider: true do
#   before :all do
#     @ingest_response = publish_variable_v1_2_draft
#   end
#
#   before do
#     login
#   end
#
#   context 'when viewing the Variable show page' do
#     before do
#       visit variable_path(@ingest_response['concept-id'])
#     end
#
#     it 'displays a banner message explaining the published version is unsupported' do
#       within '.eui-banner--warn' do
#         expect(page).to have_content('This variable has been published to the CMR at a higher UMM version than what MMT currently supports. In order to prevent unintentional data loss, editing this variable is currently unavailable.')
#         expect(page).to have_content('Cloning this variable to create a new draft record may result is loss of data.')
#       end
#     end
#
#     it 'displays a diabled Edit link but not the Clone link' do
#       expect(page).to have_css('a.disabled', text: 'Edit Variable Record')
#
#       expect(page).to have_link('Edit Variable Record', href: '#')
#       expect(page).to have_link('Clone Variable Record', href: clone_variable_path(@ingest_response['concept-id']))
#     end
#   end
#
#   context 'when trying to visit the Edit Variable url directly' do
#     before do
#       visit edit_variable_path(@ingest_response['concept-id'])
#     end
#
#     it 'displays a banner message explaining the published version is unsupported' do
#       within '.eui-banner--warn' do
#         expect(page).to have_content('This variable has been published to the CMR at a higher UMM version than what MMT currently supports. In order to prevent unintentional data loss, editing this variable is currently unavailable.')
#         expect(page).to have_content('Cloning this variable to create a new draft record may result is loss of data.')
#       end
#     end
#
#     it 'displays a diabled Edit link but not the Clone link' do
#       # we need to use have_css to check the disabled class
#       expect(page).to have_css('a.disabled', text: 'Edit Variable Record')
#
#       expect(page).to have_link('Edit Variable Record', href: '#')
#       expect(page).to have_link('Clone Variable Record', href: clone_variable_path(@ingest_response['concept-id']))
#     end
#   end
# end
