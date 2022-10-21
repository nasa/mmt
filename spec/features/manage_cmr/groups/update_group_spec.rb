require "rspec/mocks/standalone"
describe 'Updating groups', reset_provider: true, js: true do
  before do
    Rails.cache.clear
    allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return('jwt_access_token')
    @token = "jwt_access_token"
    allow_any_instance_of(ApplicationController).to receive(:echo_provider_token).and_return(@token)
    VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr1", record: :new_episodes) do
      @group = create_group(name:'update_group_'+uuid())
      login
    end
  end

  context 'when visiting edit group form' do
    before do
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr1", record: :new_episodes) do
        visit edit_group_path(@group['group_id'])
      end
    end

    it 'the name field is disabled' do
      expect(page).to have_field('group_name', readonly: true)
    end

    context 'when modifying the description' do
      before do
        fill_in 'Description', with: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.'

        within '.group-form' do
          click_on 'Submit'
        end
      end

      it 'saves the new description' do
        expect(page).to have_content('Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.')
      end
    end

    context 'when removing the description' do
      before do
        fill_in 'Description', with: ''

        within '.group-form' do
          click_on 'Submit'
        end
      end

      it 'displays validation errors within the form' do
        expect(page).to have_content('Description is required.')
      end
    end

    context 'when adding members' do
      before do
        VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr1", record: :new_episodes) do
          page.find('.select2-search__field').native.send_keys('chris.gokey')
          page.find('ul#select2-group_members-results li.select2-results__option--highlighted').click
          page.find('.select2-search__field').native.send_keys('rosy.cordova')
          page.find('ul#select2-group_members-results li.select2-results__option--highlighted').click
          page.find('.select2-search__field').native.send_keys('ttle9')
          page.find('ul#select2-group_members-results li.select2-results__option--highlighted').click
        end

        within '.group-form' do
            VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr2", record: :new_episodes) do
              click_on 'Submit'
              wait_for_cmr
            end
        end
      end

      it 'displays the group members' do
        expect(page).to have_content('Group was successfully updated.')

        within '#group-members' do
          expect(page).to have_selector('tbody > tr', count: 3)

          expect(page).to have_content('Christopher Gokey cgokey@comcast.net chris.gokey.arccurator')
          expect(page).to have_content('Thanhtam Le thanhtam.t.le@nasa.gov ttle9')
          expect(page).to have_content('rosy cordova rosy.m.cordova@nasa.gov rosy.cordova')
        end

        # message should only show if there are members that have not authorized MMT
        expect(page).to have_no_content('MMT cannot populate empty member information cells because those users have not authorized MMT to access their Earthdata Login profile.')
      end

      context 'when removing members' do
        before do
          VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr3", record: :new_episodes) do
          # VCR.use_cassette('edl/urs/multiple_users', record: :new_episodes) do
            click_on 'Edit'
          end

          VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr4", record: :new_episodes) do
            within '.group-form' do
              find('.select2-selection__choice[title="Christopher Gokey"] span.select2-selection__choice__remove').click
              find('.select2-selection__choice[title="rosy cordova"] span.select2-selection__choice__remove').click
              click_on 'Submit'
              wait_for_cmr
            end
          end
        end
        #failed
        it 'displays only remaining group members' do
          within '#group-members' do
            expect(page).to have_selector('tbody > tr', count: 1)

            expect(page).to have_content('Thanhtam Le')
          end
          # message should only show if there are members that have not authorized MMT
          expect(page).to have_no_content('MMT cannot populate empty member information cells because those users have not authorized MMT to access their Earthdata Login profile.')
        end
      end
    end
  end

  context 'when viewing a group that has group members that have not authorized MMT' do
    before do
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr5", record: :new_episodes) do
        cmr_client.add_new_members(@group['group_id'], %w(non_auth_user_1 non_auth_user_2))
      end

      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr6", record: :new_episodes) do
        visit group_path(@group['group_id'])
      end
    end

    #failed
    it 'shows the group information and members, including users that have not authorized MMT' do
      expect(page).to have_content(@group['name'])
      expect(page).to have_content(@group['description'])

      within '#group-members' do
        expect(page).to have_selector('tbody > tr', count: 3)
        expect(page).to have_content('non_auth_user_1')
        expect(page).to have_content('non_auth_user_2')
        expect(page).to have_content('Thanhtam Le')
      end
      # expect(page).to have_content('MMT cannot populate empty member information cells because those users have not authorized MMT to access their Earthdata Login profile.')
    end

    context 'when updating the group' do
      before do
        VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr7", record: :new_episodes) do
          visit edit_group_path(@group['group_id'])
          fill_in 'Description', with: 'New Testing Description'
          page.find('.select2-search__field').native.send_keys('chris.gokey')
          page.find('ul#select2-group_members-results li.select2-results__option--highlighted').click
          page.find('.select2-search__field').native.send_keys('rosy.cordova')
          page.find('ul#select2-group_members-results li.select2-results__option--highlighted').click
          page.find('.select2-search__field').native.send_keys('hvtranho')
          page.find('ul#select2-group_members-results li.select2-results__option--highlighted').click
        end

        within '.group-form' do
          VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr8", record: :new_episodes) do
            click_on 'Submit'
          end
        end
      end

      #failed
      it 'shows the updated description, new members, and non authorized group members' do
        expect(page).to have_content('New Testing Description')

        within '#group-members' do
          expect(page).to have_selector('tbody > tr', count: 6)
          expect(page).to have_content('chris.gokey.arccurator')
          expect(page).to have_content('ttle9')
          expect(page).to have_content('rosy.cordova')
          expect(page).to have_content('hvtranho')
          expect(page).to have_content('non_auth_user_1')
          expect(page).to have_content('non_auth_user_2')
        end
        # expect(page).to have_content('MMT cannot populate empty member information cells because those users have not authorized MMT to access their Earthdata Login profile.')
      end
    end
  end
end
