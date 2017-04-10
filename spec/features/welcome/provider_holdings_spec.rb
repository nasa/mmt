# require 'rails_helper'

# describe 'Public provider holdings', js: true do
#   context 'when visiting the MMT homepage' do
#     before do
#       visit root_path
#     end

#     it 'displays a list of available providers' do
#       within '#data-providers' do
#         within all('tr')[2] do
#           expect(page).to have_content('MMT_1')
#         end
#         within all('tr')[3] do
#           expect(page).to have_content('MMT_2')
#         end
#       end
#     end

#     context 'when selecting a provider' do
#       before do
#         VCR.use_cassette('provider_holdings/mmt_2', record: :none) do
#           click_on 'MMT_2'
#         end
#       end

#       it 'displays the available provider holdings' do
#         expect(page).to have_content('MMT_2 Holdings')
#       end
#     end
#   end
# end
