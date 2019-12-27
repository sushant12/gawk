defmodule GawkWeb.RoomController do
  use GawkWeb, :controller
  alias Gawk.Room
  alias Gawk.Repo

  def new(conn, _params) do
    changeset = Room.changeset(%Room{}, %{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"room" => room}) do
    changeset = Room.changeset(%Room{}, room)

    case Repo.insert(changeset) do
      {:ok, %Gawk.Room{name: name}} ->
        conn
        |> redirect(to: Routes.contest_path(conn, :index, name))

      {:error, changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end
end
