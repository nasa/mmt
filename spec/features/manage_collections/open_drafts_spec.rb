# Basic draft creation and retrieval via the list on the Manage Collections page are tested in draft_creation_spec.rb

describe 'Collection Drafts listed on the Manage Collections page', js: true do
  draft_display_max_count = 5 # Should agree with @draft_display_max_count found in manage_collections_controller

  before do
    @other_user_id = User.create(urs_uid: 'adminuser').id

    @current_user_id = User.create(urs_uid: 'testuser').id
    login
  end

  context 'when no drafts exist' do
    before do
      visit manage_collections_path
    end

    it 'no drafts are displayed' do # Test correct display of edge condition of zero drafts
      expect(page).to have_content('MMT_2 Collection Drafts')

      within '.open-drafts' do
        expect(page).to have_content('MMT_2 has no drafts to display.')
      end
    end
  end

  context 'when there are open drafts from multiple users' do
    before do
      # create 2 drafts per user
      2.times { create(:collection_draft, user_id: @current_user_id) }
      2.times { create(:collection_draft, user_id: @other_user_id) }

      visit manage_collections_path
    end

    it 'displays all the drafts' do
      within '.open-drafts' do
        expect(page).to have_content('<Blank Short Name>', count: 4)
      end
    end
  end

  context "when more than #{draft_display_max_count} open drafts exist" do
    before do
      # create draft_display_max_count drafts per user
      draft_display_max_count.times { create(:collection_draft, user_id: @current_user_id) }
      draft_display_max_count.times { create(:collection_draft, user_id: @other_user_id) }

      visit manage_collections_path
    end

    it '"More" is displayed' do
      within '.open-drafts' do
        expect(page).to have_link('More')
      end
    end

    context 'when "More" is clicked on' do
      before do
        within '.open-drafts' do
          click_on 'More'
        end
      end

      it 'the Collection Drafts index page is displayed with all the open drafts' do
        expect(page).to have_content('<Blank Short Name>', count: (draft_display_max_count * 2))
      end

      it 'the Collection Drafts index page has links for Downloading JSON' do
        expect(page).to have_link('Download JSON', count: (draft_display_max_count * 2))
      end

      context 'when "<Blank Short Name>" is clicked on' do
        before do
          click_on '<Blank Short Name>', match: :first
        end

        it 'the record is opened for view/edit' do
          within '.eui-breadcrumbs' do
            expect(page).to have_content('Collection Drafts')
          end
          expect(page).to have_content('Warning: Your Collection Draft has missing or invalid fields.')
        end
      end
    end
  end
end
