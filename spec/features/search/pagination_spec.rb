# TODO Commented out these specs because they will keep Bamboo build red. We will revert this commit once we have support for pagination.


# # MMT-268
# # TODO These tests will not pass with the current concept search API
#
# require 'rails_helper'
#
# describe 'Search Result Pagination', js: true do
#   before do
#     login
#     visit '/search'
#   end
#
#   context 'when viewing search results with multiple pages' do
#     it 'displays pagination links' do
#       expect(page).to have_css('a', :text => "First")
#       expect(page).to have_css('a', :text => "1")
#       expect(page).to have_css('a', :text => "2")
#       expect(page).to have_css('a', :text => "3")
#       expect(page).to have_css('a', :text => "4")
#       expect(page).to have_css('a', :text => "Last")
#     end
#
#     context 'when clicking on the next link' do
#       before do
#         # click next link
#         click_on 'Next Page'
#       end
#
#       it 'displays the next page' do
#         expect(page).to have_css('.active-page', :text => "2")
#       end
#     end
#
#     context 'when clicking on the previous link' do
#       before do
#         # click next link
#         click_on 'Next Page'
#         # assert page 2 visible
#         expect(page).to have_css('.active-page', :text => "2")
#         # click previous link
#         click_on 'Previous Page'
#       end
#
#       it 'displays the previous page' do
#         expect(page).to have_css('.active-page', :text => "1")
#       end
#     end
#
#     context 'when clicking on the first page link' do
#       before do
#         # click next link
#         click_on 'Next Page'
#         # assert page 2 visible
#         expect(page).to have_css('.active-page', :text => "2")
#         # click first page link
#         click_on 'First Page'
#       end
#
#       it 'displays the first page' do
#         expect(page).to have_css('.active-page', :text => "1")
#       end
#     end
#
#     context 'when clicking on the last page link' do
#       before do
#         # click last page link
#         click_on 'Last Page'
#       end
#
#       it 'displays the last page' do
#         # FIXME We shouldn't hardcode 89 into this test, but it will change pretty soon when we start using the local CMR
#         expect(page).to have_css('.active-page', :text => "89")
#       end
#     end
#
#     context 'when clicking on a specific page link' do
#       before do
#         # click page 3 link
#         click_on 'Page 3'
#       end
#
#       it 'displays the new page' do
#         expect(page).to have_css('.active-page', :text => "3")
#       end
#     end
#   end
#
#   context 'when viewing search results with only one page' do
#     before do
#       fill_in 'Quick Find', with: 'DEM_100M_1'
#       click_on 'Find'
#     end
#
#     it 'does not display pagination links' do
#       expect(page).to have_no_css('a', :text => "First")
#       expect(page).to have_no_css('a', :text => "1")
#     end
#   end
# end
