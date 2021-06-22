module Helpers
  module ValidationHelpers
    def addtl_attr_check_validation_and_progress_circles(value, data_type, error_present: false)
      fill_in 'Value', with: value
      find('#draft_additional_attributes_0_data_type').click

      if error_present
        expect(page).to have_content("Value [#{value}] is not a valid value for type [#{data_type}].")
      else
        expect(page).to have_no_content("Value [#{value}] is not a valid value for type [#{data_type}].")
      end

      within '.nav-top' do
        click_on 'Done'
      end

      if error_present
        find('#invalid-draft-accept').click
        expect(page).to have_css('.eui-icon.eui-fa-minus-circle.icon-red.additional-attributes')
        find('.eui-icon.eui-fa-minus-circle.icon-red.additional-attributes').click
      else
        expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.additional-attributes')
        find('.eui-icon.eui-fa-circle.icon-grey.additional-attributes').click
      end
    end
  end
end
