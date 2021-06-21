describe 'Conditionally required fields for Service forms', js: true do
  before do
    login
  end

  context 'when viewing an empty form' do
    let(:draft) { create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first) }

    context 'when viewing a form with always required fields' do
      before do
        visit edit_service_draft_path(draft)
      end

      it 'displays the required icons' do
        expect(page).to have_css('label.eui-required-o', count: 6)
      end
    end

    context 'when viewing a form with conditionally required fields' do
      before do
        visit edit_service_draft_path(draft, 'service_quality')
        open_accordions
      end

      it 'does not display required icons' do
        expect(page).to have_no_css('label.eui-required-o')
      end

      context 'when filling in a form field that causes fields to become required' do
        before do
          fill_in 'Traceability', with: 'testing'

          find('body').click
        end

        it 'displays the required icons' do
          expect(page).to have_css('label.eui-required-o', count: 1)
        end

        context 'when clearing a field that causes fields to become required' do
          before do
            fill_in 'Traceability', with: ''
          end

          it 'removes the required icons' do
            expect(page).to have_no_css('label.eui-required-o')
          end
        end
      end
    end
  end

  context 'when viewing a form with data' do
    let(:draft) { create(:full_service_draft, user: User.where(urs_uid: 'testuser').first) }

    context 'when viewing a form with always required fields' do
      before do
        visit edit_service_draft_path(draft)
      end

      it 'displays the required icons' do
        expect(page).to have_css('label.eui-required-o', count: 6)
      end
    end

    context 'when viewing a form with conditionally required fields' do
      before do
        visit edit_service_draft_path(draft, 'service_quality')
        open_accordions
      end

      it 'displays the required icons' do
        expect(page).to have_css('label.eui-required-o', count: 1)
      end
    end
  end
end
