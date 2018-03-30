set :css_dir, 'css'
set :js_dir, 'js'
set :fonts_dir, 'fonts'
activate :bh
activate :sprockets
activate :directory_indexes
activate :asset_hash
page "/pages/poetry/*", :layout => "text"
page "/pages/*", :layout => "content"
sprockets.append_path 'bower_components/bootstrap-sass/assets/fonts'
sprockets.append_path 'bower_components'
configure :development do
  activate :google_analytics do |ga|
    ga.tracking_id = false
  end
end
configure :build do
  ignore "*.less"
  activate :google_analytics do |ga|
    ga.tracking_id = 'UA-8210342-1'
  end
end
