set :css_dir, 'css'
set :js_dir, 'js'
set :fonts_dir, 'fonts'
activate :bh
activate :sprockets
activate :directory_indexes
page "/content/*", :layout => "content"
sprockets.append_path 'bower_components/bootstrap-sass/assets/fonts'
sprockets.append_path 'bower_components'
configure :build do
  ignore "*.less"
end
