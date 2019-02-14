describe 'Variable Generation Headers' do
  before do
    login
  end

  context 'when viewing the header' do
    context 'when viewing the variable generation collection search page' do
      before do
        visit new_variable_generation_processes_search_path
      end

      it 'has "Manage Variables" as the underlined current header link' do
        within 'main header' do
          expect(page).to have_css('h2.current', text: 'Manage Variables')
        end
      end
    end

    # TODO: right now this requires going through the entire process so we
    # should either wait for a less expensive way to do this or move it
    # context 'when viewing the variable generation processes ___ page' do
    #   before do
    #   end
    #
    #   it 'has "Manage Variables" as the underlined current header link' do
    #     within 'main header' do
    #       expect(page).to have_css('h2.current', text: 'Manage Variables')
    #     end
    #   end
    # end
  end
end
