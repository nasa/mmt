describe 'Clearing saved science keywords', js: true do
  before do
    login
    draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
    visit collection_draft_path(draft)
  end

  context 'when selecting science keywords and saving the form' do
    before do
      within '.metadata' do
        click_on 'Descriptive Keywords'
      end

      click_on 'Expand All'

      # add_science_keywords
      choose_keyword 'EARTH SCIENCE'
      choose_keyword 'ATMOSPHERE'
      choose_keyword 'AEROSOLS'
      click_on 'Add Keyword'

      within '.nav-top' do
        click_on 'Save'
      end

      click_on 'Expand All'
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Collection Draft Updated Successfully!')
    end

    it 'populates the form with the values' do
      expect(page).to have_content('EARTH SCIENCE > ATMOSPHERE > AEROSOLS')
    end

    context 'when removing the science keywords and saving the form' do
      before do
        within '.selected-science-keywords' do
          find('.remove').click
          # remove_script = "$('.selected-science-keywords').find('.remove').click()"
          # page.execute_script(remove_script)
          # sleep 1
        end

        within '.nav-top' do
          click_on 'Save'
        end

        click_on 'Expand All'
      end

      it 'displays a confirmation message' do
        expect(page).to have_content('Collection Draft Updated Successfully!')
      end

      it 'does not display the removed science keywords' do
        expect(page).to have_no_content('EARTH SCIENCE > ATMOSPHERE > AEROSOLS')
      end
    end
  end
end
