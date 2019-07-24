class CollectionTemplate < Template
  include CollectionDraftsHelper

  class << self
    def forms
      CollectionDraftsHelper::DRAFT_FORMS
    end

    def get_next_form(name, direction)
      delta = direction == 'Next' ? 1 : -1
      index = CollectionDraftsHelper::DRAFT_FORMS.index(name)
      CollectionDraftsHelper::DRAFT_FORMS[index + delta] || CollectionDraftsHelper::DRAFT_FORMS.first
    end
  end
end
