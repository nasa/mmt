describe 'Create new draft from variable', reset_provider: true do
  context 'when making a draft of a published variable' do
    before do
      login

      ingest_response, _concept_response = publish_variable_draft(name: 'Test Edit Variable Name')

      visit variable_path(ingest_response['concept-id'])

      click_on 'Edit Variable Record'
    end

    it 'displays a confirmation message on the variable draft preview page' do
      expect(page).to have_content('Variable Draft Created Successfully!')

      expect(page).to have_link('Publish Variable Draft')
      expect(page).to have_content('Test Edit Variable Name')
    end
  end

  context 'when working with the draft of a published variable' do
    before do
      login
      @native_id = 'TestVariableNativeId'
      ingest_response, _concept_response = publish_variable_draft(name: 'Test Edit Variable Name 2', native_id: @native_id)
    end

    context 'when trying to edit the draft name' do
      before do
        @variable_draft = create(:full_variable_draft, native_id: @native_id)
        visit edit_variable_draft_path(@variable_draft)
      end

      it 'cannot edit the name' do
        expect(page).to have_field('variable_draft[draft][name]', readonly: true)
      end
    end

    context 'when trying to publish/update a variable draft with a different name' do
      before do
        @variable_draft = create(:full_variable_draft, native_id: @native_id, draft_short_name: 'An Incompatible Name')
        visit variable_draft_path(@variable_draft)
        click_on 'Publish Variable Draft'
      end

      it 'does not succeed' do
        expect(page).to have_content('Variable Draft was not published successfully. Variable name [An Incompatible Name] does not match the existing variable name [Test Edit Variable Name 2]')
      end
    end
  end
end
