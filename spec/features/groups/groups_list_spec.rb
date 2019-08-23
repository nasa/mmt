describe 'Groups list page', reset_provider: true do
  context 'when there are system level groups' do
    context 'when logging in as a regular user' do
      before do
        login
      end

      context 'when viewing the groups page' do
        context 'when there are no groups' do
          before do
            empty = '{"hits": 0, "took": 7, "items": []}'
            empty_response = cmr_success_response(empty)
            allow_any_instance_of(Cmr::CmrClient).to receive(:get_cmr_groups).and_return(empty_response)

            visit groups_path
          end

          it 'does not show any groups' do
            expect(page).to have_content('No groups found.')
          end
        end

        context 'when there are provider groups under the pagination limit' do
          before do
            visit groups_path
          end

          it 'displays a list of groups' do
            # groups created on our local cmr setup
            within '.groups-table' do
              expect(page).to have_content('LARC Admin Group Test group for provider LARC 2')
              expect(page).to have_content('MMT_1 Admin Group Test group for provider MMT_1 2')
              expect(page).to have_content('MMT_2 Admin Group Test group for provider MMT_2 2')
              expect(page).to have_content('NSIDC_ECS Admin Group Test group for provider NSIDC_ECS 2')
            end
          end

          it 'does not display system level and admin access only provider groups' do
            within '.groups-table' do
              expect(page).to have_no_content('Administrators_2 The group of users that manages the CMR. CMR 2')
              expect(page).to have_no_content('SEDAC Admin Group Test group for provider SEDAC 2')
            end
          end

          context 'when logging out and logging in as admin user' do
            before do
              visit logout_path

              login_admin
            end

            context 'when visiting the group page again' do
              before do
                visit groups_path
              end

              it 'displays the provider and system level groups' do
                within '.groups-table' do
                  # Provider level groups
                  expect(page).to have_content('LARC Admin Group Test group for provider LARC 2')
                  expect(page).to have_content('MMT_1 Admin Group Test group for provider MMT_1 2')
                  expect(page).to have_content('MMT_2 Admin Group Test group for provider MMT_2 2')
                  expect(page).to have_content('NSIDC_ECS Admin Group Test group for provider NSIDC_ECS 2')

                  # Provider group with only admin users
                  expect(page).to have_content('SEDAC Admin Group Test group for provider SEDAC 2')

                  # System level groups
                  expect(page).to have_content('Administrators SYS CMR')
                  expect(page).to have_content('Administrators_2 SYS The group of users that manages the CMR. CMR 2')
                end
              end
            end
          end
        end

        context 'when there are paginated groups' do
          before do
            # mock for group list page 1
            groups_page_1_response = cmr_success_response(File.read('spec/fixtures/groups/groups_index_page_1.json'))
            page_1_options = { page_size: 25, page_num: 1 }
            allow_any_instance_of(Cmr::CmrClient).to receive(:get_cmr_groups).with(page_1_options, 'access_token').and_return(groups_page_1_response)

            # mock for group list page 2
            groups_page_2_response = cmr_success_response(File.read('spec/fixtures/groups/groups_index_page_2.json'))
            page_2_options = { page_size: 25, page_num: 2 }
            allow_any_instance_of(Cmr::CmrClient).to receive(:get_cmr_groups).with(page_2_options, 'access_token').and_return(groups_page_2_response)

            visit groups_path
          end

          it 'lists the first page of groups' do
            within '.groups-table' do
              expect(page).to have_selector('tbody tr', count: 25)
              # cmr controls the order so we should not test specific groups
            end
          end

          it 'displays the pagination information for page 1' do
            expect(page).to have_content('Showing Groups 1 - 25 of 31')
            within '.eui-pagination' do
              # first, 1, 2, next, last
              expect(page).to have_selector('li', count: 5)
            end
            expect(page).to have_css('.active-page', text: '1')
          end

          context 'when clicking to the second page' do
            before do
              click_link '2'
            end

            it 'lists the second page of groups' do
              within '.groups-table' do
                expect(page).to have_selector('tbody tr', count: 6)
                # cmr controls the order so we should not test specific groups
              end
            end

            it 'displays the pagination information for page 2' do
              expect(page).to have_content('Showing Groups 26 - 31 of 31')
              within '.eui-pagination' do
                # first, previous, 1, 2, last
                expect(page).to have_selector('li', count: 5)
              end
              expect(page).to have_css('.active-page', text: '2')
            end
          end
        end
      end
    end
  end

  context 'when logging in as a cmr admin user' do
    before do
      login_admin
    end

    context 'when viewing the groups index page' do
      before do
        visit groups_path
      end

      it 'displays the system level and admin access only provider groups' do
        # intermittent error, Rspec ExpectationNotMetError
        # added logging comments to verify users and system level groups setup in cmr
        # using #syncrhonize, as used in draft_deletion_spec, ln 25
        # may need different solution
        page.document.synchronize do
          within '.groups-table' do
            expect(page).to have_content('Administrators_2 SYS The group of users that manages the CMR. CMR 2')
            expect(page).to have_content('SEDAC Admin Group Test group for provider SEDAC 2')
          end
        end
      end
    end
  end
end
