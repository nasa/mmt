class CollectionTemplate < CollectionDraft
  self.table_name = 'templates'
  # This is not currently needed, but may be if templates are added for services/variables
  self.inheritance_column = :draft_type
  validates_uniqueness_of :template_name, scope: :provider_id

  def display_template_name
    template_name || '<Untitled Template>'
  end

  def display_entry_title
    entry_title || '<Blank Entry Title>'
  end

  def correct_unsaved_draft
    self.draft = convert_to_arrays(self.draft)
  end
end
