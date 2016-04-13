require 'rails_helper'

describe 'Publishing draft cloned from collection with non url encoded native id', js: true, reset_provider: true do
  context 'when editing a published collection' do
    before do
      login
      user = User.first
      user.provider_id = 'LARC'
      user.available_providers << 'LARC'
      user.save

      click_on 'Find'
      click_on 'Last Page'
      click_on 'MI1B1'

      click_on 'Clone this Record'
    end

    it 'displays a message that the draft needs a unique Short Name' do
      expect(page).to have_link('Records must have a unique Short Name. Click here to enter a new Short Name.')
    end

    it 'creates a new draft' do
      expect(Draft.count).to eq(1)
    end

    context 'when the draft has a non url encoded native id and is ready to be published' do
      before do

        # change native id
        draft = Draft.last
        draft.native_id = 'an & unfriendly, not / well encoded native - id'
        draft.draft.delete('MetadataAssociations')
        draft.save

        # clear invalid data
        within '.metadata' do
          click_on 'Organizations', match: :first
        end
        within '#organizations' do
          add_responsibilities('organizations')
        end
        within '.nav-top' do
          click_on 'Save & Done'
        end

        # add required data
        within '.metadata' do
          click_on 'Collection Information', match: :first
        end
        fill_in 'Short Name', with: 'cloned MI1B1'
        within '.nav-top' do
          click_on 'Save & Done'
        end
      end

      it 'is has all required fields filled and no errors' do
        expect(page).to have_no_css('.eui-icon.eui-required-o.icon-green')
        expect(page).to have_no_css('.eui-fa-minus-circle.icon-red')
      end

      context 'when publishing the draft' do
        before do
          click_on 'Publish'
        end

        it 'displays a confirmation message' do
          expect(page).to have_content('Draft was successfully published')
        end

        it 'displays the published record page' do
          expect(page).to have_content 'PUBLISHED RECORD'
        end

        it 'deletes the draft from the database' do
          expect(Draft.count).to eq(0)
        end
      end
    end
  end
end
