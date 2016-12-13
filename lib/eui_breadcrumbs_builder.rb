# The EuiBreadcrumbsBuilder is a Eui compatible breadcrumb builder.
# It provides basic functionalities to render a breadcrumb navigation according to Eui's conventions.
#
# EuiBreadcrumbsBuilder accepts a limited set of options:
# * separator: what should be displayed as a separator between elements
#
# You can use it with the :builder option on render_breadcrumbs:
#     <%= render_breadcrumbs :builder => ::EuiBreadcrumbsBuilder, :separator => "&raquo;" %>
#
# Note: You may need to adjust the autoload_paths in your config/application.rb file for rails to load this class:
#     config.autoload_paths += Dir["#{config.root}/lib/"]
#
class EuiBreadcrumbsBuilder < BreadcrumbsOnRails::Breadcrumbs::Builder
  def render
    return '' unless @elements.any?

    @context.content_tag(:div, class: 'content') do
      @context.content_tag(:div, class: 'eui-breadcrumbs') do
        @context.content_tag(:ol, class: 'eui-breadcrumbs__list') do
          @elements.collect do |element|
            render_element(element)
          end.join.html_safe
        end
      end
    end
  end

  def render_element(element)
    current = @context.current_page?(compute_path(element))

    element_classes = ['eui-breadcrumbs__item']
    element_classes << 'active' if current

    @context.content_tag(:li, class: element_classes) do
      @context.link_to_unless_current(compute_name(element), compute_path(element), element.options)
    end
  end
end
