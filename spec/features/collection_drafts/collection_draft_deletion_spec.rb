# MMT-58

require 'rails_helper'

describe 'Draft deletion', js: true do
  before do
    login
    draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
    visit collection_draft_path(draft)
  end

  context 'when adding and deleting a single draft' do
    before do
      within('.cta') do
        click_on 'Delete Draft'
        # Accept
        click_on 'Yes'
      end
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Collection Draft Deleted Successfully!')
    # end

    # it 'leaves the draft table in the database empty' do
    #   # intermittent failure, Rspec ExpectationNotMetError
    #   # using #synchronize as described in:
    #   # https://github.com/jnicklas/capybara/blob/master/lib/capybara/node/base.rb#L44
    #   # http://stackoverflow.com/questions/14588241/how-to-use-synchronize-in-capybara-exactly
    #   # http://amcaplan.ninja/blog/2014/07/17/asynchronous-javascript-without-failing-capybara-tests/
    #   page.document.synchronize do
    #     expect(Draft.count).to eq(0)
    #   end
    # end

<<<<<<< HEAD
    # it 'returns to the manage metadata page' do
      expect(page).to have_content('MMT_2 Drafts')
=======
    # it 'returns to the manage collections page' do
      expect(page).to have_content('MMT_2 Collection Drafts')
>>>>>>> cd382ff9f950d136c32630440b8620ab87ba939d
    end
  end

  context 'when cancelling the deletion of a single draft' do
    before do
      within('.cta') do
        click_on 'Delete Draft'
        # Reject
        click_on 'No'
      end
    end

    # it 'leaves the draft in the draft table' do
    #   expect(Draft.count).to eq(1)
    # end

<<<<<<< HEAD
    it 'does NOT return to the manage metadata page' do
      expect(page).to_not have_content('MMT_2 Drafts')
=======
    it 'does NOT return to the manage collections page' do
      expect(page).to_not have_content('MMT_2 Collection Drafts')
>>>>>>> cd382ff9f950d136c32630440b8620ab87ba939d
    end
  end
end
