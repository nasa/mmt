# add a rake task to make it easy to navigate ruby code with VIM using ctr-] and
# to jump and ctr-t to return
# @author thomas.a.cherry
namespace :ctags do
  desc "generate ctags from ruby files to make vim more fun"
  task :ctags do
 	sh 'ctags -R --languages=ruby --exclude=.git --exclude=log .'
  end
end
