#MMT-57

require 'rails_helper'


describe 'Draft creation' do
  before do
    login
  end

  context 'when creating a new draft from scratch' do
    before do
      create_new_draft
    end

    it 'creates a new blank draft record' do
      expect(page).to have_content('Untitled Collection Record')
    end

    it 'creates a new draft in the database' do
      expect(Draft.count).to eq(1)
    end

    context 'when viewing the dashboard page' do
      before do
        visit '/dashboard'
      end

      it 'displays the new draft' do
        within('.open-drafts') do
          expect(page).to have_content("#{today_string} | <Blank Entry Id>")
          expect(page).to have_content("<Untitled Collection Record>")
        end
      end

      context 'when clicking on the draft title' do
        before do
          within('.open-drafts') do
            click_on '<Blank Entry Id>'
          end
        end

        it 'displays the draft record page' do
          expect(page).to have_content('Draft Record')
        end
      end
    end
  end


end
