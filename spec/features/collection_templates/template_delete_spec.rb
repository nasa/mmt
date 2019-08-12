describe 'Template deletion', js: true do
  before do
    login
    draft = create(:full_collection_template, user: User.where(urs_uid: 'testuser').first)
    visit collection_template_path(draft)
  end

  context 'when adding and deleting a single template' do
    before do
      within '.action' do
        click_on 'Delete Collection Template'
        click_on 'Yes'
      end
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Collection Template Deleted Successfully!')

      expect(page).to have_content('MMT_2 Collection Templates')
    end
  end

  context 'when cancelling the deletion of a single template' do
    before do
      within '.action' do
        click_on 'Delete Collection Template'
        click_on 'No'
      end
    end

    it 'does NOT return to the manage collections page' do
      expect(page).to_not have_content('MMT_2 Collection Templates')
    end
  end
end

describe 'When deleting a template from the index page', js: true do
  before do
    login
    create(:full_collection_template, user: User.where(urs_uid: 'testuser').first, template_name: 'Example Name')
    visit collection_templates_path
  end

  context 'when deleting a single draft' do
    before do
      click_on 'Delete'
      click_on 'Yes'
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Collection Template Deleted Successfully!')

      expect(page).to have_no_content('Example Name')
    end
  end
end
