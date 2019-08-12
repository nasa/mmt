# frozen_string_literal: true

describe 'Creating a new draft from an existing template', js: true do
  template = nil
  before do
    login
    template = create(:full_collection_template, template_name: 'An Example Template', short_name: 'A Tale of Two Cities')
  end

  context 'when creating a draft from the manage collection page' do
    before do
      visit manage_collections_path
      find('#base_template').click
      select 'An Example Template', from: 'template_id'
      click_on('Create New Record')
    end

    context 'when examining the draft' do
      it 'it does not have a template name' do
        expect(CollectionDraft.first[:draft][:TemplateName]).to be_nil
      end

      it 'it does not have a template name field' do
        expect(page).to have_field('draft_short_name')
        expect(page).to have_no_field('draft_template_name')
      end
    end

    context 'when examining the downstream collection products' do
      it 'collection information can be edited' do
        fill_in 'Short Name', with: 'A Sample Draft Name - Chinchilla'

        within '.nav-top' do
          click_on 'Done'
        end

        expect(page).to have_content 'A Sample Draft Name - Chinchilla'
      end

      it 'file distribution information can be edited' do
        within '.nav-top' do
          click_on 'Previous'
        end

        click_on 'Expand All'
        within '#draft_archive_and_distribution_information_file_archive_information_0' do
          fill_in 'Format', with: '.chin'
        end

        within '.nav-top' do
          click_on 'Done'
        end

        expect(page).to have_content '.chin'
      end

      it 'does not retain a template name after the draft is made back into a template' do
        within '.nav-top' do
          click_on 'Done'
        end

        click_on 'Save as Template'
        expect(page).to have_field 'Template Name', with: ''
      end

      it 'can be published' do
        within '.nav-top' do
          click_on 'Done'
        end

        click_on 'Publish Collection Draft'
        expect(page).to have_content 'Collection Draft Published Successfully'
        expect(page).to have_link 'Save as Template'
        expect(page).to have_link 'Edit Collection Record'
      end
    end
  end

  context 'when creating a draft while viewing its metadata' do
    before do
      visit collection_template_path(template)
      click_on 'Create Collection Draft'
    end

    it 'makes a collection draft and navigates to the correct edit page' do
      expect(page).to have_field 'Short Name'
      expect(page).to have_no_field 'Template Name'

      visit manage_collections_path
      expect(page).to have_content 'A Tale of Two Cities'
    end
  end
end
