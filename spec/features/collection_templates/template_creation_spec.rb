describe 'Create new collection template from cloning a collection', js: true do
  before :all do
    @ingest_response, @concept_response = publish_collection_draft
  end

  context 'when cloning a CMR collection as a template' do
    before do
      login

      visit collection_path(@ingest_response['concept-id'])

      click_on 'Save as Template'
    end

    it 'displays the new template page' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Collection Templates')
      end

      expect(page).to have_field('draft_template_name')
    end

    it 'cannot be saved without adding a name' do
      within '.nav-top' do
        click_on 'Save'
      end

      expect(page).to have_content('A template needs a unique name to be saved.')
      expect(page).to have_content('Template Name is required')
    end

    it 'can be saved with a unique name and retains information' do
      fill_in 'Template Name', with: 'Unique Name'
      within '.nav-top' do
        click_on 'Done'
      end

      find('.tab-label', text: 'Download Data').click

      expect(page).to have_content('Earthdata Search')
    end
  end
end

describe 'Create new collection template from cloning a collection with a different provider', js: true do
  modal_text = 'requires you change your provider context to MMT_2'

  context 'when viewing a collection' do
    before do
      login
    end

    context 'when the collections provider is in the users available providers' do
      before do
        ingest_response, _concept_response = publish_collection_draft(revision_count: 2)

        login(provider: 'MMT_1', providers: %w[MMT_1 MMT_2])

        visit collection_path(ingest_response['concept-id'])
      end

      it 'displays the action links' do
        expect(page).to have_link('Save as Template')
      end

      context 'when clicking the save as template link' do
        before do
          click_on 'Save as Template'
        end

        it 'displays a modal informing the user they need to switch providers' do
          expect(page).to have_content("Creating a template from this collection #{modal_text}")
        end

        context 'when clicking Yes' do
          before do
            # click_on 'Yes'
            find('.not-current-provider-link').click
            wait_for_jQuery
          end

          it 'switches the provider context' do
            expect(User.first.provider_id).to eq('MMT_2')
          end

          context 'takes the user to the "new" page' do
            it 'arrives at the "new" page' do
              expect(page).to have_content('Template Name')
            end

            it 'and it can be saved with a name' do
              fill_in 'Template Name', with: 'A unique name'
              within '.nav-top' do
                click_on 'Done'
              end

              expect(page).to have_content('A unique name')
              expect(page).to have_content('Collection Template Created Successfully')
            end
          end
        end
      end
    end
  end
end

describe 'Create new collection template from cloning a draft', js: true do
  before do
    login
    visit manage_collections_path
    click_on 'Create New Record'

    fill_in 'Short Name', with: 'Inigo Montoya'
    within '.nav-top' do
      click_on 'Done'
    end

    click_on 'Yes'

    click_on 'Save as Template'
  end

  context 'when it has navigated to the new page' do
    it 'navigates to the "new" page' do
      expect(page).to have_content('Template Name')
    end

    it 'can be saved with a unique name' do
      fill_in 'Template Name', with: 'Unique Name'
      within '.nav-top' do
        click_on 'Done'
      end

      click_on 'Yes'

      expect(page).to have_content('Unique Name')
    end
  end
end

describe 'When trying to save a template with a non-unique name', js: true do
  before do
    login
    visit collection_templates_path
    click_on 'Create a Collection Template'
    fill_in 'Template Name', with: 'Unique Name'
    within '.nav-top' do
      click_on 'Done'
    end
    click_on 'Yes'

    visit collection_templates_path
    click_on 'Create a Collection Template'
  end

  it 'validates locally' do
    fill_in 'Template Name', with: 'Unique Name'

    within '.nav-top' do
      click_on 'Done'
    end

    expect(page).to have_content('A template needs a unique name to be saved.')
    expect(page).to have_content('Template Name must be unique within a provider context')
  end

  context 'when the model generates an error' do
    before do
      fill_in 'Template Name', with: 'Unique Name2'

      within '.nav-top' do
        click_on 'Done'
      end

      click_on 'Yes'

      page.go_back # Use browser to go back, to avoid triggering the local validation

      fill_in 'Short Name', with: 'Kept on failure'

      within '.nav-top' do
        click_on 'Done'
      end

      click_on 'Yes'
    end

    it 'has the correct model error text' do
      expect(page).to have_content('Collection Template was not saved because of the following errors: template name must be unique within a provider context') # Verify model error
    end

    it 'has retained the user\'s changes' do
      expect(page).to have_field('Short Name', with: 'Kept on failure')
    end

    it 'has the correct new local validation' do
      fill_in 'Template Name', with: 'Unique Name2'
      fill_in 'Short Name', with: 'Different text'

      expect(page).to have_content('Collection Template was not saved because of the following errors: template name') # Verify that name list is updating on failure

      fill_in 'Template Name', with: 'Unique Name3'
      fill_in 'Short Name', with: 'Different text'

      expect(page).to have_no_content('Template Name must be unique within a provider context')
    end
  end
end
