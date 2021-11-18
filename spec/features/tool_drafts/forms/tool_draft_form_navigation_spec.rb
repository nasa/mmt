include DraftsHelper

describe 'Tool Drafts form navigation', js: true do
  form_names = %w[tool_information related_urls compatibility_and_usability descriptive_keywords tool_organizations tool_contacts potential_action]

  context 'when visiting the edit page for a full tool draft' do
    let(:full_draft) { create(:full_tool_draft) }

    before do
      login

      visit edit_tool_draft_path(full_draft)
    end

    context 'when using the top navigation dropdown to navigate to forms' do
      form_names.each do |form_name|
        # Note - randomization causes test result order to not agree with forms order.
        next_form_title = titleize_form_name(get_next_form(form_name, form_names, 'Next'))
        next_form_name = get_next_form(form_name, form_names, 'Next')

        context "when choosing #{next_form_title} from the form selection drop down" do
          before do
            select next_form_title, from: 'next-section-top'

            expect(page).to have_content(next_form_title)
          end

          # this can be added back when it can be done from the show page
          # because Tool Information does not update when chosen from the same page
          # it 'displays a confirmation message' do
          #   expect(page).to have_content('Tool Draft Updated Successfully!')
          # end

          it "saves the form and renders the #{next_form_title} form" do
            within 'header .collection-basics > h2' do
              expect(page).to have_content(next_form_title)
            end
            within '.eui-breadcrumbs' do
              expect(page).to have_content('Tool Drafts')
              expect(page).to have_content(next_form_title)
            end
          end

          it 'has the correct value selected in the `Save & Jump To` dropdown' do
            within '.nav-top' do
              expect(find(:css, 'select[name=jump_to_section]').value).to eq(next_form_name)
            end

            within '.nav-bottom' do
              expect(find(:css, 'select[name=jump_to_section]').value).to eq(next_form_name)
            end
          end

          it 'displays the buttons in navigation bar(s)' do
            within '.nav-top' do
              expect(page).to have_button('Previous')
              expect(page).to have_button('Next')
              expect(page).to have_button('Save')
              expect(page).to have_button('Done')
            end
            within '.nav-bottom' do
              expect(page).to have_button('Previous')
              expect(page).to have_button('Next')
              expect(page).to have_button('Save')
              expect(page).to have_button('Done')
            end
          end
        end
      end
    end

    context 'when using the bottom navigation dropdown to navigate to forms' do
      form_names.each do |form_name|
        # Note - randomization causes test result order to not agree with forms order.
        next_form_title = titleize_form_name(get_next_form(form_name, form_names, 'Next'))
        next_form_name = get_next_form(form_name, form_names, 'Next')

        context "when choosing #{next_form_title} from the form selection drop down" do
          before do
            select next_form_title, from: 'next-section-bottom'

            # wait_for_jQuery
            expect(page).to have_content(next_form_title)
          end

          # this can be added back when it can be done from the show page
          # because Tool Information does not update when chosen from the same page
          # it 'displays a confirmation message' do
          #   expect(page).to have_content('Tool Draft Updated Successfully!')
          # end

          it "saves the form and renders the #{next_form_title} form" do
