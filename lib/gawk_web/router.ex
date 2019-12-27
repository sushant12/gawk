defmodule GawkWeb.Router do
  use GawkWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", GawkWeb do
    pipe_through :browser

    get "/", RoomController, :new
    post "/", RoomController, :create
    get "/contest/:id", ContestController, :index
  end

  # Other scopes may use custom stacks.
  # scope "/api", GawkWeb do
  #   pipe_through :api
  # end
end
