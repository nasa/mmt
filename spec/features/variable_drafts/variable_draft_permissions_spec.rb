require 'rails_helper'

describe 'Variable draft permissions' do
  let(:short_name)  { 'Draft Title' }
  let(:entry_title) { 'Tropical Forest Observation Record' }
  let(:provider)    { 'MMT_2' }

  before do
    login

    create(:full_variable_draft, entry_title: entry_title, short_name: short_name, draft_entry_title: entry_title, draft_short_name: short_name, provider_id: provider)
  end

  let(:draft) { Draft.first }

  context 'when the draft provider is in the users available providers', js: true do
    before do
      user = User.first
      user.provider_id = 'MMT_1'
      user.available_providers = %w(MMT_1 MMT_2)
      user.save
    end

    context 'when trying to visit the draft page directly' do
      before do
        visit variable_draft_path(draft)
      end

      it 'displays warning banner link to change provider' do
        expect(page).to have_css('.eui-banner--warn')
        expect(page).to have_content('You need to change your current provider to view this Variable Draft')
      end

      context 'when clicking on warning banner link' do
        before do
          click_on 'You need to change your current provider to view this Variable Draft'

          wait_for_ajax
        end

        it 'switches the provider context' do
          expect(User.first.provider_id).to eq('MMT_2')
        end

        it 'goes to the draft preview page' do
          within '.eui-breadcrumbs' do
            expect(page).to have_content('Drafts')
            expect(page).to have_content('<Blank Short Name>')
          end

          expect(page).to have_content(short_name)
          expect(page).to have_content('Publish Variable Draft')
          expect(page).to have_content('Delete Variable Draft')
        end
      end
    end

    context 'when trying to visit the edit draft variable information page directly' do
      before do
        visit edit_variable_draft_path(draft, 'variable_information')
      end

      it 'displays warning banner link to change provider' do
        expect(page).to have_css('.eui-banner--warn')
        expect(page).to have_content('You need to change your current provider to edit this Variable Draft')
      end

      context 'when clicking on warning banner link' do
        before do
          click_on 'You need to change your current provider to edit this Variable Draft'

          wait_for_ajax
        end

        it 'switches the provider context' do
          expect(User.first.provider_id).to eq('MMT_2')
        end

        it 'goes to the edit draft variable information page' do
          within '.eui-breadcrumbs' do
            expect(page).to have_content('Variable Information')
          end
          within 'header .collection-basics' do
            expect(page).to have_content('Variable Information')
          end
          expect(page).to have_field('Name')
          expect(page).to have_field('Long Name')
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
        visit variable_draft_path(draft)
      end

      it 'displays no permissions banner message' do
        expect(page).to have_css('.eui-banner--danger')
        expect(page).to have_content('You don\'t have the appropriate permissions to view this Variable Draft')
      end

      it 'displays the Access Denied message' do
        expect(page).to have_content('Access Denied')
        expect(page).to have_content('It appears you do not have access to this content.')
      end
    end

    context 'when trying to visit the edit draft page directly' do
      before do
        visit edit_variable_draft_path(draft)
      end

      it 'displays no permisssions banner message' do
        expect(page).to have_css('.eui-banner--danger')
        expect(page).to have_content('You don\'t have the appropriate permissions to edit this Variable Draft')
      end

      it 'displays the Access Denied message' do
        expect(page).to have_content('Access Denied')
        expect(page).to have_content('It appears you do not have access to this content.')
      end
    end
  end
end
