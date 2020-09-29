module ModalsHelper

  def modal_close_x_link(alternate_link: nil, alternate_link_condition: nil)
    link = determine_modal_close_href(alternate_link: alternate_link, alternate_link_condition: alternate_link_condition)

    content_tag(:a, '', class: 'modal-close float-r', href: link) do
      concat(content_tag(:i, '', class: 'fa fa-times') do
        concat(content_tag(:span, 'Close', class: 'is-invisible'))
      end)
    end
  end

  def modal_close_button(button_text: 'Close', alternate_link: nil, alternate_link_condition: nil)
    link = determine_modal_close_href(alternate_link: alternate_link, alternate_link_condition: alternate_link_condition)

    content_tag(:a, button_text, class: 'eui-btn modal-close', href: link)
  end

  def determine_modal_close_href(alternate_link:, alternate_link_condition:)
    # condition should be passed such that the alternate link will used
    # when the condition is true
    if alternate_link_condition
      alternate_link
    else
      'javascript:void(0);'
    end
  end
end
