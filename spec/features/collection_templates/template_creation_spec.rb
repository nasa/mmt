describe 'Create new collection template from cloning a collection', js: true do
  before :all do
    @ingest_response, @concept_response = publish_collection_draft(short_name: 'Example1')
  end

  context 'when cloning a CMR collection as a template' do
    before do
      login

      visit collection_path(@ingest_response['concept-id'])

      click_on 'Save as Template'
    end

    it 'displays the new template page with data' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Collection Templates')
      end

      expect(page).to have_field('draft_template_name')
      expect(page).to have_field('draft_short_name', with: 'Example1')
    end

    it 'cannot be saved without adding a name' do
      within '.nav-top' do
        click_on 'Save'
      end

      expect(page).to have_content('A template needs a unique name to be saved.')
      expect(page).to have_content('Template Name is required')
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

        login(provider: 'MMT_1', providers: %w(MMT_1 MMT_2))

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

#describe 'Create new collection template from cloning a draft', js: true do
  #click ze button
#end

#describe 'Create new collection template from scratch', js: true do
  #click ze button
  #error validation
  #invalid template modal
  #go back and try to make another
#end

#collection_draft_edit does not have template name
#collection_draft_edit does not lock a user from submitting for not having a template name
