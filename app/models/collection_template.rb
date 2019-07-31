class CollectionTemplate < CollectionDraft
  self.table_name = 'templates'
  # This is not currently needed, but may be if templates are added for services/variables
  self.inheritance_column = :draft_type

  def display_entry_title
    template_name || '<Untitled Template>'
  end
end
