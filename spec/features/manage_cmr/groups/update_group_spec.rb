require "rspec/mocks/standalone"
describe 'Updating groups', reset_provider: true, js: true do
  before do
    Rails.cache.clear
    allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return('eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfc2l0IiwiYWxnIjoiUlMyNTYifQ.eyJ0eXBlIjoiQ2xpZW50IiwiY2xpZW50X2lkIjoiODFGRWVtOTFObFRRcmVXdjJVZ3RYUSIsImV4cCI6MTY2NzUwMzEwMywiaWF0IjoxNjY2MjA3MTAzLCJpc3MiOiJFYXJ0aGRhdGEgTG9naW4ifQ.GE1vKsGx4OtE5KdHu5Sc9wBIdLMiJMeXrPEsZ-FVEfcCdQyuhP9_4uZxJz267a2p4734NFsR3OeSflUkRtD9xamdCBNl5bcQFWLA0An8saccVuEv63jdnVl6F5xr5TGlcM1wpu_adNhCJTR5bvmgUiztbaWz3Zpact62ktJJT2m6WkttdMYH_Y1X3h63blhL-lVrl_fre4VzMEnB8vZdNvwwFiiVV2JW65HPjbM0C3nOqtgZGOkA8M4CeRcXyguO7ULJHaqwKBjNUPvHtGXDP8gD0X2ucgGFUEkxskX6BLTGepUlcUMxsou8qERo5JRlqJXPXwTGZfhEiDkntVX_kQ')
    VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :new_episodes) do
    # VCR.use_cassette('edl', record: :new_episodes) do
      @group = create_group(name:'')

      login
    end
  end

  context 'when visiting edit group form' do
    before do
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :new_episodes) do
      # VCR.use_cassette('edl', record: :new_episodes) do
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
        VCR.use_cassette("edl/urs/search/rarxd5taqea/#{File.basename(__FILE__, ".rb")}_vcr", record: :new_episodes) do
        # VCR.use_cassette('urs/search/rarxd5taqea', record: :new_episodes) do
          page.find('.select2-search__field').native.send_keys('rarxd5taqea')

          page.find('ul#select2-group_members-results li.select2-results__option--highlighted').click
        end

        VCR.use_cassette('urs/search/qhw5mjoxgs2vjptmvzco', record: :new_episodes) do
          page.find('.select2-search__field').native.send_keys('qhw5mjoxgs2vjptmvzco')

          page.find('ul#select2-group_members-results li.select2-results__option--highlighted').click
        end

        VCR.use_cassette('urs/search/q6ddmkhivmuhk', record: :new_episodes) do
          page.find('.select2-search__field').native.send_keys('q6ddmkhivmuhk')

          page.find('ul#select2-group_members-results li.select2-results__option--highlighted').click
        end

        within '.group-form' do
          VCR.use_cassette("edl/urs/multiple_users/#{File.basename(__FILE__, ".rb")}_vcr", record: :new_episodes) do
          # VCR.use_cassette('edl/urs/multiple_users', record: :new_episodes) do
            click_on 'Submit'
          end
        end

        wait_for_cmr
      end

      it 'displays the group members' do
        screenshot_and_open_image
        expect(page).to have_content('Group was successfully updated.')

        within '#group-members' do
          expect(page).to have_selector('tbody > tr', count: 3)

          expect(page).to have_content('Execktamwrwcqs 02Wvhznnzjtrunff')
          expect(page).to have_content('06dutmtxyfxma Sppfwzsbwz')
          expect(page).to have_content('Rvrhzxhtra Vetxvbpmxf')
        end

        # message should only show if there are members that have not authorized MMT
        expect(page).to have_no_content('MMT cannot populate empty member information cells because those users have not authorized MMT to access their Earthdata Login profile.')
      end

      context 'when removing members' do
        before do
          VCR.use_cassette("edl/urs/multiple_users/#{File.basename(__FILE__, ".rb")}_vcr", record: :new_episodes) do
          # VCR.use_cassette('edl/urs/multiple_users', record: :new_episodes) do
            click_on 'Edit'

            within '.group-form' do
              find('.select2-selection__choice[title="Execktamwrwcqs 02Wvhznnzjtrunff"] span.select2-selection__choice__remove').click
              find('.select2-selection__choice[title="06dutmtxyfxma Sppfwzsbwz"] span.select2-selection__choice__remove').click

              VCR.use_cassette('edl/urs/rarxd5taqea', record: :new_episodes) do
                click_on 'Submit'
              end
            end
          end
        end
        #failed
        it 'displays only remaining group members' do
          screenshot_and_open_image
          within '#group-members' do
            expect(page).to have_selector('tbody > tr', count: 1)

            expect(page).to have_content('Rvrhzxhtra Vetxvbpmxf')
          end
          # message should only show if there are members that have not authorized MMT
          expect(page).to have_no_content('MMT cannot populate empty member information cells because those users have not authorized MMT to access their Earthdata Login profile.')
        end
      end
    end
  end

  context 'when viewing a group that has group members that have not authorized MMT' do
    before do
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :new_episodes) do
      # VCR.use_cassette('edl', record: :new_episodes) do
        cmr_client.add_new_members(@group['group_id'], %w(non_auth_user_1ab non_auth_user_2ab))
      end

      # within '#group-members' do
        VCR.use_cassette("edl/urs/multiple_users/#{File.basename(__FILE__, ".rb")}_vcr", record: :new_episodes) do
        # VCR.use_cassette('edl/urs/multiple_users', record: :new_episodes) do
          VCR.use_cassette("edl/urs/non_authorized_users/#{File.basename(__FILE__, ".rb")}_vcr", record: :new_episodes) do
          # VCR.use_cassette('edl/urs/non_authorized_users', record: :new_episodes) do
            visit group_path(@group['group_id'])
          end
        end
      # end
    end

    #failed
    it 'shows the group information and members, including users that have not authorized MMT' do
      expect(page).to have_content(@group['name'])
      expect(page).to have_content(@group['description'])

      within '#group-members' do
        expect(page).to have_selector('tbody > tr', count: 2)
        expect(page).to have_content('non_auth_user_1ab')
        expect(page).to have_content('non_auth_user_2ab')
      end
      expect(page).to have_content('MMT cannot populate empty member information cells because those users have not authorized MMT to access their Earthdata Login profile.')
    end

    context 'when updating the group' do
      before do
        VCR.use_cassette("edl/urs/non_authorized_users/#{File.basename(__FILE__, ".rb")}_vcr", record: :new_episodes) do
        # VCR.use_cassette('edl/urs/non_authorized_users', record: :new_episodes) do
          visit edit_group_path(@group['group_id'])
        end

        fill_in 'Description', with: 'New Testing Description'

        VCR.use_cassette('urs/search/q6ddmkhivmuhk', record: :new_episodes) do
          page.find('.select2-search__field').native.send_keys('q6ddmkhivmuhk')

          page.find('ul#select2-group_members-results li.select2-results__option--highlighted').click
        end

        VCR.use_cassette('urs/search/qhw5mjoxgs2vjptmvzco', record: :none) do
          page.find('.select2-search__field').native.send_keys('qhw5mjoxgs2vjptmvzco')

          page.find('ul#select2-group_members-results li.select2-results__option--highlighted').click
        end

        within '.group-form' do

          VCR.use_cassette("edl/urs/mixed_authorization/#{File.basename(__FILE__, ".rb")}_vcr", record: :new_episodes) do
          # VCR.use_cassette('edl/urs/mixed_authorization', record: :new_episodes) do
            click_on 'Submit'
          end
        end
      end

      #failed
      it 'shows the updated description, new members, and non authorized group members' do
        expect(page).to have_content('New Testing Description')

        within '#group-members' do
          expect(page).to have_selector('tbody > tr', count: 4)
          expect(page).to have_content('Execktamwrwcqs 02Wvhznnzjtrunff pvblvweo@hqdybllrn.sghjz q6ddmkhivmuhk')
          expect(page).to have_content('06dutmtxyfxma Sppfwzsbwz jkbvtdzjtheltsmgx@ybgcztxabzqnzmmvf.ygen qhw5mjoxgs2vjptmvzco')

          expect(page).to have_content('non_auth_user_1ab')
          expect(page).to have_content('non_auth_user_2ab')
        end
        expect(page).to have_content('MMT cannot populate empty member information cells because those users have not authorized MMT to access their Earthdata Login profile.')
      end
    end
  end
end
