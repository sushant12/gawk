defmodule GawkWeb.ContestController do
  use GawkWeb, :controller

  def index(conn, %{"id" => room_id} = params) do
    render(conn, "index.html", room_id: room_id)
  end
end
