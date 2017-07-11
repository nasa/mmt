require 'rails_helper'

describe 'Multiple Roles in Data Centers and Data Contacts preview', js: true do
  before do
    login
    draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first)

    visit collection_draft_path(draft)
  end
  context 'when viewing the preview page' do
    context 'when there is metadata' do
      context 'when the Data Centers and Data Contacts have only one Role' do
        it 'the Data Center shows the Role in the card header' do
          within '.data-centers-cards' do
            within all('li.card')[0] do
              within '.card-header' do
                expect(page).to have_content('AARHUS-HYDRO')
                expect(page).to have_content('ARCHIVER')
              end
            end
          end
        end

        it 'the Data Contact shows the Role in the card header' do
          within '.data-contacts-cards' do
            within all('li.card')[3] do
              within '.card-header' do
                expect(page).to have_content('Group Name 2')
                expect(page).to have_content('USER SERVICES')
              end
            end
          end
        end
      end

      context 'when the Data Center has Multiple Roles' do
        it 'displays "Multiple Roles" in the card header' do
          within '.data-centers-cards' do
            within all('li.card')[1] do
              within '.card-header' do
                expect(page).to have_content('ESA/ED')
                expect(page).to have_link('Multiple Roles')
              end
            end
          end
        end

        context 'when clicking on the Multiple Roles link' do
          before do
            within '.data-centers-cards' do
              within all('li.card')[1] do
                within '.card-header' do
                  click_link 'Multiple Roles'
                end
              end
            end
          end

          it 'displays a popover with the Roles' do
            within '.webui-popover' do
              expect(page).to have_content('ORIGINATOR')
              expect(page).to have_content('DISTRIBUTOR')
            end
          end
        end
      end

      context 'when the Data Contact(s) have Multiple Roles' do
        it 'displays "Multiple Roles" in the card headers' do
          within '.data-contacts-cards' do
            within all('li.card')[0] do
              within '.card-header' do
                expect(page).to have_content('First Name')
                expect(page).to have_link('Multiple Roles')
              end
            end
            within all('li.card')[1] do
              within '.card-header' do
                expect(page).to have_content('Group Name')
                expect(page).to have_link('Multiple Roles')
              end
            end
            within all('li.card')[2] do
              within '.card-header' do
                expect(page).to have_content('First Name 3')
                expect(page).to have_link('Multiple Roles')
              end
            end
          end
        end

        context 'when clicking on a Multiple Roles link' do
          before do
            within '.data-contacts-cards' do
              within all('li.card')[0] do
                within '.card-header' do
                  click_link 'Multiple Roles'
                end
              end
            end
          end

          it 'displays a popover with the Roles' do
            within '.webui-popover' do
              expect(page).to have_content('Science Contact')
              expect(page).to have_content('Technical Contact')
            end
          end
        end
      end
    end
  end
end
