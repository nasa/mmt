describe 'Header' do
  before do
    login
  end

  before :all do
    @origin_c_config = Rails.configuration.umm_c_version
    Rails.configuration.umm_c_version = "vnd.nasa.cmr.umm+json; version=1.23"
    @origin_s_config = Rails.configuration.umm_s_version
    Rails.configuration.umm_s_version = "vnd.nasa.cmr.umm+json; version=2.23"
    @origin_var_config = Rails.configuration.umm_var_version
    Rails.configuration.umm_var_version = "vnd.nasa.cmr.umm+json; version=1.90"
  end

  after :all do
    Rails.configuration.umm_c_version = @origin_c_config
    Rails.configuration.umm_s_version = @origin_s_config
    Rails.configuration.umm_var_version = @origin_var_config
  end

  context 'when viewing the header' do
    context 'when proposal mode is turned off' do
      before do
        set_as_mmt_proper
      end

      context 'from the Manage Collections page' do
        before do
          visit manage_collections_path
        end

        it 'has "Manage Collections" as the underlined current header link' do
          within 'main header' do
            expect(page).to have_css('h2.current', text: 'Manage Collections')
          end
        end

        it 'has version label' do
          within 'main header h2.current' do
            expect(page).to have_css('span.eui-badge--sm.umm-version-label')
            expect(page).to have_content('v1.23')
          end
        end

        it 'has the correct header tab links' do
          within 'main header' do
            expect(page).to have_content('Manage Collections')
            expect(page).to have_content('Manage Variables')
            expect(page).to have_content('Manage Services')
            expect(page).to have_content('Manage CMR')

            expect(page).to have_no_content('Manage Collection Proposals')
          end
        end

        it 'does not display the badge for MMT for Non-NASA users' do
          within 'header.mmt-header' do
            expect(page).to have_no_content('Non-NASA Users')
          end
        end
      end

      context 'from the Manage Services page' do
        before do
          visit manage_services_path
        end

        it 'has "Manage Services" as the underlined current header link' do
          within 'main header' do
            expect(page).to have_css('h2.current', text: 'Manage Services')
          end
        end

        it 'has version label' do
          within 'main header h2.current' do
            expect(page).to have_css('span.eui-badge--sm.umm-version-label')
            expect(page).to have_content('v2.23')
          end
        end

        it 'has the correct header tab links' do
          within 'main header' do
            expect(page).to have_content('Manage Collections')
            expect(page).to have_content('Manage Variables')
            expect(page).to have_content('Manage Services')
            expect(page).to have_content('Manage CMR')

            expect(page).to have_no_content('Manage Collection Proposals')
          end
        end

        it 'does not display the badge for MMT for Non-NASA users' do
          within 'header.mmt-header' do
            expect(page).to have_no_content('Non-NASA Users')
          end
        end
      end

      context 'from the Manage Variables page' do
        before do
          visit manage_variables_path
        end

        it 'has "Manage Variables" as the underlined current header link' do
          within 'main header' do
            expect(page).to have_css('h2.current', text: 'Manage Variables')
          end
        end

        it 'has version label' do
          within 'main header h2.current' do
            expect(page).to have_css('span.eui-badge--sm.umm-version-label')
            expect(page).to have_content('v1.90')
          end
        end

        it 'has the correct header tab links' do
          within 'main header' do
            expect(page).to have_content('Manage Collections')
            expect(page).to have_content('Manage Variables')
            expect(page).to have_content('Manage Services')
            expect(page).to have_content('Manage CMR')

            expect(page).to have_no_content('Manage Collection Proposals')
          end
        end

        it 'does not display the badge for MMT for Non-NASA users' do
          within 'header.mmt-header' do
            expect(page).to have_no_content('Non-NASA Users')
          end
        end
      end

      context 'from the Manage Cmr page' do
        before do
          visit manage_cmr_path
        end

        it 'has "Manage CMR" as the underlined current header link' do
          within 'main header' do
            expect(page).to have_css('h2.current', text: 'Manage CMR')
          end
        end

        it 'has the correct header tab links' do
          within 'main header' do
            expect(page).to have_content('Manage Collections')
            expect(page).to have_content('Manage Variables')
            expect(page).to have_content('Manage Services')
            expect(page).to have_content('Manage CMR')

            expect(page).to have_no_content('Manage Collection Proposals')
          end
        end

        it 'does not display the badge for MMT for Non-NASA users' do
          within 'header.mmt-header' do
            expect(page).to have_no_content('Non-NASA Users')
          end
        end
      end

      context 'when clicking the profile link' do
        before do
          visit manage_collections_path
          click_on 'profile-link'
        end

        it 'displays the User Info Dropdown Menu with the correct links' do
          within '#login-info' do
            expect(page).to have_link('Change Provider')
            expect(page).to have_link("User's Guide", href: 'https://wiki.earthdata.nasa.gov/display/CMR/Metadata+Management+Tool+%28MMT%29+User%27s+Guide')
            expect(find_link("User's Guide")[:target]).to eq('_blank')
            expect(page).to have_link('Logout', href: logout_path)
          end
        end
      end
    end

    context 'when proposal mode is turned on' do
      before do
        set_as_proposal_mode_mmt(with_required_acl: true)
      end

      context 'from the Manage Collections page' do
        before do
          visit manage_collection_proposals_path
        end

        it 'has "Manage Collection Proposals" as the underlined current header link' do
          within 'main header' do
            expect(page).to have_css('h2.current', text: 'Manage Collection Proposals')
          end
        end

        it 'has the correct header tab links' do
          within 'main header' do
            expect(page).to have_content('Manage Collection Proposals')

            expect(page).to have_no_content('Manage Collections')
            expect(page).to have_no_content('Manage Variables')
            expect(page).to have_no_content('Manage Services')
            expect(page).to have_no_content('Manage CMR')
          end
        end

        it 'indicates that the user is using the MMT for Non-Nasa Users' do
          within 'header.mmt-header' do
            expect(page).to have_content('Non-NASA Users')
          end
        end
      end
    end
  end
end
