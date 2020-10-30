describe 'Tool Drafts Smart Handoff Information Form', js: true do
  before do
    login
    draft = create(:empty_tool_draft, user: User.where(urs_uid: 'testuser').first)
    visit edit_tool_draft_path(draft, 'smart_handoff_information')
  end

  context 'when viewing the form with no values' do
    it 'does not display required icons for accordions in Smart Handoff Information section' do
      expect(page).to have_no_css('h3.eui-required-o.always-required')
    end

    it 'displays the correct title' do
      within 'header .collection-basics > h2' do
        expect(page).to have_content('Smart Handoff Information')
      end
    end

    it 'displays the form title in the breadcrumbs' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Tool Drafts')
        expect(page).to have_content('Smart Handoff Information')
      end
    end

    it 'displays the correct sections' do
      expect(page).to have_css('.eui-accordion__header > h3', text: 'Search Action')
    end

    it 'displays the correct number of required fields' do
      expect(page).to have_no_selector('label.eui-required-o')
    end
  end

  context 'when filling out the form' do
    let(:search_text) do
      "A little chant may not seem like a real spell, but it can still bring magickal results if you put your heart into it. Use this spell when you are looking for something you've misplaced in your home. You just need a white candle.
        Light the candle, and put it in a holder that is easy to carry. Begin to walk from room to room with it, repeating the following:
      I need what I seek
      Give me a peek
      Draw my eyes
      For my prize.
      Let your eyes wander around until you feel drawn to the spot where your missing item is hiding."
    end

    before do
      fill_in 'Search Action Element', with: search_text
    end

    context "when clicking 'Save' to save the form" do
      before do
        within '.nav-top' do
          click_on 'Save'
        end
      end

      it 'saves the values, displays a confirmation message, and repopulates the form' do
        expect(page).to have_content('Tool Draft Updated Successfully!')

        expect(page).to have_field('Search Action Element', with: search_text)
      end

      it 'displays the correct number of required fields' do
        expect(page).to have_no_selector('label.eui-required-o')
      end
    end
  end
end
