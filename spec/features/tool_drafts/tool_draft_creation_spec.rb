describe 'Tool Draft creation' do
  before do
    login
  end

  context 'when creating a brand new tool draft' do
    before do
      visit new_tool_draft_path
    end

    it 'creates a new blank tool draft' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Tool Drafts')
        expect(page).to have_content('New')
      end
    end

    it 'renders the "Tool Information" form' do
      within '.umm-form fieldset h3' do
        expect(page).to have_content('Tool Information')
      end
    end

    context 'when saving data into the tool draft', js: true do
      before do
        fill_in 'tool_draft_draft_name', with: 'test tool draft'

        within '.nav-top' do
          click_on 'Save' # TODO: in MMT-2226, change this to 'Done'
        end

        click_on 'Yes'
      end

      it 'displays a confirmation message' do
        expect(page).to have_content('Tool Draft Created Successfully!')
      end

      # TODO: this requires the show path, MMT-2226
      # context "when accessing a tool draft's json" do
      #   before do
      #     visit tool_draft_path(ToolDraft.first, format: 'json')
      #   end
      #
      #   it 'displays json' do
      #     expect(page).to have_content("{\n  \"Name\": \"test service draft\"\n}")
      #   end
      # end
    end
  end
end
