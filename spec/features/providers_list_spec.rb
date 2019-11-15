require 'rails_helper'

describe 'Providers list' do
  before :all do
    create_group(
      name: "Group #{Faker::Ancient.titan} for providers list #{Faker::Number.number(digits: 3)}",
      description: 'test group',
      provider_id: 'MMT_2'
    )
  end

  context 'when a new provider is added' do
    context 'when the user is already logged in on the group index page' do
      before do
        login

        visit groups_path
      end

      context 'when then adding the provider', js: true do
        new_provider = "#{Faker::Ancient.primordial.slice(0, 5).upcase}_#{Faker::Number.number(digits: 3)}"

        before do
          create_provider(new_provider)
        end

        after do
          delete_provider(new_provider)
        end

        it 'does not have the new provider in the search dropdown or groups filter' do
          within '#provider-group-filter' do
            expect(page).to have_no_css('option', text: new_provider)
          end

          within '.quick-search' do
            click_on 'search-drop'
          end

          within '.search-dropdown' do
            expect(page).to have_no_css('option', text: new_provider)
          end
        end

        context 'when the user refreshes their providers' do
          before do
            click_on 'provider-badge-link'
            click_on 'Refresh your available providers'
            wait_for_jQuery
            click_on 'Close'
          end

          it 'has the new provider in the search dropdown and groups filter' do
            expect(page).to have_select('provider-group-filter', with_options: [new_provider])

            within '.quick-search' do
              click_on 'search-drop'
            end

            within '.search-dropdown' do
              expect(page).to have_select('provider_id', with_options: [new_provider])
            end
          end
        end
      end
    end

    context 'when the user is not yet logged in' do
      new_provider = "#{Faker::Ancient.primordial.slice(0, 5).upcase}_#{Faker::Number.number(digits: 3)}"

      before :all do
        create_provider(new_provider)
      end

      after :all do
        delete_provider(new_provider)
      end

      context 'when the user then logs in' do
        before do
          real_login
        end

        context 'when viewing the provider list in the search dropdown', js: true do
          before do
            within '.quick-search' do
              click_on 'search-drop'
            end
          end

          it 'has the newly added provider' do
            expect(page).to have_select('provider_id', with_options: [new_provider])
          end
        end

        context 'when viewing the provider list for filtering groups' do
          before do
            visit groups_path
          end

          it 'has the new provider in the groups filter' do
            expect(page).to have_select('provider-group-filter', with_options: [new_provider])
          end
        end
      end
    end
  end
end
