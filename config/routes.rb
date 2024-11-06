Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/*
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest

  # Defines the root path route ("/")
  root "homepage#index"

  get "order", to: "order#index"
  get "success", to: "order#success"

  namespace :api do
    namespace :v1 do
      get "stripe/products"
      post "stripe/create_checkout_session"
    end
  end

  resource :session, only: [ :new, :create, :destroy ]

  post "/check_current_user", to: "sessions#check_current_user"

  get "/login", to: "sessions#new"
  get "/signup", to: "users#new"

  resources :users, only: [ :create ]

  namespace :stripe do
    resources :events, only: [ :create ]
  end
end
