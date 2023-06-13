describe 'Tool Draft Forms Field Validation', js: true do
  let(:empty_draft) { create(:empty_tool_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login

  end

  context 'validation of top level required fields' do
    context 'when there is an empty draft' do
      before do
        visit edit_tool_draft_path(empty_draft)
      end
      context 'when immediately trying to submit a form with required fields' do
        before do
          within '.nav-top' do
            click_on 'Save'
          end
        end

        it 'displays a modal with a prompt about saving invalid data' do
          expect(page).to have_content('This page has invalid data. Are you sure you want to save it and proceed?')
        end

        context 'when choosing not to proceed' do
          before do
            within '#invalid-draft-modal' do
              click_on 'No'
            end
          end

          it 'displays the error messages at the top of the page' do
            within '.summary-errors' do
              expect(page).to have_content('Name is required')
              expect(page).to have_content('Long Name is required')
              expect(page).to have_content('Version is required')
              expect(page).to have_content('Type is required', count: 3) # there is a 3rd because URL Content Type is captured also
              expect(page).to have_content('Description is required')
              expect(page).to have_content('URL Content Type is required')
              expect(page).to have_content('URL Value is required')
            end
          end

          it 'displays the error messages under the form elements' do
            within '#tool_draft_draft_name + #tool_draft_draft_name_error' do
              expect(page).to have_content('Name is required')
            end
            within '#tool_draft_draft_long_name + #tool_draft_draft_long_name_error' do
              expect(page).to have_content('Long Name is required')
            end
            within '#tool_draft_draft_version + #tool_draft_draft_version_error' do
              expect(page).to have_content('Version is required')
            end
            within '#tool_draft_draft_type + #tool_draft_draft_type_error' do
              expect(page).to have_content('Type is required')
            end
            within '#tool_draft_draft_description + #tool_draft_draft_description_error' do
              expect(page).to have_content('Description is required')
            end
            within '#tool_draft_draft_url_url_content_type + #tool_draft_draft_url_url_content_type_error' do
              expect(page).to have_content('URL Content Type is required')
            end
            within '#tool_draft_draft_url_type + #tool_draft_draft_url_type_error' do
              expect(page).to have_content('Type is required')
            end
            within '#tool_draft_draft_url_url_value + #tool_draft_draft_url_url_value_error' do
              expect(page).to have_content('URL Value is required')
            end
          end
        end
      end

      context 'when visiting required fields without filling them in' do
        context 'when no data is entered into the field' do
          before do
            find('#tool_draft_draft_name').click
            find('#tool_draft_draft_long_name').click
            find('#tool_draft_draft_version_description').click
          end

          it 'displays validation error messages' do
            expect(page).to have_css('.eui-banner--danger', count: 3)

            within '.summary-errors' do
              expect(page).to have_content('This draft has the following errors:')
              expect(page).to have_content('Name is required')
              expect(page).to have_content('Long Name is required')
            end

            expect(page).to have_css('#tool_draft_draft_name_error', text: 'Name is required')
            expect(page).to have_css('#tool_draft_draft_long_name_error', text: 'Long Name is required')

          end

          context 'when data is entered into the field' do
            before do
              fill_in 'Name', with: 'Test Tool Short Name'
              fill_in 'Long Name', with: 'Test Tool Long Long Name'
              find('body').click
            end

            it 'does not display validation error messages' do
              expect(page).to have_no_css('.eui-banner--danger')
            end
          end
        end
      end
    end
  end

  context 'when only filling out some of the required subfields of an unrequired field' do
    context 'when on the Tool Contacts Form' do
      before do
        visit edit_tool_draft_path(empty_draft, 'tool_contacts')

        click_on 'Expand All'

        within '#contact-groups' do
          fill_in 'Value', with: 'who'
        end
      end

      context "when clicking 'Done' to submit the form" do
        before do
          within '.nav-top' do
            click_on 'Done'
          end
        end

        context "when clicking 'No' to stay on the form" do
          before do
            click_on 'No'
          end

          it 'displays validation errors' do
            expect(page).to have_css('.eui-banner--danger', count: 4)

            within '.summary-errors' do
              expect(page).to have_content('This draft has the following errors:')
              expect(page).to have_content('Roles is required')
              expect(page).to have_content('Group Name is required')
              expect(page).to have_content('Type is required')
            end

            expect(page).to have_css('#tool_draft_draft_contact_groups_0_roles_error', text: 'Roles is required')
            expect(page).to have_css('#tool_draft_draft_contact_groups_0_group_name_error', text: 'Group Name is required')
            expect(page).to have_css('#tool_draft_draft_contact_groups_0_contact_information_contact_mechanisms_0_type_error', text: 'Type is required')
          end

          context 'when removing the value from the required field of an unrequired field' do
            before do
              within '#contact-groups' do
                fill_in 'Value', with: ''
              end
            end

            it 'does not display any validation errors' do
              expect(page).to have_no_css('.eui-banner--danger')
            end
          end
        end

        # TODO requires show page
        # context "when clicking 'Yes' to go to the show page" do
        #   before do
        #     click_on 'Yes'
        #   end
        #
        #   it 'displays an invalid progress circle' do
        #     expect(page).to have_css('i.icon-red.contact-groups')
        #   end
        # end
      end
    end

    context 'when on the Related URLs form' do
      before do
        visit edit_tool_draft_path(empty_draft, 'related_urls')

        fill_in 'URL', with: 'example.com'
      end

      context "when clicking 'Done' to submit the form" do
        before do
          within '.nav-top' do
            click_on 'Done'
          end
        end

        context "when clicking 'No' to stay on the form" do
          before do
            click_on 'No'
          end

          it 'displays validation errors' do
            expect(page).to have_css('.eui-banner--danger', count: 3)

            within '.summary-errors' do
              expect(page).to have_content('This draft has the following errors:')
              expect(page).to have_content('URL Content Type is required')
              expect(page).to have_content('Type is required', count: 2) # other error gets picked up too
            end

            expect(page).to have_css('#tool_draft_draft_related_urls_0_url_content_type_error', text: 'URL Content Type is required')
            expect(page).to have_css('#tool_draft_draft_related_urls_0_type_error', text: 'Type is required')
          end

          context 'when removing the value from the required field of an unrequired field' do
            before do
              fill_in 'URL', with: ''
            end

            it 'does not display any validation errors' do
              expect(page).to have_no_css('.eui-banner--danger')
            end
          end
        end

        # TODO requires show page
        # context "when clicking 'Yes' to go to the show page" do
        #   before do
        #     click_on 'Yes'
        #   end
        #
        #   it 'displays an invalid progress circle' do
        #     expect(page).to have_css('i.icon-red.related-urls')
        #   end
        # end
      end
    end
  end
end
