defmodule GawkWeb.PageController do
  use GawkWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
