describe 'Collection draft permissions' do
  let(:short_name)  { 'Draft Title' }
  let(:entry_title) { 'Tropical Forest Observation Record' }
  let(:provider)    { 'MMT_2' }

  before do
    login

    create(:full_collection_draft, entry_title: entry_title, short_name: short_name, draft_entry_title: entry_title, draft_short_name: short_name, provider_id: provider)
  end

  let(:draft) { Draft.first }

  context 'when the draft provider is in the users available providers', js: true do
    before do
      login(provider: 'MMT_1', providers: %w(MMT_1 MMT_2))
    end

    context 'when trying to visit the collection draft show page directly' do
      before do
        visit collection_draft_path(draft)
      end

      it 'displays the collection draft show page' do
        within '.eui-breadcrumbs' do
          expect(page).to have_content('Collection Drafts')
          expect(page).to have_content("#{short_name}_1")
        end
      end

      it 'does not display the collection draft preview' do
        expect(page).to have_no_content('Publish Collection Draft')
        expect(page).to have_no_content('Save As Template')
        expect(page).to have_no_content('Delete Collection Draft')
        expect(page).to have_no_content('Metadata Preview')


        expect(page).to have_no_content(entry_title)

        expect(page).to have_no_content('Science Keywords:')
        expect(page).to have_no_content('Spatial Extent:')
        expect(page).to have_no_content('Data Format(s):')
        expect(page).to have_no_content('Temporal Extent:')
        expect(page).to have_no_content('Platform(s):')
        expect(page).to have_no_content('Data Center(s):')
        expect(page).to have_no_content('Instrument(s):')
        expect(page).to have_no_content('Version:')
      end

      it 'displays a banner message to change provider the Not Current Provider content' do
        expect(page).to have_css('.eui-banner--warn', text: 'You need to change your current provider to show this draft. Click here to change your provider.')

        expect(page).to have_content('Not Current Provider')
        expect(page).to have_content('It appears you need to change your current provider to access to this content.')
      end

      context 'when clicking on warning banner link' do
        before do
          click_on 'You need to change your current provider to show this draft'

          wait_for_jQuery
        end

        it 'switches the provider context' do
          expect(User.first.provider_id).to eq('MMT_2')
        end

        it 'displays the collection draft show page' do
          within '.eui-breadcrumbs' do
            expect(page).to have_content('Collection Drafts')
            expect(page).to have_content("#{short_name}_1")
          end

          within '.collection-short-name' do
            expect(page).to have_content(short_name)
          end

          within '.collection-title' do
            expect(page).to have_content(entry_title)
          end
        end

        it 'displays the collection draft preview information' do
          within '.collection-overview-table' do
            expect(page).to have_content('Science Keywords:')
            expect(page).to have_content('Spatial Extent:')
            expect(page).to have_content('Data Format(s):')
            expect(page).to have_content('Temporal Extent:')
            expect(page).to have_content('Platform(s):')
            expect(page).to have_content('Data Center(s):')
            expect(page).to have_content('Instrument(s):')
            expect(page).to have_content('Version:')
          end
        end
      end
    end

    context 'when trying to visit the edit draft collection information page directly' do
      before do
        # visit "/drafts/#{draft.id}/edit/collection_information"
        visit edit_collection_draft_path(draft, 'collection_information', anchor: 'collection-information')
      end

      it 'displays the collection draft show page' do
        within '.eui-breadcrumbs' do
          expect(page).to have_content('Collection Drafts')
          expect(page).to have_content("#{short_name}_1")
        end
      end

      it 'does not display the collection draft preview' do
        expect(page).to have_no_content('Publish Collection Draft')
        expect(page).to have_no_content('Save As Template')
        expect(page).to have_no_content('Delete Collection Draft')
        expect(page).to have_no_content('Metadata Preview')

        expect(page).to have_no_content(entry_title)

        expect(page).to have_no_content('Science Keywords:')
        expect(page).to have_no_content('Spatial Extent:')
        expect(page).to have_no_content('Data Format(s):')
        expect(page).to have_no_content('Temporal Extent:')
        expect(page).to have_no_content('Platform(s):')
        expect(page).to have_no_content('Data Center(s):')
        expect(page).to have_no_content('Instrument(s):')
        expect(page).to have_no_content('Version:')
      end

      it 'displays a banner message to change provider the Not Current Provider content' do
        expect(page).to have_css('.eui-banner--warn', text: 'You need to change your current provider to edit this draft. Click here to change your provider.')

        expect(page).to have_content('Not Current Provider')
        expect(page).to have_content('It appears you need to change your current provider to access to this content.')
      end

      context 'when clicking on warning banner link' do
        before do
          click_on 'You need to change your current provider to edit this draft'

          wait_for_jQuery
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
      login(provider: 'LARC', providers: %w(LARC))
    end

    context 'when trying to visit the draft page directly' do
      before do
        visit collection_draft_path(draft)
      end

      it 'redirects to the Manage Collections page' do
        within 'main header' do
          expect(page).to have_css('h2.current', text: 'Manage Collections')
        end
      end

      it 'displays a no permissions banner message' do
        expect(page).to have_css('.eui-banner--danger')
        expect(page).to have_content('It appears you do not have access to view the Collection Draft for this provider.')
        expect(page).to have_content('If you feel you should have access, please check with your provider manager or ensure you are logged into the correct provider.')
      end
    end

    context 'when trying to visit the edit draft page directly' do
      before do
        visit edit_collection_draft_path(draft)
      end

      it 'redirects to the Manage Collections page' do
        within 'main header' do
          expect(page).to have_css('h2.current', text: 'Manage Collections')
        end
      end

      it 'displays a no permissions banner message' do
        expect(page).to have_css('.eui-banner--danger')
        expect(page).to have_content('It appears you do not have access to edit the Collection Draft for this provider.')
        expect(page).to have_content('If you feel you should have access, please check with your provider manager or ensure you are logged into the correct provider.')
      end
    end
  end
end
