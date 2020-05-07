# expose the commands used to calculate the Lines of Code. We are using Rake for
# this to allow bamboo to call one common action across applications and get the
# similar responses
# 
# Usage:
# rake sloc:cloc - run the cloc command report
# rake sloc:sloc - run the sloc
# rake sloc:bamboo - expose to bamboo which method should be run for MMT
# 
# @author thomas.a.cherry

namespace :sloc do
  desc 'use the cloc command to analyze the code, warn if not installed'
  task :cloc do
    cloc=`which cloc`
    if cloc.empty?
      puts "run brew cloc before using this feature"
    else
   	  shell_cmd = 'cloc '\
        '--exclude-lang=YAML,HTML,Markdown,XML,Dockerfile,\'Bourne Shell\' '\
        '--exclude-dir=tmp,doc ' \
        '.'
      puts %x( #{shell_cmd} )
    end
  end

  desc 'use the sloccount command to analyze the code, warn if not installed'
  task :sloc do
    cloc=`which sloccount`
    if cloc.empty?
      puts "run brew sloccount before using this feature"
    else
   	  shell_cmd = 'sloccount .'
      puts %x( #{shell_cmd} )
    end
  end
  
  desc 'PUBLIC: run the prefered calculation that bamboo is to use'
  task :bamboo => [:cloc]

end
