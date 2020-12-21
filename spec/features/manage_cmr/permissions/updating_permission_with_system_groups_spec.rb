describe 'Updating Collection Permissions with System Groups', reset_provider: true do
  before :all do
    @group_name = random_group_name
    @group = create_group(name: @group_name, admin: false)
    admin_2_group_concept = group_concept_from_name('Administrators_2', 'access_token_admin')

    wait_for_cmr

    @collection_permission_name = 'Testing Collection Permissions with System Groups'
    original_collection_permission = {
      group_permissions: [{
        group_id: @group['concept_id'],
        permissions: %w(read order)
      }, {
        group_id: 'AG1200000000-CMR', # default CMR Administrators group
        permissions: %w(read order)
      }, {
        group_id: admin_2_group_concept, # Administrators_2
        permissions: ['read']
      }],
      catalog_item_identity: {
        'name': @collection_permission_name,
        'provider_id': 'MMT_2',
        'collection_applicable': true,
        'granule_applicable': false
      }
    }

    @collection_permission = cmr_client.add_group_permissions(original_collection_permission, 'access_token').body

    wait_for_cmr
  end

  after :all do
    remove_group_permissions(@collection_permission['concept_id'])
  end

  context 'when logging in as a regular user and viewing the collection permission' do
    before do
      login

      visit permission_path(@collection_permission['concept_id'])
    end

    it 'displays the collection permission' do
      expect(page).to have_content(@collection_permission_name)

      within '#granule-constraint-summary' do
        expect(page).to have_content('This permission does not grant access to granules.')
      end

      within '#permission-groups-table' do
        expect(page).to have_content(@group_name)
      end
    end

    it 'does not display the system groups' do
      within '#permission-groups-table' do
        expect(page).to have_no_content('Administrators')
        expect(page).to have_no_content('Administrators_2')
      end
    end

    context 'when editing the collection permission', js: true do
      before do
        click_on 'Edit'
      end

      it 'displays the permission information on the form' do
        expect(page).to have_field('Name', with: @collection_permission_name, readonly: true)

        expect(page).to have_checked_field('Collections')
        expect(page).to have_unchecked_field('Granules')

        within '#search_and_order_groups_cell' do
          expect(page).to have_css('li.select2-selection__choice', text: @group_name)
        end
      end

      it 'does not display the system groups on the form' do
        within '#search_groups_cell' do
          expect(page).to have_no_css('li.select2-selection__choice', text: 'Administrators_2 (SYS)')
        end

        within '#search_and_order_groups_cell' do
          expect(page).to have_no_css('li.select2-selection__choice', text: 'Administrators (SYS)')
        end
      end

      context 'when submitting the updates' do
        before do
          check('Granules')
          select('All Registered Users', from: 'Search and Order')

          click_on 'Submit'
        end

        it 'displays the updated collection permission' do
          expect(page).to have_content(@collection_permission_name)

          within '#permission-groups-table' do
            expect(page).to have_content(@group_name)
            expect(page).to have_content('All Registered Users')
          end
        end

        context 'when logging out and logging in as an admin user' do
          before do
            login_admin
          end

          context 'when viewing the collection permission' do
            before do
              visit permission_path(@collection_permission['concept_id'])
            end

            it 'displays the permission information' do
              expect(page).to have_content(@collection_permission_name)

              within '#permission-groups-table' do
                expect(page).to have_content(@group_name)
                expect(page).to have_content('All Registered Users')
              end
            end

            it 'displays the system groups' do
              within '#permission-groups-table' do
                expect(page).to have_content('Administrators SYS')
                expect(page).to have_content('Administrators_2 SYS')
              end
            end

            context 'when editing the collection permission' do
              before do
                click_on 'Edit'
              end

              it 'displays the permission information on the form' do
                expect(page).to have_field('Name', with: @collection_permission_name, readonly: true)

                expect(page).to have_checked_field('Collections')
                expect(page).to have_checked_field('Granules')

                within '#search_and_order_groups_cell' do
                  expect(page).to have_css('li.select2-selection__choice', text: @group_name)
                  expect(page).to have_css('li.select2-selection__choice', text: 'All Registered Users')
                end
              end

              it 'displays the system groups on the form' do
                within '#search_groups_cell' do
                  expect(page).to have_css('li.select2-selection__choice', text: 'Administrators_2 (SYS)')
                end

                within '#search_and_order_groups_cell' do
                  expect(page).to have_css('li.select2-selection__choice', text: 'Administrators (SYS)')
                end
              end

              context 'when submitting the updates' do
                before do
                  uncheck('Granules')

                  within '#collection-access-constraints-container' do
                    fill_in('Minimum Value', with: 5)
                    fill_in('Maximum Value', with: 25)
                    check('Include Undefined')
                  end

                  within '#search_and_order_groups_cell' do
                    page.find('.select2-selection__choice[title="Administrators (SYS)"] > .select2-selection__choice__remove').click
                  end

                  click_on 'Submit'
                end

                it 'displays the updated collection permission information' do
                  expect(page).to have_content(@collection_permission_name)

                  within '#collection-constraint-summary' do
                    expect(page).to have_content('between 5.0 and 25.0')
                    expect(page).to have_content('(or are undefined)')
                  end

                  within '#granule-constraint-summary' do
                    expect(page).to have_content('This permission does not grant access to granules.')
                  end

                  within '#permission-groups-table' do
                    expect(page).to have_content(@group_name)
                    expect(page).to have_content('All Registered Users')
                    expect(page).to have_content('Administrators_2 SYS')
                  end
                end
              end
            end
          end
        end
      end
    end
  end
end
