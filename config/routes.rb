Rails.application.routes.draw do
  devise_for :users, skip: :registrations

  namespace :api do
    namespace :v1 do
      resources :users, :only => [:index, :show, :create, :update, :destroy] do 
      	resources :deposits, :only => [:create, :update, :destroy]
      end
      resources :sessions, :only => [:create, :destroy]
      resources :deposits, :only => [:show, :index] 
    end
  end

  root to: 'site#index'
  
end
