# MMT-351

require 'rails_helper'

describe 'Draft permissions' do
  let(:short_name)  { 'Draft Title' }
  let(:entry_title) { 'Tropical Forest Observation Record' }
  let(:provider)    { 'MMT_2' }

  before do
    login

    create(:full_draft, entry_title: entry_title, short_name: short_name, draft_entry_title: entry_title, draft_short_name: short_name, provider_id: provider)
  end

  let(:draft) { Draft.first }
  # let(:draft) { Draft.find_by(entry_title: entry_title) }

  context 'when the draft provider is in the users available providers', js: true do
    before do
      user = User.first
      user.provider_id = 'MMT_1'
      user.available_providers = %w(MMT_1 MMT_2)
      user.save
    end

    context 'when trying to visit the draft page directly' do
      before do
        visit draft_path(draft)
      end

      it 'displays warning banner link to change provider' do
        expect(page).to have_css('.eui-banner--warn')
        expect(page).to have_content('You need to change your current provider to view this draft')
      end

      context 'when clicking on warning banner link' do
        before do
          click_on 'You need to change your current provider to view this draft'

          wait_for_ajax
        end

        it 'switches the provider context' do
          expect(User.first.provider_id).to eq('MMT_2')
        end

        it 'goes to the draft preview page' do
          within '.eui-breadcrumbs' do
            expect(page).to have_content('Drafts')
            expect(page).to have_content("#{short_name}_1")
          end

          expect(page).to have_content("#{short_name}_1")
          expect(page).to have_content('Publish Draft')
          expect(page).to have_content('Delete Draft')
        end
      end
    end

    context 'when trying to visit the edit draft collection information page directly' do
      before do
        # visit "/drafts/#{draft.id}/edit/collection_information"
        visit draft_edit_form_path(draft, 'collection_information', anchor: 'collection-information')
      end

      it 'displays warning banner link to change provider' do
        expect(page).to have_css('.eui-banner--warn')
        expect(page).to have_content('You need to change your current provider to edit this draft')
      end

      context 'when clicking on warning banner link' do
        before do
          click_on 'You need to change your current provider to edit this draft'

          wait_for_ajax
        end

        it 'switches the provider context' do
          expect(User.first.provider_id).to eq('MMT_2')
        end

        it 'goes to the edit draft collection information page' do
          within '.eui-breadcrumbs' do
            expect(page).to have_content('Collection Information')
          end
          within 'header .collection-basics' do
            expect(page).to have_content('Collection Information')
          end
          expect(page).to have_field('Short Name')
          expect(page).to have_field('Entry Title')
        end
      end
    end
  end

  context 'when the draft provider is not in the user available providers' do
    before do
      user = User.first
      user.provider_id = 'LARC'
      user.available_providers = ['LARC']
      user.save
    end

    context 'when trying to visit the draft page directly' do
      before do
        visit draft_path(draft)
      end

      it 'displays no permissions banner message' do
        expect(page).to have_css('.eui-banner--danger')
        expect(page).to have_content('You don\'t have the appropriate permissions to view this draft')
      end

      it 'displays the Access Denied message' do
        expect(page).to have_content('Access Denied')
        expect(page).to have_content('It appears you do not have access to this content.')
      end
    end

    context 'when trying to visit the edit draft page directly' do
      before do
        visit edit_draft_path(draft)
      end

      it 'displays no permisssions banner message' do
        expect(page).to have_css('.eui-banner--danger')
        expect(page).to have_content('You don\'t have the appropriate permissions to edit this draft')
      end

      it 'displays the Access Denied message' do
        expect(page).to have_content('Access Denied')
        expect(page).to have_content('It appears you do not have access to this content.')
      end
    end
  end
end
