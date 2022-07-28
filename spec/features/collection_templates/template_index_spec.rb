# The tests in this file verify that the index page contains the expected elements

describe 'When visiting the template index page', js:true do
  context 'when there is one record' do
    before do
      login
      @template = create(:full_collection_template, collection_template_name: 'An Example Template')
      visit collection_templates_path
    end

    it 'has expected links for one record' do
      # Create button is actually a link
      expect(page).to have_link('Create a Collection Template', href: '/collection_templates/new')
      expect(page).to have_link('An Example Template', href: collection_template_path(@template['id']))
      expect(page).to have_link('Edit', href: edit_collection_template_path(@template['id']))
      expect(page).to have_link('Delete', href: '#delete-template-modal-0')
    end

    it 'the user can access the edit record page' do
      click_on 'Edit'

      expect(page).to have_content('An Example Template')
      expect(page).to have_content('Template Name')
    end

    it 'the user can access the view/show record page' do
      click_on 'An Example Template'

      expect(page).to have_content('An Example Template') # in the breadcrumbs
    end

    context 'when there are multiple records' do
      before do
        @template2 = create(:full_collection_template, collection_template_name: 'An Example Template2')
        visit collection_templates_path
      end

      it 'has expected links for both records' do
        expect(page).to have_link('An Example Template', href: collection_template_path(@template['id']))
        expect(page).to have_link('Edit', href: edit_collection_template_path(@template['id']))
        expect(page).to have_link('Delete', href: '#delete-template-modal-0')

        expect(page).to have_link('An Example Template2', href: collection_template_path(@template2['id']))
        expect(page).to have_link('Edit', href: edit_collection_template_path(@template2['id']))
        expect(page).to have_link('Delete', href: '#delete-template-modal-1')
      end
    end
  end
end
