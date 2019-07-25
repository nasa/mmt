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

    it 'displays the new template page with data' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Collection Templates')
      end

      expect(page).to have_field('draft_template_name')
      expect(page).to have_field('draft_short_name', with: 'stuff')
    end

    it 'cannot be saved without adding a name' do
      before do
        click_on 'Save'
      end

      expect(page).to have_content('A template needs a unique name to be saved.')
      expect(page).to have_content('Template Name is required')
    end
  end
end

describe 'Create new collection template from cloning a collection with a different provider', js: true do
  let(:short_name)  { 'Draft Title' }
  let(:entry_title) { 'Tropical Forest Observation Record' }
  let(:provider)    { 'MMT_2' }

  before do
    login

    create(:full_collection_draft, entry_title: entry_title, short_name: short_name, draft_entry_title: entry_title, draft_short_name: short_name, provider_id: provider)
  end

  let(:draft) { Draft.first }

  context 'when the draft provider is in the users available providers', js: true do
    before do
      login(provider: 'MMT_1', providers: %w(MMT_1 MMT_2))
    end

    context 'and the user tries to create a template' do
      before do
        visit collection_draft_path(draft)
        click_on 'Save as Template'
      end

      it 'has the right provider-switch message' do
        expect(page).to have_content('Creating a template from this collection')
      end

      it 'displays the new template page with data' do
        click_on 'Yes'

        expect(page).to have_field('draft_template_name')
        expect(page).to have_field('draft_short_name', with: 'stuff')
      end
    end
  end
end

describe 'Create new collection template from cloning a draft', js: true do
  #click ze button
end

describe 'Create new collection template from scratch', js: true do
  #click ze button
  #error validation
  #invalid template modal
  #go back and try to make another
end

#collection_draft_edit does not have template name
#collection_draft_edit does not lock a user from submitting for not having a template name
