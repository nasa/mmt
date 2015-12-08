# MMT-52

require 'rails_helper'

describe 'Draft form help text', js: true do
  before do
    login
    draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
    visit draft_path(draft)
  end

  context 'when viewing a form' do
    context 'when clicking on the help icon with a description' do
      before do
        within '.metadata' do
          click_on 'Collection Information'
        end

        open_accordions

        find(:xpath, "//a/i[@data-help-path='properties/ShortName']/..").click # ShortName
      end

      it 'displays the field name in a modal' do
        expect(page).to have_content('Short Name')
      end

      it 'displays the description in a modal' do
        expect(page).to have_content('The short name associated with the collection.')
      end
    end

    context 'when clicking on the help icon with minItems' do
      before do
        within '.metadata' do
          click_on 'Distribution Information'
        end

        open_accordions

        find(:xpath, "(//a/i[@data-help-path='definitions/RelatedUrlType/properties/URLs'])[1]/..").click # URLs
      end

      it 'displays the validation clue in the modal' do
        expect(page).to have_content('Minimum Items: 1')
      end
    end

    context 'when clicking on the help icon with minLength' do
      before do
        within '.metadata' do
          click_on 'Collection Information'
        end

        open_accordions

        find(:xpath, "//a/i[@data-help-path='properties/ShortName']/..").click # ShortName
      end

      it 'displays the validation clue in the modal' do
        expect(page).to have_content('Minimum Length: 1')
      end
    end

    context 'when clicking on the help icon with maxLength' do
      before do
        within '.metadata' do
          click_on 'Collection Information'
        end

        open_accordions

        find(:xpath, "//a/i[@data-help-path='properties/ShortName']/..").click # ShortName
      end

      it 'displays the validation clue in the modal' do
        expect(page).to have_content('Maximum Length: 80')
      end
    end

    # context 'when clicking on the help icon with a pattern' do
    #   before do
    #     find(:xpath, "//a/i[@data-help-path='definitions/OrganizationNameType/properties/Uuid']/..").click # Uuid
    #   end
    #
    #   it 'displays the validation clue in the modal' do
    #     expect(page).to have_content('Pattern: [0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89abAB][0-9a-f]{3}-[0-9a-f]{12}')
    #   end
    # end

    context 'when clicking on the help icon with a format' do
      before do
        within '.metadata' do
          click_on 'Data Identification'
        end

        open_accordions

        find(:xpath, "//a/i[@data-help-path='definitions/DateType/properties/Date']/..").click # Date
      end

      it 'displays the validation clue in the modal' do
        expect(page).to have_content("Format: date-time (yyyy-MM-dd'T'HH:mm:ssZ)")
      end
    end
  end
end
