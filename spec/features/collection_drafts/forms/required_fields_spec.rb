describe 'Conditionally required fields', js: true do
  before do
    login
  end

  context 'when viewing an empty form' do
    before do
      @draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
    end

    context 'when viewing a form with always required fields' do
      before do
        visit edit_collection_draft_path(@draft, form: 'collection_information')
      end

      it 'displays the required icons' do
        expect(page).to have_css('label.eui-required-o', count: 5)
      end
    end

    context 'when viewing a form with conditionally required fields' do
      before do
        visit edit_collection_draft_path(@draft, form: 'related_urls')
        open_accordions
      end

      it 'does not display required icons' do
        expect(page).to have_no_css('label.eui-required-o')
      end

      context 'when filling in a form field that causes fields to become required' do
        before do
          fill_in 'Description', with: 'Testing'

          find('body').click
        end

        it 'displays the required icons' do
          expect(page).to have_css('label.eui-required-o', count: 3)
        end

        context 'when clearing a field that causes fields to become required' do
          before do
            fill_in 'Description', with: ''
          end

          it 'removes the required icons' do
            expect(page).to have_no_css('label.eui-required-o')
          end
        end
      end
    end
  end

  context 'when viewing a form with data' do
    before do
      @draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first)
    end

    context 'when viewing a form with always required fields' do
      before do
        visit edit_collection_draft_path(@draft, form: 'collection_information')
      end

      it 'displays the required icons' do
        expect(page).to have_css('label.eui-required-o', count: 5)
      end
    end

    context 'when viewing a form with conditionally required fields' do
      before do
        visit edit_collection_draft_path(@draft, form: 'related_urls')
        open_accordions
      end

      it 'displays the required icons' do
        expect(page).to have_css('label.eui-required-o', count: 24)
      end
    end
  end
end