\
            within 'header .collection-basics > h2' do
              expect(page).to have_content(next_form_title)
            end
            within '.eui-breadcrumbs' do
              expect(page).to have_content('Tool Drafts')
              expect(page).to have_content(next_form_title)
            end
          end

          it 'has the correct value selected in the `Save & Jump To` dropdown' do
            within '.nav-top' do
              expect(find(:css, 'select[name=jump_to_section]').value).to eq(next_form_name)
            end

            within '.nav-bottom' do
              expect(find(:css, 'select[name=jump_to_section]').value).to eq(next_form_name)
            end
          end

          it 'displays the buttons in navigation bar(s)' do
            within '.nav-top' do
              expect(page).to have_button('Previous')
              expect(page).to have_button('Next')
              expect(page).to have_button('Save')
              expect(page).to have_button('Done')
            end
            within '.nav-bottom' do
              expect(page).to have_button('Previous')
              expect(page).to have_button('Next')
              expect(page).to have_button('Save')
              expect(page).to have_button('Done')
            end
          end
        end
      end
    end

    context 'when clicking the "Next" button at the top to navigate through forms' do
      form_names.size.times do |index|
        # Note - randomization causes test result order to not agree with forms order.
        current_form_name = form_names[index]
        next_form_name = get_next_form(form_names[index], form_names, 'Next')
        current_form_title = titleize_form_name(current_form_name)
        next_form_title = titleize_form_name(get_next_form(current_form_name, form_names, 'Next'))

        context "when pressing the 'Next' button from the #{current_form_title} form" do
          before do
            visit edit_tool_draft_path(full_draft, current_form_name)

            within '.nav-top' do
              click_on 'Next'
            end
          end

          it 'displays a confirmation message' do
            expect(page).to have_content('Tool Draft Updated Successfully!')
          end

          it "displays the correct page (#{next_form_title})" do
            within 'header .collection-basics > h2' do
              expect(page).to have_content(next_form_title)
            end
            within '.eui-breadcrumbs' do
              expect(page).to have_content('Tool Drafts')
              expect(page).to have_content(next_form_title)
            end
          end

          it 'has the correct value selected in the `Save & Jump To` dropdown' do
            within '.nav-top' do
              expect(find(:css, 'select[name=jump_to_section]').value).to eq(next_form_name)
            end

            within '.nav-bottom' do
              expect(find(:css, 'select[name=jump_to_section]').value).to eq(next_form_name)
            end
          end

          it 'displays the buttons in navigation bar(s)' do
            within '.nav-top' do
              expect(page).to have_button('Previous')
              expect(page).to have_button('Next')
              expect(page).to have_button('Save')
              expect(page).to have_button('Done')
            end
            within '.nav-bottom' do
              expect(page).to have_button('Previous')
              expect(page).to have_button('Next')
              expect(page).to have_button('Save')
              expect(page).to have_button('Done')
            end
          end
        end
      end
    end

    context 'when clicking the "Previous" button at the bottom to navigate through forms' do
      form_names.size.times do |index|
        # Note - randomization causes test result order to not agree with forms order.
        current_form_name = form_names[index]
        previous_form_name = get_next_form(form_names[index], form_names, 'Previous')
        current_form_title = titleize_form_name(current_form_name)
        previous_form_title = titleize_form_name(get_next_form(current_form_name, form_names, 'Previous'))

        context "when pressing the 'Previous' button from the #{current_form_title} form" do
          before do
            visit edit_tool_draft_path(full_draft, current_form_name)

            within '.nav-bottom' do
              click_on 'Previous'
            end
          end

          it 'displays a confirmation message' do
            expect(page).to have_content('Tool Draft Updated Successfully!')
          end

          it "displays the correct page (#{previous_form_title})" do
            within 'header .collection-basics > h2' do
              expect(page).to have_content(previous_form_title)
            end
            within '.eui-breadcrumbs' do
              expect(page).to have_content('Tool Drafts')
              expect(page).to have_content(previous_form_title)
            end
          end

          it 'has the correct value selected in the `Save & Jump To` dropdown' do
            within '.nav-top' do
              expect(find(:css, 'select[name=jump_to_section]').value).to eq(previous_form_name)
            end

            within '.nav-bottom' do
              expect(find(:css, 'select[name=jump_to_section]').value).to eq(previous_form_name)
            end
          end

          it 'displays the buttons in navigation bar(s)' do
            within '.nav-top' do
              expect(page).to have_button('Previous')
              expect(page).to have_button('Next')
              expect(page).to have_button('Save')
              expect(page).to have_button('Done')
            end
            within '.nav-bottom' do
              expect(page).to have_button('Previous')
              expect(page).to have_button('Next')
              expect(page).to have_button('Save')
              expect(page).to have_button('Done')
            end
          end
        end
      end
    end
  end
end
