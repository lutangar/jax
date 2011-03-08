begin
  require 'bundler'
  Bundler::GemHelper.install_tasks
rescue LoadError
  puts " *** You don't seem to have Bundler installed. ***"
  puts "     Please run the following command:"
  puts
  puts "       gem install bundler --version=1.0.10"
  exit
end

DEPENDENCIES = %w(jasmine sprockets)
DEPENDENCIES.each do |dep|
  begin
    require dep
  rescue LoadError
    system("bundle", "install")
    exec("bundle", "exec", "rake", *ARGV)
  end
end

# pdoc is a different beast because the released gem seems to be quite dated,
# and is incompatible with Ruby 1.9.2. We'll grab the latest from git, instead.
begin
  require File.join(File.dirname(__FILE__), 'vendor/pdoc/lib/pdoc')
rescue LoadError
  puts "You don't seem to have pdoc. Fetching..."
  if !system("git", "submodule", "init") || !system("git", "submodule", "update")
    puts "Couldn't fetch pdoc. Make sure you have git installed."
    exit
  end
  require File.join(File.dirname(__FILE__), 'vendor/pdoc/lib/pdoc')
end

load 'jasmine/tasks/jasmine.rake'

module Jasmine
  class RunAdapter
    alias _run run
    #noinspection RubyUnusedLocalVariable
    def run(focused_suite = nil)
      # overridden method so that we can run the Jax compile task before each request
      # this way we don't have to regenerate every time we make a development change
      Rake::Task['compile'].invoke
      Rake::Task['compile'].reenable
      _run(focused_suite)
    end
  end
end

desc "compile Jax"
task :compile do

  secretary = Sprockets::Secretary.new(
          :asset_root => "public",
          :load_path => ["src"],
          :source_files => ["src/jax.js"]
  )
  FileUtils.rm_rf "dist"
  FileUtils.mkdir_p "dist"
  secretary.concatenation.save_to "dist/jax.js"
  
  FileUtils.cp File.join(File.dirname(__FILE__), "src/prototype.js"), File.join(File.dirname(__FILE__), "dist/prototype.js")
end

namespace :doc do
  desc "build the Jax JavaScript documentation"
  task :js do
    require File.join(File.dirname(__FILE__), "lib/jax")
    FileUtils.rm_rf 'doc'
    
    PDoc.run({
      :source_files => [File.join('src', 'jax.js')] + Dir[File.join('src', 'jax', '**', '*.js')],
      :destination  => "doc",
#      :index_page   => 'src/README.markdown',
      :syntax_highlighter => 'coderay',
      :markdown_parser    => :bluecloth,
      :src_code_text => "View source on GitHub &rarr;",
      :src_code_href => proc { |obj|
        "https://github.com/sinisterchipmunk/jax/tree/master/#{obj.file}#L#{obj.line_number}"
      },
      :pretty_urls => false,
      :bust_cache  => false,
      :name => 'Jax WebGL Framework',
      :short_name => 'Jax',
      :home_url => 'http://jax.thoughtsincomputation.com',
      :version => Jax::VERSION,
#      :index_header => "",
#      :footer => '',
#      :assets => 'doc_assets'
    })

    Dir['src/**/.*.pdoc.yaml'].each { |f| FileUtils.rm f }
  end
end

task :jasmine => :compile
task :default => :compile
