describe 'When viewing a template' do
  before do
    login
    draft = create(:full_collection_template, user: User.where(urs_uid: 'testuser').first)
    visit collection_template_path(draft)
  end

  it 'cannot be published' do
    expect(page).to have_no_content('Publish Collection')
  end

  it 'cannot be saved as a template' do
    expect(page).to have_no_content('Save as Template')
  end
end
