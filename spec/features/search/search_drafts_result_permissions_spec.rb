# MMT-389

require 'rails_helper'

describe 'Search results permissions for drafts', js: true do
  let(:short_name)  { 'Climate Change' }
  let(:entry_title) { 'Climate Observation Record' }
  let(:provider)    { 'MMT_2' }
  let(:version)     { '5' }

  context 'when searching drafts' do
    before do
      login

      create(:full_draft, entry_title: entry_title, short_name: short_name, draft_entry_title: entry_title, draft_short_name: short_name, provider_id: provider, version: version)
    end

    context 'when drafts are from current provider' do
      before do
        full_search(keyword: entry_title, record_type: 'Drafts')
      end

      it 'search results contain the draft' do
        expect(page).to have_search_query(1, "Keyword: #{entry_title}", 'Record State: Draft Records')
        within '#collection_search_results' do
          expect(page).to have_content(short_name)
          expect(page).to have_content(entry_title)
          expect(page).to have_content(provider)
          expect(page).to have_content(today_string)
        end
      end

      context 'when trying to view draft preview page' do
        before do
          within '#collection_search_results' do
            click_on short_name
          end
        end

        it 'allows user to view the draft preview page' do
          within '.eui-breadcrumbs' do
            expect(page).to have_content('Drafts')
            expect(page).to have_content("#{short_name}_#{version}")
          end

          expect(page).to have_content("#{short_name}_#{version}")
          expect(page).to have_content(entry_title)
          expect(page).to have_content('Publish Draft')
          expect(page).to have_content('Delete Draft')
        end
      end
    end

    context 'when drafts are from available providers' do
      let(:provider_id) { 'MMT_1' }

      before do
        User.first.update(provider_id: provider_id)

        full_search(keyword: short_name, record_type: 'Drafts')
      end

      it 'search results contain the draft' do
        expect(page).to have_search_query(1, "Keyword: #{short_name}", 'Record State: Draft Records')
        expect(page).to have_content(short_name)
        expect(page).to have_content(entry_title)
        expect(page).to have_content(provider)
        expect(page).to have_content(today_string)
      end

      context 'when trying to view the draft' do
        before do
          within '#collection_search_results' do
            click_on short_name
          end
        end

        it 'displays a modal informing the user they need to switch providers' do
          expect(page).to have_content("Viewing this draft requires you change your provider context to MMT_2")
        end

        context 'when clicking Yes' do
          before do
            find('.not-current-provider-link').click
            wait_for_ajax
          end

          it 'switches the provider context' do
            expect(User.first.provider_id).to eq('MMT_2')
          end

          it 'shows the draft preview page' do
            within '.eui-breadcrumbs' do
              expect(page).to have_content('Drafts')
              expect(page).to have_content("#{short_name}_#{version}")
            end

            expect(page).to have_content("#{short_name}_#{version}")
            expect(page).to have_content(entry_title)
            expect(page).to have_content('Publish Draft')
            expect(page).to have_content('Delete Draft')
          end
        end
      end
    end

    context 'when drafts are not from available providers' do
      before do
        user = User.first
        user.provider_id = 'SEDAC'
        user.providers = ['SEDAC']
        user.save

        full_search(keyword: short_name, record_type: 'Drafts')
      end

      it 'does not find the drafts' do
        within '#collection_search_results' do
          expect(page).to have_no_content(short_name)
          expect(page).to have_no_content(entry_title)
          expect(page).to have_no_content(provider)
        end
      end
    end
  end
end
