Diaedu::Engine.routes.draw do

  PATH_PREFIXES = {'glyprobs' => 'glycemic-problems'}

  root(:to => 'home#index')

  %w(glyprobs triggers barriers goals).each do |dt|
    prefix = PATH_PREFIXES[dt] || dt
    get("/#{prefix}" => 'kb_objs#index', :data_type => dt)
    post("/#{prefix}" => 'kb_objs#create', :data_type => dt)

    put("/#{prefix}/:id/ensure-topic" => 'kb_objs#ensure_topic', :data_type => dt)

    # id's always are digits and we don't want to take a filter params as an id
    get("/#{prefix}/:id" => 'kb_objs#show', :data_type => dt, :constraints => {:id => /\d+/})
    get("/#{prefix}/:id/:breadcrumb" => 'kb_objs#show', :data_type => dt, :constraints => {:id => /\d+/})

    get("/#{prefix}/:filter_params" => 'kb_objs#index', :data_type => dt)
    get("/#{prefix}/page/:page" => 'kb_objs#index', :data_type => dt)
    get("/#{prefix}/:filter_params/page/:page" => 'kb_objs#index', :data_type => dt)

  end

  get('/plan/:breadcrumb' => 'kb_objs#plan')
  get('/obj/by-topic-id' => 'kb_objs#by_topic_id')
  get('/filter-options' => 'filter_options#fetch')
  get('/tags/suggest' => 'tags#suggest')
  get('/events/suggest' => 'events#suggest')

  post('/evidence' => 'evidence#create')

  get('/login' => 'home#login') # This will be redirected on client side
end
