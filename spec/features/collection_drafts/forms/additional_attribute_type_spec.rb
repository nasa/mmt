describe 'Additional Attribute data type', js: true do
  context 'when viewing the descriptive keywords form' do
    before do
      login
      draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
      visit collection_draft_path(draft)

      within '.metadata' do
        click_on 'Descriptive Keywords'
      end

      click_on 'Expand All'
    end

    context 'when selecting a non-numeric data type' do
      before do
        select 'String', from: 'Data Type'
      end

      it 'disabled invalid fields' do
        expect(page).to have_field('Parameter Range Begin', disabled: true)
        expect(page).to have_field('Parameter Range End', disabled: true)
      end

      context 'when viewing a saved form with a non-numeric data type' do
        before do
          within '.nav-top' do
            click_on 'Save'
          end
          click_on 'Yes'

          click_on 'Expand All'
        end

        it 'disables the invalid fields' do
          expect(page).to have_field('Parameter Range Begin', disabled: true)
          expect(page).to have_field('Parameter Range End', disabled: true)
        end
      end

      context 'when selecting a numeric data type' do
        before do
          select 'Integer', from: 'Data Type'
        end

        it 'enables all fields' do
          expect(page).to have_field('Parameter Range Begin', disabled: false)
          expect(page).to have_field('Parameter Range End', disabled: false)
        end
      end
    end

    context 'when entering an invalid range' do
      before do
        select 'Integer', from: 'Data Type'
        fill_in 'Parameter Range Begin', with: '5'
        fill_in 'Parameter Range End', with: '5'
        find('body').click
      end

      it 'displays an error' do
        expect(page).to have_content('Parameter Range End must be larger than Parameter Range Begin')
      end

      context 'when viewing the preview page with an invalid range' do
        before do
          fill_in 'Name', with: 'Attribute name'

          within '.nav-top' do
            click_on 'Done'
          end
          click_on 'Yes'
        end

        it 'displays an error circle for AdditionalAttributes' do
          within 'a[title="Additional Attributes - Invalid"]' do
            expect(page).to have_css('.icon-red')
          end
        end
      end
    end
  end
end
