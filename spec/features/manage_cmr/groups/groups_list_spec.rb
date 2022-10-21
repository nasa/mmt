# These tests are for the Groups Index page filtering by radio buttons/checkboxes
# which set current or available providers, or to show system groups
describe 'Groups list page', js: true, reset_provider: true do
  context 'when there are system level groups' do
    context 'when logging in as a regular user with all the providers' do
      before do
        # we need to set these available providers, or the filter will not show
        # the groups in all the providers
        login(providers: %w[MMT_1 MMT_2 LARC SEDAC NSIDC_ECS])
      end

      context 'when viewing the groups page' do
        context 'when there are no groups' do
          before do
            empty = '{"hits": 0, "took": 7, "items": []}'
            empty_response = cmr_success_response(empty)
            allow_any_instance_of(Cmr::UrsClient).to receive(:get_edl_groups).and_return(empty_response)

            visit groups_path
          end

          it 'does not show any groups' do
            expect(page).to have_content('No groups found.')
          end
        end

        context 'when there are provider groups under the pagination limit' do
          before do
            VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
              visit groups_path
            end
          end

          it 'displays only the groups from the current provider by default' do
            expect(page).to have_checked_field('Current Provider')

            # groups created on our local cmr setup
            expect(page).to have_content('Local admin group for provider MMT_2')
          end

          context 'when choosing to display groups from Available Providers' do
            before do
              VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
                within '.groups-filters' do
                  choose 'Available Providers'
                  click_on 'Apply Filters'
              end
              end
            end

            it 'displays groups from all Available Providers' do
              expect(page).to have_checked_field('Available Providers')
              # groups created on our local cmr setup
              within '.groups-table' do
                expect(page).to have_content('The super group for provider LARC')
                expect(page).to have_content('Local admin group for provider MMT_1')
                expect(page).to have_content('Local admin group for provider MMT_2')
              end
            end

            it 'does not display system level and admin access only provider groups' do
              within '.groups-table' do
                expect(page).to have_no_content('Administrators CMR Administrators CMR 2')
                expect(page).to have_no_content('Administrators_2 The group of users that manages the CMR. CMR')
                expect(page).to have_no_content('SEDAC Admin Group Test group for provider SEDAC')
              end
            end

            it 'does not display options to display system groups' do
              within '.groups-filters' do
                expect(page).to have_no_content('System Groups')
                expect(page).to have_no_unchecked_field('Show System Groups?')

                # CMR is only added to the provider list if they have access to
                # system groups and the Show System Groups? checkbox is checked
                expect(page).to have_no_select('provider-group-filter', with_options: ['CMR'])
              end
            end
          end
        end

        context 'when there are paginated groups' do
          before do
            VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
              visit groups_path
            end
          end

          it 'lists the first page of groups' do
            within '.groups-table' do
              expect(page).to have_selector('tbody tr', count: 25)
              # cmr controls the order so we should not test specific groups
            end
          end

          it 'displays the pagination information for page 1' do
            expect(page).to have_content('Showing Groups 1 - 25 of 239')
            within '.eui-pagination' do
              # first, 1, 2, next, last
              expect(page).to have_selector('li', count: 9)
            end
            expect(page).to have_css('.active-page', text: '1')
          end

          context 'when clicking to the second page' do
            before do
              VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
                click_link '2'
              end
            end

            it 'lists the second page of groups' do
              within '.groups-table' do
                expect(page).to have_selector('tbody tr', count: 25)
                # cmr controls the order so we should not test specific groups
              end
            end

            it 'displays the pagination information for page 2' do
              expect(page).to have_content('Showing Groups 26 - 50 of 239')
              within '.eui-pagination' do
                # first, previous, 1, 2, last
                expect(page).to have_selector('li', count: 11)
              end
              expect(page).to have_css('.active-page', text: '2')
            end
          end
        end
      end
    end

    context 'when logging in as a regular user with only some providers' do
      before do
        # we need to set these available providers, or the filter will not show
        # the groups in all the providers
        login(providers: %w[MMT_1 MMT_2])
      end

      context 'when visiting the groups index page and choosing to display groups from Available Providers' do
        before do
          VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
            visit groups_path
            within '.groups-filters' do
              choose 'Available Providers'
              click_on 'Apply Filters'
            end
          end
        end

        it 'displays groups from Available Providers' do
          expect(page).to have_checked_field('Available Providers')

          within '.groups-table' do
            expect(page).to have_content('Local admin group for provider MMT_1')
            expect(page).to have_content('Local admin group for provider MMT_2')
          end
        end

        it 'does not display groups from other providers, or system level and admin access only provider groups' do
          within '.groups-table' do
            expect(page).to have_no_content('The super group for provider LARC')
            expect(page).to have_no_content('The super group for provider NSIDC_ECS')

            expect(page).to have_no_content('Administrators CMR Administrators CMR 2')
            expect(page).to have_no_content('Administrators_2 The group of users that manages the CMR. CMR')
            expect(page).to have_no_content('SEDAC Admin Group Test group for provider SEDAC')
          end
        end

        it 'does not display options to display system groups' do
          within '.groups-filters' do
            expect(page).to have_no_content('System Groups')
            expect(page).to have_no_unchecked_field('Show System Groups?')

            # CMR is only added to the provider list if they have access to
            # system groups and the Show System Groups? checkbox is checked
            expect(page).to have_no_select('provider-group-filter', with_options: ['CMR'])
          end
        end
      end
    end
  end

  context 'when logging in as an admin user with some of the providers' do
    before do
      login_admin(providers: %w[MMT_1 MMT_2])
    end

    context 'when visiting the groups index page' do
      before do
        VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
          visit groups_path
        end
      end

      it 'displays only the groups from the current provider by default' do
        expect(page).to have_content('Local admin group for provider MMT_2')
      end

      context 'when choosing to display groups from all Available Providers' do
        before do
          within '.groups-filters' do
            choose 'Available Providers'
          end
        end

        it 'displays the option to show System Groups' do
          within '.groups-filters' do
            expect(page).to have_content('System Groups')
            expect(page).to have_unchecked_field('Show System Groups?')

            # CMR is only added to the provider list if they have access to
            # system groups and the Show System Groups? checkbox is checked
            expect(page).to have_no_select('provider-group-filter', with_options: ['CMR'])
          end
        end

        context 'when choosing to display System Groups then applying the filters' do
          before do
            VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
              within '.groups-filters' do
                check 'Show System Groups?'
                click_on 'Apply Filters'
              end
            end
          end

          it 'displays the correct filters for provider and system groups' do
            within '.groups-filters' do
              expect(page).to have_checked_field('Available Providers')
              expect(page).to have_checked_field('Show System Groups?')

              # CMR is only added to the provider list if they have access to
              # system groups and the Show System Groups? checkbox is checked
              expect(page).to have_no_select('provider-group-filter', with_options: ['CMR'])
            end
          end

          it 'displays the provider and system level groups' do
            VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
              click_on 'Last'
            end
            within '.groups-table' do
              # Provider level groups
              expect(page).to have_content('The super group for provider LARCtest1')
              expect(page).to have_content('Local admin group for provider MMT_1test2')
              expect(page).to have_content('Local admin group for provider MMT_2test3')
              expect(page).to have_content('The super group for provider NSIDC_ECStest4')

              # Provider group with only admin users
              expect(page).to have_content('SEDAC Admin Group Test group for provider SEDACtest5')

              # System level groups
              expect(page).to have_content('Administrators SYS CMRtest6')
              expect(page).to have_content('Administrators_2 SYS The group of users that manages the CMR. CMRtest7')
            end
          end
        end
      end
    end
  end
end
